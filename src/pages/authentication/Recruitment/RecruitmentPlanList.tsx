import {
    CalendarOutlined,
    CheckCircleOutlined,
    EllipsisOutlined,
    FilterOutlined,
    PlusOutlined,
    SearchOutlined,
    TeamOutlined,
    RiseOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Input,
    MenuProps,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
    Skeleton,
    Modal
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useTranslation } from 'react-i18next';
import { useRecruitmentPlans } from '../../../hooks/Recruitment/useRecruitmentPlans';
import { useDashboardStats } from '../../../hooks/useDashboardStats';
import { useInterviews } from '../../../hooks/Recruitment/useInterviews';
import { RecruitmentPlan } from '../../../services/Recruitment/recruitmentPlans';
import { RecruitmentPlanModal } from './components/RecruitmentPlanModal';
import { useState } from 'react';

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
                <Title level={3}>{t('recruitment.overview')}</Title>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: '12px', cursor: 'pointer' }}
                        hoverable
                        onClick={() => navigate(RouteConfig.RecruitmentJobList.path)}
                        loading={statsLoading}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>{t('recruitment.open_positions')}</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    {stats?.openPositions || 0}
                                </Title>
                                <Text type='success' style={{ fontSize: '12px' }}>
                                    <RiseOutlined /> +2 {t('common.last_month')}
                                </Text>
                            </div>
                            <div style={{ background: '#e6f7ff', padding: '8px', borderRadius: '8px' }}>
                                <TeamOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: '12px', cursor: 'pointer' }}
                        hoverable
                        onClick={() => navigate(RouteConfig.CVList.path)}
                        loading={statsLoading}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>{t('recruitment.pending_applications')}</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    {stats?.pendingApplications || 0}
                                </Title>
                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                    {t('recruitment.require_review')}
                                </Text>
                            </div>
                            <div style={{ background: '#fff7e6', padding: '8px', borderRadius: '8px' }}>
                                <UserOutlined style={{ fontSize: '20px', color: '#fa8c16' }} />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: '12px', cursor: 'pointer' }}
                        hoverable
                        onClick={() => navigate(RouteConfig.InterviewSchedule.path)}
                        loading={statsLoading}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>{t('recruitment.upcoming_interviews')}</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    {stats?.upcomingInterviews || 0}
                                </Title>
                                <Tag color='purple'>{t('onboarding.today')}</Tag>
                            </div>
                            <div style={{ background: '#f9f0ff', padding: '8px', borderRadius: '8px' }}>
                                <CalendarOutlined style={{ fontSize: '20px', color: '#722ed1' }} />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }} loading={statsLoading}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>{t('recruitment.conversion_rate')}</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    {stats?.conversionRate || 0}%
                                </Title>
                                <Text type='success' style={{ fontSize: '12px' }}>
                                    <RiseOutlined /> 1.5% {t('common.last_week')}
                                </Text>
                            </div>
                            <div style={{ background: '#f6ffed', padding: '8px', borderRadius: '8px' }}>
                                <CheckCircleOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Pending Mentor Requests Section */}
            <Card
                title={
                    <Space>
                        <TeamOutlined />
                        <span>Đề xuất từ Mentor/Trưởng nhóm</span>
                        <Tag color="warning">3 đề xuất mới</Tag>
                    </Space>
                }
                bordered={false}
                style={{ borderRadius: '12px', marginBottom: '24px' }}
                extra={
                    <Button
                        type="link"
                        onClick={() => navigate(RouteConfig.MentorRequestList.path)}
                    >
                        Xem tất cả đề xuất →
                    </Button>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card
                            size="small"
                            style={{ borderLeft: '3px solid #ff4d4f', cursor: 'pointer' }}
                            hoverable
                            onClick={() => message.info('Tạo kế hoạch từ đề xuất này')}
                        >
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Tag color="red">High Priority</Tag>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>2h ago</Text>
                                </div>
                                <Text strong>Đề xuất mở rộng slot thực tập sinh cho team AI</Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Engineering • 5 vị trí • AI/ML Intern
                                </Text>
                                <div style={{ marginTop: '8px' }}>
                                    <Button type="primary" size="small" block>
                                        Tạo kế hoạch từ đề xuất này
                                    </Button>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card
                            size="small"
                            style={{ borderLeft: '3px solid #faad14', cursor: 'pointer' }}
                            hoverable
                        >
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Tag color="orange">Medium Priority</Tag>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>1d ago</Text>
                                </div>
                                <Text strong>Cần thực tập sinh Frontend cho dự án mới</Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Product • 3 vị trí • Frontend Intern
                                </Text>
                                <div style={{ marginTop: '8px' }}>
                                    <Button type="primary" size="small" block>
                                        Tạo kế hoạch từ đề xuất này
                                    </Button>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card
                            size="small"
                            style={{ borderLeft: '3px solid #1890ff', cursor: 'pointer' }}
                            hoverable
                        >
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Tag color="blue">Low Priority</Tag>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>3d ago</Text>
                                </div>
                                <Text strong>Mở rộng đội Backend cho microservices</Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Engineering • 4 vị trí • Backend Intern
                                </Text>
                                <div style={{ marginTop: '8px' }}>
                                    <Button type="primary" size="small" block>
                                        Tạo kế hoạch từ đề xuất này
                                    </Button>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Row gutter={24}>
                <Col xs={24} lg={16}>
                    <Card
                        title={t('recruitment.campaigns')}
                        bordered={false}
                        style={{ borderRadius: '12px' }}
                        extra={
                            <Button
                                type='primary'
                                icon={<PlusOutlined />}
                                onClick={handleCreate}
                            >
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
                    initialValues={editingPlan}
                    viewOnly={isViewOnly}
                />

                <Col xs={24} lg={8}>
                    <Space direction='vertical' size='large' style={{ width: '100%' }}>
                        <Card title={t('recruitment.today_schedule')} bordered={false} style={{ borderRadius: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {interviewsLoading ? (
                                    <Skeleton active />
                                ) : (
                                    schedule.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                gap: '12px',
                                                padding: '8px',
                                                borderRadius: '8px',
                                                background: '#fafafa',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => message.info(`View details for: ${item.jobTitle}`)}
                                        >
                                            <div
                                                style={{
                                                    background: '#f0f0f0',
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minWidth: '60px'
                                                }}
                                            >
                                                <Text strong style={{ fontSize: '12px' }}>
                                                    {item.time.split(' ')[0]}
                                                </Text>
                                                <Text type='secondary' style={{ fontSize: '10px' }}>
                                                    {item.time.split(' ')[1]}
                                                </Text>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Text strong style={{ display: 'block' }}>
                                                    {item.jobTitle}
                                                </Text>
                                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                                    {item.format === 'Online'
                                                        ? t('interview.online')
                                                        : t('interview.offline')}{' '}
                                                    {item.candidateName}
                                                </Text>
                                                <div
                                                    style={{
                                                        marginTop: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <Avatar
                                                        size={20}
                                                        src={`https://i.pravatar.cc/150?u=${item.candidateId}`}
                                                    />
                                                    <Tag style={{ margin: 0, fontSize: '10px' }}>{item.format}</Tag>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <Button
                                    type='default'
                                    block
                                    onClick={() => navigate(RouteConfig.InterviewSchedule.path)}
                                >
                                    {t('recruitment.view_full_calendar')}
                                </Button>
                            </div>
                        </Card>

                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                                color: 'white'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <Title level={4} style={{ color: 'white', marginTop: 0 }}>
                                {t('recruitment.need_mentors')}
                            </Title>
                            <Text style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '16px' }}>
                                {t('recruitment.assign_mentors_desc')}
                            </Text>
                            <Button
                                style={{ color: '#1890ff', fontWeight: 'bold' }}
                                onClick={() => navigate(RouteConfig.MentorRequestList.path)}
                            >
                                {t('recruitment.assign_now')}
                            </Button>
                        </Card>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};
