import {
    FileAddOutlined,
    TrophyOutlined,
    FilterOutlined,
    GroupOutlined,
    MoreOutlined,
    ClockCircleOutlined,
    SearchOutlined,
    RiseOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Input, List, Progress, Row, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface PendingReview {
    id: number;
    phase: string;
    phaseColor: string;
    timeAgo: string;
    taskName: string;
    internName: string;
    avatar: string;
}

const pendingReviews: PendingReview[] = [
    {
        id: 1,
        phase: 'Phase 1: Training',
        phaseColor: 'purple',
        timeAgo: '2h ago',
        taskName: 'Module 3: Advanced React Patterns',
        internName: 'Sarah Jenkins',
        avatar: 'https://i.pravatar.cc/150?u=1'
    },
    {
        id: 2,
        phase: 'Phase 2: Project',
        phaseColor: 'green',
        timeAgo: '5h ago',
        taskName: 'API Integration Code Review',
        internName: 'David Chen',
        avatar: 'https://i.pravatar.cc/150?u=2'
    },
    {
        id: 3,
        phase: 'Phase 1: Training',
        phaseColor: 'purple',
        timeAgo: '1d ago',
        taskName: 'Weekly Reflection Log',
        internName: 'Emily Davis',
        avatar: 'https://i.pravatar.cc/150?u=3'
    }
];

interface InternProgress {
    key: string;
    name: string;
    track: string;
    avatar: string;
    currentPhase: string;
    phaseColor: string;
    moduleProgress: string;
    progressPercent: number;
    status: 'On Track' | 'Behind';
}

const internData: InternProgress[] = [
    {
        key: '1',
        name: 'Sarah Jenkins',
        track: 'Frontend Track',
        avatar: 'https://i.pravatar.cc/150?u=1',
        currentPhase: 'Training',
        phaseColor: 'purple',
        moduleProgress: 'Module 3/5',
        progressPercent: 60,
        status: 'On Track'
    },
    {
        key: '2',
        name: 'David Chen',
        track: 'Backend Track',
        avatar: 'https://i.pravatar.cc/150?u=2',
        currentPhase: 'Project',
        phaseColor: 'green',
        moduleProgress: 'Milestone 1',
        progressPercent: 25,
        status: 'Behind'
    },
    {
        key: '3',
        name: 'Emily Davis',
        track: 'UI/UX Track',
        avatar: 'https://i.pravatar.cc/150?u=3',
        currentPhase: 'Training',
        phaseColor: 'purple',
        moduleProgress: 'Module 4/5',
        progressPercent: 85,
        status: 'On Track'
    },
    {
        key: '4',
        name: 'Michael Ross',
        track: 'Fullstack Track',
        avatar: 'https://i.pravatar.cc/150?u=4',
        currentPhase: 'Project',
        phaseColor: 'green',
        moduleProgress: 'Final Submission',
        progressPercent: 95,
        status: 'On Track'
    }
];

export const MentorRequestList = () => {
    const columns: ColumnsType<InternProgress> = [
        {
            title: 'Intern',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar src={record.avatar} />
                    <div>
                        <div style={{ fontWeight: 600 }}>{text}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.track}</div>
                    </div>
                </div>
            )
        },
        {
            title: 'Current Phase',
            dataIndex: 'currentPhase',
            key: 'currentPhase',
            render: (text, record) => <Tag color={record.phaseColor}>{text}</Tag>
        },
        {
            title: 'Progress',
            dataIndex: 'progressPercent',
            key: 'progress',
            width: '25%',
            render: (percent, record) => (
                <div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            marginBottom: '4px'
                        }}
                    >
                        <span>{record.moduleProgress}</span>
                        <span>{percent}%</span>
                    </div>
                    <Progress percent={percent} showInfo={false} size='small' strokeColor='#136dec' />
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'right',
            render: (status) => (
                <Tag color={status === 'On Track' ? 'success' : 'warning'} style={{ borderRadius: '10px' }}>
                    {status === 'On Track' ? (
                        <span style={{ marginRight: '4px' }}>●</span>
                    ) : (
                        <span style={{ marginRight: '4px', color: '#faad14' }}>●</span>
                    )}
                    {status}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'right',
            render: () => <Button type='text' icon={<MoreOutlined />} />
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
            >
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        Dashboard Overview
                    </Title>
                    <Text type='secondary'>Manage your interns' training progress and review pending tasks.</Text>
                </div>
                <Button type='primary' icon={<FileAddOutlined />} size='large'>
                    Assign New Task
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px',
                                color: '#8c8c8c'
                            }}
                        >
                            <GroupOutlined /> Total Interns
                        </div>
                        <Title level={2} style={{ margin: 0 }}>
                            12
                        </Title>
                        <Tag color='success' style={{ marginTop: '8px' }}>
                            +2 this month
                        </Tag>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px',
                                color: '#8c8c8c'
                            }}
                        >
                            <ClockCircleOutlined /> Pending Reviews
                        </div>
                        <Title level={2} style={{ margin: 0 }}>
                            5
                        </Title>
                        <Tag color='warning' style={{ marginTop: '8px' }}>
                            Needs attention
                        </Tag>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px',
                                color: '#8c8c8c'
                            }}
                        >
                            <RiseOutlined /> Avg. Completion
                        </div>
                        <Title level={2} style={{ margin: 0 }}>
                            78%
                        </Title>
                        <Tag color='success' style={{ marginTop: '8px' }}>
                            +5% vs last week
                        </Tag>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px',
                                color: '#8c8c8c'
                            }}
                        >
                            <TrophyOutlined /> Project Phase
                        </div>
                        <Title level={2} style={{ margin: 0 }}>
                            4
                        </Title>
                        <Tag color='blue' style={{ marginTop: '8px' }}>
                            Interns promoted
                        </Tag>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <div
                        style={{
                            marginBottom: '16px',
                            fontWeight: 700,
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <WarningOutlined style={{ color: '#faad14' }} /> Pending Reviews
                    </div>
                    <Card bordered={false} style={{ borderRadius: '12px' }} bodyStyle={{ padding: 0 }}>
                        <List
                            dataSource={pendingReviews}
                            renderItem={(item) => (
                                <List.Item style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                                    <div style={{ width: '100%' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            <Tag color={item.phaseColor}>{item.phase}</Tag>
                                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                                {item.timeAgo}
                                            </Text>
                                        </div>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.taskName}</div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '12px'
                                            }}
                                        >
                                            <Avatar size='small' src={item.avatar} />
                                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                                {item.internName}
                                            </Text>
                                        </div>
                                        <Space>
                                            <Button type='primary' size='small'>
                                                Review
                                            </Button>
                                            <Button size='small'>Dismiss</Button>
                                        </Space>
                                    </div>
                                </List.Item>
                            )}
                        />
                        <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                            <Button type='link'>View All Pending Tasks</Button>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}
                    >
                        <div style={{ fontWeight: 700, fontSize: '16px' }}>Intern Progress Tracking</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Select
                                defaultValue='All Phases'
                                style={{ width: 140 }}
                                options={[
                                    { value: 'All Phases', label: 'All Phases' },
                                    { value: 'Phase 1', label: 'Phase 1: Training' },
                                    { value: 'Phase 2', label: 'Phase 2: Project' }
                                ]}
                            />
                            <Button icon={<FilterOutlined />} />
                        </div>
                    </div>
                    <Card bordered={false} style={{ borderRadius: '12px' }} bodyStyle={{ padding: 0 }}>
                        <div style={{ padding: '16px' }}>
                            <Input prefix={<SearchOutlined />} placeholder='Search interns, tasks...' />
                        </div>
                        <Table columns={columns} dataSource={internData} pagination={false} />
                        <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                            <Button type='link'>View All Interns</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
