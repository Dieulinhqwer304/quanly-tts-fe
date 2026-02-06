import {
    CalendarOutlined,
    CheckSquareOutlined,
    CloseOutlined,
    CloudUploadOutlined,
    EditOutlined,
    FilterOutlined,
    FlagOutlined,
    LinkOutlined,
    MessageOutlined,
    MoreOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Input,
    Layout,
    List,
    Row,
    Select,
    Space,
    Tag,
    Typography,
    Upload
} from 'antd';
import { useState } from 'react';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    progress?: number;
    assigneeAvatar?: string;
    tags?: string[];
}

const tasksData: Task[] = [
    {
        id: 1,
        title: 'Competitor Analysis Report',
        description: 'Analyze top 3 competitors and their feature sets.',
        status: 'To Do',
        priority: 'High',
        dueDate: 'Oct 24',
        assigneeAvatar: 'https://i.pravatar.cc/150?u=8'
    },
    {
        id: 2,
        title: 'Draft UI Mockups for Dashboard',
        description: 'Create initial wireframes for the new intern dashboard.',
        status: 'To Do',
        priority: 'Medium',
        dueDate: 'Oct 26',
        assigneeAvatar: 'https://i.pravatar.cc/150?u=5'
    },
    {
        id: 3,
        title: 'API Integration Testing',
        description: 'Connect frontend to user endpoints and verify response schemas.',
        status: 'In Progress',
        priority: 'High',
        dueDate: 'Oct 25',
        progress: 60,
        assigneeAvatar: 'https://i.pravatar.cc/150?u=1'
    },
    {
        id: 4,
        title: 'Setup Dev Environment',
        description: 'Install Node.js, Docker, and project dependencies.',
        status: 'Done',
        priority: 'Low',
        dueDate: 'Oct 20',
        assigneeAvatar: 'https://i.pravatar.cc/150?u=3'
    }
];

export const InternTaskBoard = () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(tasksData[2]);

    const renderTaskCard = (task: Task) => (
        <Card
            key={task.id}
            hoverable
            style={{
                marginBottom: '12px',
                borderRadius: '12px',
                border: selectedTask?.id === task.id ? '2px solid #136dec' : '1px solid #f0f0f0',
                cursor: 'pointer'
            }}
            bodyStyle={{ padding: '16px' }}
            onClick={() => setSelectedTask(task)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Tag color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'}>
                    {task.priority}
                </Tag>
                <MoreOutlined style={{ color: '#8c8c8c' }} />
            </div>
            <div style={{ fontWeight: 600, marginBottom: '8px', color: '#1f2937' }}>{task.title}</div>

            {task.progress !== undefined && (
                <div style={{ marginBottom: '12px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '10px',
                            color: '#8c8c8c',
                            marginBottom: '4px'
                        }}
                    >
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#f5f5f5', borderRadius: '3px' }}>
                        <div
                            style={{
                                width: `${task.progress}%`,
                                height: '100%',
                                background: '#136dec',
                                borderRadius: '3px'
                            }}
                        ></div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                    <CalendarOutlined /> {task.dueDate}
                </div>
                <Avatar size='small' src={task.assigneeAvatar} />
            </div>
        </Card>
    );

    return (
        <Layout style={{ height: 'calc(100vh - 64px)', background: '#f6f7f8' }}>
            <Content style={{ padding: '24px', overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '8px'
                        }}
                    >
                        <span>Phase 2</span> <span style={{ fontSize: '10px' }}>▶</span> <span>Project Alpha</span>{' '}
                        <span style={{ fontSize: '10px' }}>▶</span>{' '}
                        <span style={{ color: '#111827', fontWeight: 500 }}>Task Board</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Title level={2} style={{ margin: 0 }}>
                                Phase 2: Project Deliverables
                            </Title>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#6b7280',
                                    marginTop: '4px'
                                }}
                            >
                                <UserOutlined /> Mentor: Sarah Jenkins
                            </div>
                        </div>
                        <Button type='primary' icon={<PlusOutlined />} size='large'>
                            New Task
                        </Button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                        <Space>
                            <Button
                                type='text'
                                style={{ background: '#fff', fontWeight: 500 }}
                                icon={<CheckSquareOutlined />}
                            >
                                Kanban Board
                            </Button>
                            <Button
                                type='text'
                                icon={
                                    <div style={{ transform: 'rotate(90deg)' }}>
                                        <MoreOutlined />
                                    </div>
                                }
                            >
                                List View
                            </Button>
                        </Space>
                        <Space>
                            <Select
                                defaultValue='Priority: High'
                                style={{ width: 140 }}
                                bordered={false}
                                className='bg-white rounded-lg border border-gray-200'
                            />
                            <Select
                                defaultValue='Due Date: Any'
                                style={{ width: 140 }}
                                bordered={false}
                                className='bg-white rounded-lg border border-gray-200'
                            />
                            <Button icon={<FilterOutlined />}>More Filters</Button>
                        </Space>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', height: '100%', paddingBottom: '12px' }}>
                    <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                padding: '0 4px'
                            }}
                        >
                            <div style={{ fontWeight: 600, color: '#374151' }}>
                                To Do <Tag style={{ marginLeft: '8px', borderRadius: '12px' }}>2</Tag>
                            </div>
                            <Button type='text' icon={<PlusOutlined />} size='small' />
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                            {tasksData.filter((t) => t.status === 'To Do').map(renderTaskCard)}
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                padding: '0 4px'
                            }}
                        >
                            <div style={{ fontWeight: 600, color: '#374151' }}>
                                In Progress{' '}
                                <Tag color='blue' style={{ marginLeft: '8px', borderRadius: '12px' }}>
                                    1
                                </Tag>
                            </div>
                            <Button type='text' icon={<PlusOutlined />} size='small' />
                        </div>
                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                paddingRight: '8px',
                                background: 'rgba(243, 244, 246, 0.5)',
                                borderRadius: '12px',
                                padding: '12px',
                                border: '2px dashed #e5e7eb'
                            }}
                        >
                            {tasksData.filter((t) => t.status === 'In Progress').map(renderTaskCard)}
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                padding: '0 4px'
                            }}
                        >
                            <div style={{ fontWeight: 600, color: '#374151' }}>
                                Done{' '}
                                <Tag color='green' style={{ marginLeft: '8px', borderRadius: '12px' }}>
                                    1
                                </Tag>
                            </div>
                            <Button type='text' icon={<PlusOutlined />} size='small' />
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', opacity: 0.7 }}>
                            {tasksData.filter((t) => t.status === 'Done').map(renderTaskCard)}
                        </div>
                    </div>
                </div>
            </Content>

            {selectedTask && (
                <Sider width={400} theme='light' style={{ borderLeft: '1px solid #e5e7eb', overflowY: 'auto' }}>
                    <div
                        style={{
                            padding: '24px',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start'
                        }}
                    >
                        <div>
                            <Text
                                type='secondary'
                                style={{
                                    fontSize: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 700,
                                    display: 'block',
                                    marginBottom: '4px'
                                }}
                            >
                                Selected Task
                            </Text>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div
                                    style={{ width: '8px', height: '8px', background: '#136dec', borderRadius: '50%' }}
                                ></div>
                                <span style={{ fontWeight: 500 }}>In Progress</span>
                            </div>
                        </div>
                        <Button type='text' icon={<CloseOutlined />} onClick={() => setSelectedTask(null)} />
                    </div>

                    <div style={{ padding: '24px' }}>
                        <Title level={3} style={{ marginTop: 0, marginBottom: '16px' }}>
                            {selectedTask.title}
                        </Title>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <Tag color='orange' icon={<FlagOutlined />}>
                                Priority: {selectedTask.priority}
                            </Tag>
                            <Tag icon={<CalendarOutlined />}>Due: {selectedTask.dueDate}</Tag>
                        </div>

                        <Paragraph type='secondary' style={{ marginBottom: '24px' }}>
                            {selectedTask.description}
                        </Paragraph>

                        <Divider />

                        <div style={{ marginBottom: '24px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 700,
                                    marginBottom: '12px'
                                }}
                            >
                                <UploadOutlined style={{ color: '#136dec' }} /> Submit Deliverable
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <Text
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: '#6b7280',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}
                                >
                                    Repository / PR Link
                                </Text>
                                <Input
                                    prefix={<LinkOutlined style={{ color: '#9ca3af' }} />}
                                    placeholder='https://github.com/company/repo/pull/123'
                                />
                            </div>

                            <Upload.Dragger
                                style={{
                                    padding: '16px',
                                    background: '#f9fafb',
                                    border: '2px dashed #e5e7eb',
                                    marginBottom: '12px'
                                }}
                            >
                                <p className='ant-upload-drag-icon' style={{ marginBottom: '8px' }}>
                                    <CloudUploadOutlined style={{ fontSize: '24px', color: '#9ca3af' }} />
                                </p>
                                <p className='ant-upload-text' style={{ fontSize: '12px' }}>
                                    Click to upload report
                                </p>
                            </Upload.Dragger>

                            <Button type='primary' block>
                                Submit for Review
                            </Button>
                        </div>

                        <Divider />

                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 700,
                                    marginBottom: '16px'
                                }}
                            >
                                <MessageOutlined style={{ color: '#722ed1' }} /> Mentor Feedback
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <Avatar src='https://i.pravatar.cc/150?u=10' />
                                <div>
                                    <div
                                        style={{
                                            background: '#f3f4f6',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            borderTopLeftRadius: '0'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '4px'
                                            }}
                                        >
                                            <Text strong style={{ fontSize: '12px' }}>
                                                Sarah Jenkins
                                            </Text>
                                            <Text type='secondary' style={{ fontSize: '10px' }}>
                                                2h ago
                                            </Text>
                                        </div>
                                        <Text style={{ fontSize: '13px', color: '#4b5563' }}>
                                            Please verify the edge cases for empty lists. The last build failed when the
                                            user had no previous history.
                                        </Text>
                                    </div>
                                    <Button
                                        type='link'
                                        size='small'
                                        style={{ padding: 0, marginTop: '4px', fontSize: '12px' }}
                                    >
                                        Reply
                                    </Button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Avatar src='https://i.pravatar.cc/150?u=1' />
                                <Input
                                    suffix={
                                        <Button
                                            type='primary'
                                            size='small'
                                            icon={<CheckSquareOutlined />}
                                            style={{
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                minWidth: 'auto',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        />
                                    }
                                    placeholder='Write a reply...'
                                    style={{ borderRadius: '24px' }}
                                />
                            </div>
                        </div>
                    </div>
                </Sider>
            )}
        </Layout>
    );
};
