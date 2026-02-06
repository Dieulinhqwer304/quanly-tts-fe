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
    message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface Campaign {
    key: string;
    id: string;
    name: string;
    batch: string;
    department: string;
    startDate: string;
    candidates: number;
    avatars: string[];
    status: 'Active' | 'Pending' | 'Closed';
}

const data: Campaign[] = [
    {
        key: '1',
        id: '1',
        name: 'Summer 2024 Engineering',
        batch: 'Internship Batch A',
        department: 'Engineering',
        startDate: 'Mar 15, 2024',
        candidates: 24,
        avatars: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3'],
        status: 'Active'
    },
    {
        key: '2',
        id: '2',
        name: 'Q3 Marketing Trainees',
        batch: 'Social Media Focus',
        department: 'Marketing',
        startDate: 'Apr 01, 2024',
        candidates: 8,
        avatars: ['https://i.pravatar.cc/150?u=4', 'https://i.pravatar.cc/150?u=5'],
        status: 'Pending'
    },
    {
        key: '3',
        id: '3',
        name: 'Product Design Fellows',
        batch: 'UX/UI Research',
        department: 'Design',
        startDate: 'Feb 20, 2024',
        candidates: 12,
        avatars: ['https://i.pravatar.cc/150?u=6', 'https://i.pravatar.cc/150?u=7'],
        status: 'Closed'
    },
    {
        key: '4',
        id: '4',
        name: 'Data Science Cohort',
        batch: 'Analytics Team',
        department: 'Data',
        startDate: 'Mar 22, 2024',
        candidates: 5,
        avatars: ['https://i.pravatar.cc/150?u=8'],
        status: 'Active'
    }
];

const schedule = [
    {
        time: '10:00 AM',
        title: 'Frontend Dev Interview',
        with: 'Michael Chen',
        platform: 'Zoom',
        avatar: 'https://i.pravatar.cc/150?u=9'
    },
    {
        time: '11:30 AM',
        title: 'Design Portfolio Review',
        with: 'Sarah Miller',
        platform: 'Room 302',
        avatar: 'https://i.pravatar.cc/150?u=10'
    },
    {
        time: '02:00 PM',
        title: 'System Arch Discussion',
        with: 'David Kim',
        platform: 'Google Meet',
        avatar: 'https://i.pravatar.cc/150?u=11'
    }
];

export const RecruitmentPlanList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleMenuClick = (e: any, campaignName: string) => {
        if (e.key === 'edit') {
            message.info(`Edit campaign: ${campaignName}`);
        } else if (e.key === 'delete') {
            message.warning(`Delete campaign: ${campaignName}`);
        } else {
            message.info(`View details for: ${campaignName}`);
        }
    };

    const getActionMenu = (record: Campaign): MenuProps => ({
        items: [
            { key: 'view', label: t('common.view') },
            { key: 'edit', label: t('common.edit') },
            { type: 'divider' },
            { key: 'delete', label: t('common.delete'), danger: true }
        ],
        onClick: (e) => handleMenuClick(e, record.name)
    });

    const columns: ColumnsType<Campaign> = [
        {
            title: t('recruitment.campaign_name'),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ cursor: 'pointer' }} onClick={() => message.info(`View campaign: ${text}`)}>
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
            render: (count, record) => (
                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => navigate(RouteConfig.CVList.path)}
                >
                    <Avatar.Group maxCount={3} size='small'>
                        {record.avatars.map((url, index) => (
                            <Avatar key={index} src={url} />
                        ))}
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
                        {status === 'Active' ? t('internship.active') : status === 'Pending' ? t('recruitment.pending_approval') : t('recruitment.closed')}
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
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>{t('recruitment.open_positions')}</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    12
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
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>{t('recruitment.pending_applications')}</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    45
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
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>{t('recruitment.upcoming_interviews')}</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    8
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
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>{t('recruitment.conversion_rate')}</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    18%
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
                                onClick={() => navigate(RouteConfig.RecruitmentPlanCreate.path)}
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

                        <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Space direction='vertical' size='large' style={{ width: '100%' }}>
                        <Card title={t('recruitment.today_schedule')} bordered={false} style={{ borderRadius: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {schedule.map((item, index) => (
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
                                        onClick={() => message.info(`View details for: ${item.title}`)}
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
                                                {item.title}
                                            </Text>
                                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                                {t('interview.online')} {item.with}
                                            </Text>
                                            <div
                                                style={{
                                                    marginTop: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                <Avatar size={20} src={item.avatar} />
                                                <Tag style={{ margin: 0, fontSize: '10px' }}>{item.platform}</Tag>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
