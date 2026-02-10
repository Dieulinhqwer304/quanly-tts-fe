import {
    CalendarOutlined,
    CheckSquareOutlined,
    CloseOutlined,
    CloudUploadOutlined,
    FilterOutlined,
    FlagOutlined,
    LinkOutlined,
    MessageOutlined,
    MoreOutlined,
    PlusOutlined,
    UploadOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Divider,
    Input,
    Layout,
    Select,
    Space,
    Tag,
    Typography,
    Upload,
    message,
    Modal,
    Spin,
    Empty,
    Form
} from 'antd';
import { useState } from 'react';
import { useTasks, useUpdateTask, useCreateTask } from '../../../hooks/Internship/useTasks';
import { CreateTaskParams, Task } from '../../../services/Internship/tasks';
import { useResponsive } from '../../../hooks/useResponsive';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

export const InternTaskBoard = () => {
    const { isMobile, isLaptop } = useResponsive();
    const internId = 'intern-1'; // Mock for now, should come from auth
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [form] = Form.useForm();

    const { data: tasksData, isLoading: isTasksLoading } = useTasks({ internId });
    const updateTaskMutation = useUpdateTask();
    const createTaskMutation = useCreateTask();

    const tasks = tasksData?.data?.hits || [];

    const moveTask = async (task: Task, newStatus: Task['status']) => {
        try {
            await updateTaskMutation.mutateAsync({
                id: task.id,
                status: newStatus
            });
            message.success(`Task moved to ${newStatus}`);
            if (selectedTask?.id === task.id) {
                setSelectedTask({ ...selectedTask, status: newStatus });
            }
        } catch {
            message.error('Failed to move task');
        }
    };

    const handleCreateTask = async (
        values: Pick<CreateTaskParams, 'title' | 'description' | 'priority' | 'dueDate'>
    ) => {
        try {
            await createTaskMutation.mutateAsync({
                ...values,
                internId,
                intern: 'Alex Johnson', // Mock
                internAvatar: 'https://i.pravatar.cc/150?u=1' // Mock
            });
            setIsCreateModalOpen(false);
            form.resetFields();
            message.success('New task created!');
        } catch {
            message.error('Failed to create task');
        }
    };

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
            actions={[
                <Button
                    type='text'
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task, 'To Do');
                    }}
                    disabled={task.status === 'To Do'}
                >
                    To Do
                </Button>,
                <Button
                    type='text'
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task, 'In Progress');
                    }}
                    disabled={task.status === 'In Progress'}
                >
                    Progress
                </Button>,
                <Button
                    type='text'
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task, 'Completed');
                    }}
                    disabled={task.status === 'Completed'}
                >
                    Done
                </Button>
            ]}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Tag color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'}>
                    {task.priority}
                </Tag>
                <MoreOutlined style={{ color: '#8c8c8c' }} />
            </div>
            <div style={{ fontWeight: 600, marginBottom: '8px', color: '#1f2937' }}>{task.title}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                    <CalendarOutlined /> {task.dueDate}
                </div>
                <Avatar size='small' src={task.internAvatar} />
            </div>
        </Card>
    );

    if (isTasksLoading) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <Spin size='large' />
            </div>
        );
    }

    return (
        <Layout style={{ height: 'calc(100vh - 64px)', background: '#f6f7f8' }}>
            <Content
                style={{
                    padding: isMobile ? '12px' : isLaptop ? '18px' : '24px',
                    overflowY: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
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
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? '10px' : 0
                        }}
                    >
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
                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            size='large'
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            New Task
                        </Button>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '24px',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? '10px' : 0
                        }}
                    >
                        <Space wrap>
                            <Button
                                type='text'
                                style={{ background: '#fff', fontWeight: 500 }}
                                icon={<CheckSquareOutlined />}
                            >
                                Kanban Board
                            </Button>
                        </Space>
                        <Space wrap>
                            <Select
                                defaultValue='All Priorities'
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
                                To Do{' '}
                                <Tag style={{ marginLeft: '8px', borderRadius: '12px' }}>
                                    {tasks.filter((t) => t.status === 'To Do').length}
                                </Tag>
                            </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                            {tasks.filter((t) => t.status === 'To Do').map(renderTaskCard)}
                            {tasks.filter((t) => t.status === 'To Do').length === 0 && (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No tasks' />
                            )}
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
                                    {tasks.filter((t) => t.status === 'In Progress').length}
                                </Tag>
                            </div>
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
                            {tasks.filter((t) => t.status === 'In Progress').map(renderTaskCard)}
                            {tasks.filter((t) => t.status === 'In Progress').length === 0 && (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No tasks in progress' />
                            )}
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
                                    {tasks.filter((t) => t.status === 'Completed').length}
                                </Tag>
                            </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', opacity: 0.7 }}>
                            {tasks.filter((t) => t.status === 'Completed').map(renderTaskCard)}
                            {tasks.filter((t) => t.status === 'Completed').length === 0 && (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No completed tasks' />
                            )}
                        </div>
                    </div>
                </div>
            </Content>

            {selectedTask && (
                <Sider
                    width={isMobile ? '100%' : 400}
                    theme='light'
                    style={{
                        borderLeft: isMobile ? 'none' : '1px solid #e5e7eb',
                        borderTop: isMobile ? '1px solid #e5e7eb' : 'none',
                        overflowY: 'auto'
                    }}
                >
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
                                <span style={{ fontWeight: 500 }}>{selectedTask.status}</span>
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

                            <Button
                                type='primary'
                                block
                                onClick={() => moveTask(selectedTask, 'Under Review')}
                                loading={updateTaskMutation.isPending}
                            >
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
                        </div>
                    </div>
                </Sider>
            )}

            <Modal
                title='Create New Task'
                open={isCreateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsCreateModalOpen(false)}
                confirmLoading={createTaskMutation.isPending}
                width={isMobile ? 'calc(100vw - 24px)' : 520}
            >
                <Form form={form} layout='vertical' onFinish={handleCreateTask}>
                    <Form.Item name='title' label='Task Title' rules={[{ required: true }]}>
                        <Input placeholder='Task Title' />
                    </Form.Item>
                    <Form.Item name='description' label='Description' rules={[{ required: true }]}>
                        <Input.TextArea placeholder='Description' rows={3} />
                    </Form.Item>
                    <Form.Item name='priority' label='Priority' rules={[{ required: true }]}>
                        <Select
                            placeholder='Priority'
                            options={[
                                { value: 'High', label: 'High' },
                                { value: 'Medium', label: 'Medium' },
                                { value: 'Low', label: 'Low' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name='dueDate' label='Due Date' rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};
