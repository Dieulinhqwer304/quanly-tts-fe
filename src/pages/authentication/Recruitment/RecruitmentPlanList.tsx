import { EllipsisOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Input,
    MenuProps,
    message,
    Modal,
    Row,
    Select,
    Table,
    Tag,
    Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { http } from '../../../utils/http';
import { RecruitmentPlan } from '../../../services/Recruitment/recruitmentPlans';
import { RecruitmentPlanModal } from './components/RecruitmentPlanModal';

const { Title, Text } = Typography;

export const RecruitmentPlanList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<RecruitmentPlan | null>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);

    const [plansData, setPlansData] = useState<any>(null);
    const [adjustingApprovalsByPlanId, setAdjustingApprovalsByPlanId] = useState<Record<string, any>>({});
    const [selectedAdjustment, setSelectedAdjustment] = useState<{ planName: string; approval: any } | null>(null);
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            const [plansRes, approvalsRes] = await Promise.all([
                http.get('/recruitment-plans'),
                http.get('/approvals', {
                    params: {
                        type: 'Recruitment',
                        status: 'Adjusting'
                    }
                })
            ]);

            setPlansData(plansRes);

            const approvals = ((approvalsRes as any)?.hits || []) as Array<any>;
            const latestAdjustingByPlanId = approvals.reduce<Record<string, any>>((accumulator, approval) => {
                const entityId = String(approval?.entityId || '');

                if (!entityId || accumulator[entityId]) {
                    return accumulator;
                }

                accumulator[entityId] = approval;
                return accumulator;
            }, {});

            setAdjustingApprovalsByPlanId(latestAdjustingByPlanId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleCreate = () => {
        setEditingPlan(null);
        setIsViewOnly(false);
        setIsModalOpen(true);
    };

    const handleEdit = (record: RecruitmentPlan) => {
        setEditingPlan(record);
        setIsViewOnly(false);
        setIsModalOpen(true);
    };

    const handleView = (record: RecruitmentPlan) => {
        setEditingPlan(record);
        setIsViewOnly(true);
        setIsModalOpen(true);
    };

    const handleMenuClick = (e: any, record: RecruitmentPlan) => {
        if (e.key === 'edit') {
            handleEdit(record);
        } else if (e.key === 'view') {
            handleView(record);
        } else if (e.key === 'view_adjustment_request') {
            const adjustingApproval = adjustingApprovalsByPlanId[record.id];
            setSelectedAdjustment({
                planName: record.name,
                approval: adjustingApproval
            });
            setIsAdjustmentModalOpen(true);
        } else if (e.key === 'delete') {
            Modal.confirm({
                title: t('common.delete_confirm'),
                content: `${t('common.delete_confirm_desc')} ${record.name}?`,
                onOk: async () => {
                    try {
                        await http.delete(`/recruitment-plans/${record.id}`);
                        message.success(t('common.success'));
                        fetchPlans();
                    } catch {
                        message.error(t('common.error'));
                    }
                }
            });
        }
    };

    const getActionMenu = (record: RecruitmentPlan): MenuProps => ({
        items: [
            { key: 'view', label: t('common.view') },
            adjustingApprovalsByPlanId[record.id]
                ? { key: 'view_adjustment_request', label: 'Xem yêu cầu chỉnh sửa' }
                : null,
            { key: 'edit', label: t('common.edit') },
            { type: 'divider' },
            { key: 'delete', label: t('common.delete'), danger: true }
        ].filter(Boolean) as MenuProps['items'],
        onClick: (e) => handleMenuClick(e, record)
    });

    const columns: ColumnsType<RecruitmentPlan> = [
        {
            title: t('recruitment.campaign_name'),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                const hasAdjustmentRequest = Boolean(adjustingApprovalsByPlanId[record.id]);

                return (
                    <div style={{ cursor: 'pointer' }} onClick={() => handleView(record)}>
                        <Text strong style={{ display: 'block', color: '#1E40AF' }}>
                            {text}
                            {hasAdjustmentRequest && (
                                <Text strong style={{ color: '#EF4444', marginLeft: 6 }}>
                                    *
                                </Text>
                            )}
                        </Text>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            {record.batch}
                        </Text>
                    </div>
                );
            }
        },
        {
            title: t('common.department'),
            dataIndex: 'department',
            key: 'department',
            render: (text) => <Text type='secondary'>{text}</Text>
        },
        {
            title: t('candidate.applied_date'),
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => <Text type='secondary'>{text}</Text>
        },
        {
            title: t('candidate.total_applications'),
            dataIndex: 'candidates',
            key: 'candidates',
            render: (count) => (
                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => navigate(RouteConfig.CVList.path)}
                >
                    <Avatar.Group maxCount={3} size='small'>
                        <Avatar src={`https://i.pravatar.cc/150?u=${count}`} />
                    </Avatar.Group>
                    <Text type='secondary' style={{ marginLeft: 8, fontSize: '12px' }}>
                        +{count}
                    </Text>
                </div>
            )
        },
        {
            title: t('common.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                const s = status?.toLowerCase();
                if (s === 'active') color = 'success';
                if (s === 'pending_approval' || s === 'pending') color = 'warning';

                return (
                    <Tag color={color} style={{ borderRadius: '10px' }}>
                        {s === 'active'
                            ? t('internship.active')
                            : s === 'pending_approval' || s === 'pending'
                                ? t('recruitment.pending_approval')
                                : t('recruitment.closed')}
                    </Tag>
                );
            }
        },
        {
            title: t('common.actions'),
            key: 'action',
            width: 80,
            fixed: 'right',
            render: (_, record) => (
                <Dropdown menu={getActionMenu(record)} trigger={['click']}>
                    <Button type='text' icon={<EllipsisOutlined />} />
                </Dropdown>
            )
        }
    ];

    const schedule = [];
    const plans = (plansData?.hits || []) as RecruitmentPlan[];

    const departmentOptions = useMemo(() => {
        const uniqueDepartments = Array.from(
            new Set(
                plans
                    .map((plan) => String(plan.department || '').trim())
                    .filter((department) => department.length > 0)
            )
        ).sort((a, b) => a.localeCompare(b));

        return [{ value: 'all', label: t('recruitment.all_depts') }, ...uniqueDepartments.map((dept) => ({ value: dept, label: dept }))];
    }, [plans, t]);

    const filteredPlans = useMemo(() => {
        return plans.filter((plan) => {
            const normalizedSearchText = searchText.trim().toLowerCase();
            const matchesSearch =
                !normalizedSearchText ||
                String(plan.name || '')
                    .toLowerCase()
                    .includes(normalizedSearchText) ||
                String(plan.batch || '')
                    .toLowerCase()
                    .includes(normalizedSearchText);

            const matchesDepartment =
                departmentFilter === 'all' || String(plan.department || '').toLowerCase() === departmentFilter.toLowerCase();

            const planStatus = String(plan.status || '').toLowerCase();
            const matchesStatus = statusFilter === 'all' || planStatus === statusFilter;

            return matchesSearch && matchesDepartment && matchesStatus;
        });
    }, [plans, searchText, departmentFilter, statusFilter]);

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3}>{t('recruitment.campaigns')}</Title>
            </div>

            <Row gutter={24}>
                <Col xs={24} lg={24}>
                    <Card
                        title={t('recruitment.campaigns')}
                        bordered={false}
                        style={{ borderRadius: '12px' }}
                        extra={
                            <Button type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
                                {t('recruitment.create_new_plan')}
                            </Button>
                        }
                    >
                        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder={t('recruitment.search_campaigns')}
                                style={{ width: 200 }}
                                value={searchText}
                                onChange={(event) => setSearchText(event.target.value)}
                            />
                            <Select
                                value={departmentFilter}
                                style={{ width: 160 }}
                                onChange={setDepartmentFilter}
                                options={departmentOptions}
                            />
                            <Select
                                value={statusFilter}
                                style={{ width: 140 }}
                                onChange={setStatusFilter}
                                options={[
                                    { value: 'all', label: t('recruitment.status_all') },
                                    { value: 'active', label: t('internship.active') },
                                    { value: 'pending_approval', label: t('recruitment.pending_approval') },
                                    { value: 'closed', label: t('recruitment.closed') }
                                ]}
                            />
                        </div>

                        <Table
                            columns={columns as any}
                            dataSource={filteredPlans}
                            scroll={{ x: 'max-content' }}
                            pagination={{
                                total: filteredPlans.length,
                                pageSize: 15
                            }}
                            loading={isLoading}
                            rowKey='id'
                        />
                    </Card>
                </Col>

                <RecruitmentPlanModal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchPlans();
                    }}
                    initialValues={editingPlan as any}
                    viewOnly={isViewOnly}
                />
                <Modal
                    title='Yêu cầu chỉnh sửa từ Giám đốc'
                    open={isAdjustmentModalOpen}
                    onCancel={() => setIsAdjustmentModalOpen(false)}
                    onOk={() => setIsAdjustmentModalOpen(false)}
                    okText='Đã hiểu'
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <div>
                        <Text type='secondary'>Kế hoạch: {selectedAdjustment?.planName || '-'}</Text>
                        <div style={{ marginTop: 12 }}>
                            <Text strong>Nội dung yêu cầu:</Text>
                            <div style={{ marginTop: 8 }}>
                                {selectedAdjustment?.approval?.notes ||
                                    'Giám đốc đã yêu cầu chỉnh sửa kế hoạch này. Vui lòng cập nhật và gửi lại.'}
                            </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <Text strong>Lịch sử yêu cầu chỉnh sửa:</Text>
                            {Array.isArray(selectedAdjustment?.approval?.details?.directorActionHistory) &&
                            selectedAdjustment?.approval?.details?.directorActionHistory?.length ? (
                                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {selectedAdjustment.approval.details.directorActionHistory
                                        .filter((history: any) => history?.action === 'Adjusting')
                                        .sort(
                                            (first: any, second: any) =>
                                                new Date(second.actedAt || second.updatedAt || 0).getTime() -
                                                new Date(first.actedAt || first.updatedAt || 0).getTime()
                                        )
                                        .map((history: any, index: number) => (
                                            <div
                                                key={`${history.actedAt || history.updatedAt || index}`}
                                                style={{
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: 8,
                                                    padding: '8px 10px',
                                                    background: '#FAFAFA'
                                                }}
                                            >
                                                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
                                                    {new Date(
                                                        history.actedAt || history.updatedAt || Date.now()
                                                    ).toLocaleString('vi-VN')}
                                                </div>
                                                <div>{history.note || 'Không có ghi chú.'}</div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div style={{ marginTop: 8, color: '#6B7280' }}>Chưa có lịch sử chỉnh sửa.</div>
                            )}
                        </div>
                        <div style={{ marginTop: 12, color: '#6B7280', fontSize: 12 }}>
                            {selectedAdjustment?.approval?.updatedAt
                                ? `Cập nhật lúc: ${new Date(selectedAdjustment.approval.updatedAt).toLocaleString('vi-VN')}`
                                : ''}
                        </div>
                    </div>
                </Modal>
            </Row>
        </div>
    );
};
