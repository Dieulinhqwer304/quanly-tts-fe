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
import { Avatar, Button, Card, Col, Input, Row, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Campaign {
    key: string;
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
    const columns: ColumnsType<Campaign> = [
        {
            title: 'Campaign Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <Text strong style={{ display: 'block' }}>
                        {text}
                    </Text>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                        {record.batch}
                    </Text>
                </div>
            )
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (text) => <Text type='secondary'>{text}</Text>
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => <Text type='secondary'>{text}</Text>
        },
        {
            title: 'Candidates',
            dataIndex: 'candidates',
            key: 'candidates',
            render: (count, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'Active') color = 'success';
                if (status === 'Pending') color = 'warning';

                return (
                    <Tag color={color} style={{ borderRadius: '10px' }}>
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Actions',
            key: 'action',
            render: () => <Button type='text' icon={<EllipsisOutlined />} />
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3}>Recruitment Overview</Title>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>Open Positions</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    12
                                </Title>
                                <Text type='success' style={{ fontSize: '12px' }}>
                                    <RiseOutlined /> +2 vs last week
                                </Text>
                            </div>
                            <div style={{ background: '#e6f7ff', padding: '8px', borderRadius: '8px' }}>
                                <TeamOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>Pending Applications</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    45
                                </Title>
                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                    Require review
                                </Text>
                            </div>
                            <div style={{ background: '#fff7e6', padding: '8px', borderRadius: '8px' }}>
                                <UserOutlined style={{ fontSize: '20px', color: '#fa8c16' }} />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <Text type='secondary'>Upcoming Interviews</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    8
                                </Title>
                                <Tag color='purple'>Today</Tag>
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
                                <Text type='secondary'>Conversion Rate</Text>
                                <Title level={2} style={{ margin: '8px 0' }}>
                                    18%
                                </Title>
                                <Text type='success' style={{ fontSize: '12px' }}>
                                    <RiseOutlined /> 1.5% vs last month
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
                        title='Recruitment Campaigns'
                        bordered={false}
                        style={{ borderRadius: '12px' }}
                        extra={
                            <Button type='primary' icon={<PlusOutlined />}>
                                Create New Plan
                            </Button>
                        }
                    >
                        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder='Search campaigns...'
                                style={{ width: 200 }}
                            />
                            <Select
                                defaultValue='All Departments'
                                style={{ width: 160 }}
                                options={[
                                    { value: 'All Departments', label: 'All Departments' },
                                    { value: 'Engineering', label: 'Engineering' },
                                    { value: 'Marketing', label: 'Marketing' }
                                ]}
                            />
                            <Select
                                defaultValue='Status: All'
                                style={{ width: 140 }}
                                options={[
                                    { value: 'Status: All', label: 'Status: All' },
                                    { value: 'Active', label: 'Active' },
                                    { value: 'Closed', label: 'Closed' }
                                ]}
                            />
                            <Button icon={<FilterOutlined />}>More Filters</Button>
                        </div>

                        <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Space direction='vertical' size='large' style={{ width: '100%' }}>
                        <Card title="Today's Schedule" bordered={false} style={{ borderRadius: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {schedule.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            background: '#fafafa'
                                        }}
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
                                                with {item.with}
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
                                <Button type='default' block>
                                    View Full Calendar
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
                                Need Mentors?
                            </Title>
                            <Text style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '16px' }}>
                                Assign mentors to the new batch of engineering interns.
                            </Text>
                            <Button style={{ color: '#1890ff', fontWeight: 'bold' }}>Assign Now</Button>
                        </Card>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};
