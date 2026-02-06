import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    RocketOutlined,
    SearchOutlined,
    MoreOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Input,
    List,
    Row,
    Space,
    Steps,
    Tag,
    Typography,
    message,
    Dropdown,
    MenuProps,
    Breadcrumb
} from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;

interface OnboardingIntern {
    id: string;
    name: string;
    avatar: string;
    track: string;
    currentStep: number;
    steps: { title: string; status: 'finish' | 'process' | 'wait' | 'error' }[];
    startDate: string;
    status: 'In Progress' | 'Delayed' | 'Completed';
}

const initialData: OnboardingIntern[] = [
    {
        id: 'ONB-001',
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?u=11',
        track: 'Frontend Development',
        currentStep: 2,
        startDate: '2024-03-10',
        status: 'In Progress',
        steps: [
            { title: 'Document Submission', status: 'finish' },
            { title: 'Account Setup', status: 'finish' },
            { title: 'Initial Training', status: 'process' },
            { title: 'Task Assignment', status: 'wait' }
        ]
    },
    {
        id: 'ONB-002',
        name: 'Maria Garcia',
        avatar: 'https://i.pravatar.cc/150?u=12',
        track: 'Backend Development',
        currentStep: 1,
        startDate: '2024-03-12',
        status: 'In Progress',
        steps: [
            { title: 'Document Submission', status: 'finish' },
            { title: 'Account Setup', status: 'process' },
            { title: 'Initial Training', status: 'wait' },
            { title: 'Task Assignment', status: 'wait' }
        ]
    },
    {
        id: 'ONB-003',
        name: 'Kevin Smith',
        avatar: 'https://i.pravatar.cc/150?u=13',
        track: 'UI/UX Design',
        currentStep: 3,
        startDate: '2024-03-05',
        status: 'Delayed',
        steps: [
            { title: 'Document Submission', status: 'finish' },
            { title: 'Account Setup', status: 'finish' },
            { title: 'Initial Training', status: 'finish' },
            { title: 'Task Assignment', status: 'error' }
        ]
    }
];

export const OnboardingList = () => {
    const [searchText, setSearchText] = useState('');

    const handleAction = (key: string, name: string) => {
        message.info(`${key} for ${name}`);
    };

    const getActionMenu = (item: OnboardingIntern): MenuProps => ({
        items: [
            { key: 'reminder', label: 'Send Reminder' },
            { key: 'approve', label: 'Approve Next Step' },
            { type: 'divider' },
            { key: 'cancel', label: 'Cancel Onboarding', danger: true }
        ],
        onClick: ({ key }) => handleAction(key, item.name)
    });

    const filteredData = initialData.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.track.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[
                        { title: 'Recruitment' },
                        { title: 'Onboarding' },
                    ]}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <Title level={3} style={{ margin: 0 }}>Onboarding Status</Title>
                    <Text type="secondary">Track the progress of newly hired interns as they join the company.</Text>
                </div>
                <Space>
                    <Input
                        placeholder="Search interns..."
                        prefix={<SearchOutlined />}
                        style={{ width: 250 }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button type="primary" icon={<RocketOutlined />}>Bulk Actions</Button>
                </Space>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={18}>
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={filteredData}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    bordered={false}
                                    style={{ borderRadius: '12px' }}
                                    bodyStyle={{ padding: '20px' }}
                                >
                                    <Row gutter={24} align="middle">
                                        <Col xs={24} md={6}>
                                            <Space size="middle">
                                                <Avatar size={54} src={item.avatar} icon={<UserOutlined />} />
                                                <div>
                                                    <Text strong style={{ display: 'block', fontSize: '16px' }}>{item.name}</Text>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>{item.track}</Text>
                                                    <Tag color={item.status === 'Delayed' ? 'red' : 'processing'} style={{ marginTop: '4px' }}>
                                                        {item.status}
                                                    </Tag>
                                                </div>
                                            </Space>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <div style={{ padding: '0 20px' }}>
                                                <Steps
                                                    size="small"
                                                    current={item.currentStep}
                                                    items={item.steps.map(s => ({ title: s.title, status: s.status }))}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={24} md={4} style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <Button type="primary" size="small" onClick={() => handleAction('next', item.name)}>
                                                    Advance
                                                </Button>
                                                <Dropdown menu={getActionMenu(item)} trigger={['click']}>
                                                    <Button size="small" icon={<MoreOutlined />}>More</Button>
                                                </Dropdown>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />
                </Col>

                <Col xs={24} lg={6}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card title="Quick Stats" bordered={false} style={{ borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Text type="secondary">In Onboarding</Text>
                                <Text strong>12</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Text type="secondary">Delayed</Text>
                                <Text strong style={{ color: '#ff4d4f' }}>2</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text type="secondary">Ready for Work</Text>
                                <Text strong style={{ color: '#52c41a' }}>5</Text>
                            </div>
                        </Card>

                        <Card title="Next Steps" bordered={false} style={{ borderRadius: '12px' }}>
                            <List
                                size="small"
                                dataSource={[
                                    { icon: <ClockCircleOutlined />, text: 'Review 3 ID docs' },
                                    { icon: <CheckCircleOutlined />, text: 'Setup 2 GitLab accounts' },
                                    { icon: <UserOutlined />, text: 'Assign 1 mentor' }
                                ]}
                                renderItem={item => (
                                    <List.Item style={{ padding: '12px 0' }}>
                                        <Space>
                                            <span style={{ color: '#136dec' }}>{item.icon}</span>
                                            <Text style={{ fontSize: '13px' }}>{item.text}</Text>
                                        </Space>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};
