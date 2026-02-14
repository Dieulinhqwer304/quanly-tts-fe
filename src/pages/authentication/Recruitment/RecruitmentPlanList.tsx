import { EllipsisOutlined, FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useInterviews } from '../../../hooks/Recruitment/useInterviews';
import { useRecruitmentPlans } from '../../../hooks/Recruitment/useRecruitmentPlans';
import { useDashboardStats } from '../../../hooks/useDashboardStats';
import { RecruitmentPlan } from '../../../services/Recruitment/recruitmentPlans';
import { RecruitmentPlanModal } from './components/RecruitmentPlanModal';

const { Title, Text } = Typography;

export const RecruitmentPlanList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<RecruitmentPlan | null>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);

    const { data: plansData, isLoading: plansLoading, refetch } = useRecruitmentPlans();
    const { data: statsData, isLoading: statsLoading } = useDashboardStats();
    const { data: interviewsData, isLoading: interviewsLoading } = useInterviews({
        pagination: { page: 1, pageSize: 3 }
    });

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
        } else if (e.key === 'delete') {
            Modal.confirm({
                title: t('common.delete_confirm'),
                content: `${t('common.delete_confirm_desc')} ${record.name}?`,
                onOk: () => {
                    message.success(t('common.success'));
                }
            });
        }
    };

    const getActionMenu = (record: RecruitmentPlan): MenuProps => ({
        items: [
            { key: 'view', label: t('common.view') },
            { key: 'edit', label: t('common.edit') },
            { type: 'divider' },
            { key: 'delete', label: t('common.delete'), danger: true }
        ],
        onClick: (e) => handleMenuClick(e, record)
    });

    const columns: ColumnsType<RecruitmentPlan> = [
        {
            title: t('recruitment.campaign_name'),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ cursor: 'pointer' }} onClick={() => handleView(record)}>
                    <Text strong style={{ display: 'block', color: '#136dec' }}>
                        {text}
                    </Text>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                        {record.batch}
                    </Text>
                </div>
            )
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
                if (status === 'Active') color = 'success';
                if (status === 'Pending') color = 'warning';

                return (
                    <Tag color={color} style={{ borderRadius: '10px' }}>
                        {status === 'Active'
                            ? t('internship.active')
                            : status === 'Pending'
                              ? t('recruitment.pending_approval')
                              : t('recruitment.closed')}
                    </Tag>
                );
            }
        },
        {
            title: t('common.actions'),
            key: 'action',
            render: (_, record) => (
                <Dropdown menu={getActionMenu(record)} trigger={['click']}>
                    <Button type='text' icon={<EllipsisOutlined />} />
                </Dropdown>
            )
        }
    ];

    const stats = statsData?.data;
    const schedule = interviewsData?.data?.hits || [];

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
                            />
                            <Select
                                defaultValue={t('recruitment.all_depts')}
                                style={{ width: 160 }}
                                options={[
                                    { value: 'All Departments', label: t('recruitment.all_depts') },
                                    { value: 'Engineering', label: 'Engineering' },
                                    { value: 'Marketing', label: 'Marketing' }
                                ]}
                            />
                            <Select
                                defaultValue={t('recruitment.status_all')}
                                style={{ width: 140 }}
                                options={[
                                    { value: 'Status: All', label: t('recruitment.status_all') },
                                    { value: 'Active', label: t('internship.active') },
                                    { value: 'Closed', label: t('recruitment.closed') }
                                ]}
                            />
                            <Button icon={<FilterOutlined />}>{t('common.more_filters')}</Button>
                        </div>

                        <Table
                            columns={columns as any}
                            dataSource={plansData?.data?.hits || []}
                            pagination={{
                                current: plansData?.data?.pagination ? 1 : 1,
                                total: plansData?.data?.pagination?.totalRows || 0,
                                pageSize: 5
                            }}
                            loading={plansLoading}
                            rowKey='id'
                        />
                    </Card>
                </Col>

                <RecruitmentPlanModal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        refetch();
                    }}
                    initialValues={editingPlan as any}
                    viewOnly={isViewOnly}
                />
            </Row>
        </div>
    );
};
