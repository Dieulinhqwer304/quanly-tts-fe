import {
    PlusOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    ProjectOutlined,
    EllipsisOutlined,
    UserOutlined,
    HistoryOutlined
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
    Table,
    Tag,
    Typography,
    message,
    Modal,
    Form,
    Select,
    DatePicker
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title, Text } = Typography;

interface Task {
    key: string;
    id: string;
    title: string;
    intern: string;
    internAvatar: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    status: 'In Progress' | 'Under Review' | 'Completed' | 'To Do';
}

const initialTasks: Task[] = [
    {
        key: '1',
        id: 'TSK-101',
        title: 'Implement Authentication Flow',
        intern: 'Sarah Jenkins',
        internAvatar: 'https://i.pravatar.cc/150?u=1',
        priority: 'High',
        dueDate: '2024-03-20',
        status: 'In Progress'
    },
    {
        key: '2',
        id: 'TSK-102',
        title: 'Fix Sidebar Responsiveness',
        intern: 'David Chen',
        internAvatar: 'https://i.pravatar.cc/150?u=2',
        priority: 'Medium',
        dueDate: '2024-03-22',
        status: 'Under Review'
    },
    {
        key: '3',
        id: 'TSK-103',
        title: 'Write Unit Tests for API',
        intern: 'Sarah Jenkins',
        internAvatar: 'https://i.pravatar.cc/150?u=1',
        priority: 'Low',
        dueDate: '2024-03-25',
        status: 'To Do'
    }
];

export const MentorTaskManagement = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleAddTask = (values: any) => {
        const newTask: Task = {
            key: Date.now().toString(),
            id: `TSK-${Math.floor(Math.random() * 1000)}`,
            title: values.title,
            intern: values.intern,
            internAvatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
            priority: values.priority,
            dueDate: values.dueDate.format('YYYY-MM-DD'),
            status: 'To Do'
        };
        setTasks([newTask, ...tasks]);
        setIsModalOpen(false);
        form.resetFields();
        message.success('Task assigned successfully!');
    };

    const columns: ColumnsType<Task> = [
        {
            title: 'Task ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text type="secondary" style={{ fontSize: '12px' }}>{text}</Text>
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Intern',
            dataIndex: 'intern',
            key: 'intern',
            render: (text, record) => (
                <Space>
                    <Avatar size="small" src={record.internAvatar} />
                    <Text>{text}</Text>
                </Space>
            )
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => {
                let color = 'blue';
                if (priority === 'High') color = 'volcano';
                if (priority === 'Medium') color = 'gold';
                return <Tag color={color}>{priority}</Tag>;
            }
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => (
                <Space>
                    <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                    <Text style={{ fontSize: '13px' }}>{date}</Text>
                </Space>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'In Progress') color = 'blue';
                if (status === 'Under Review') color = 'purple';
                if (status === 'Completed') color = 'success';
                return <Tag color={color} style={{ borderRadius: '10px' }}>{status}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'action',
            render: () => (
                <Button type="text" icon={<EllipsisOutlined />} />
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>Task Management</Title>
                    <Text type="secondary">Assign tasks to interns and monitor their progress in real-time.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setIsModalOpen(true)}
                >
                    Assign New Task
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={6}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Card title="Mentor View Stats" bordered={false} style={{ borderRadius: '12px' }}>
                            <div style={{ padding: '10px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <Space><TeamOutlined style={{ color: '#136dec' }} /> <Text>Active Interns</Text></Space>
                                    <Text strong>4</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <Space><ProjectOutlined style={{ color: '#faad14' }} /> <Text>Open Tasks</Text></Space>
                                    <Text strong>15</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> <Text>Completed</Text></Space>
                                    <Text strong>42</Text>
                                </div>
                            </div>
                        </Card>

                        <Card title="Intern Activity" bordered={false} style={{ borderRadius: '12px' }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={[
                                    { name: 'Sarah J.', action: 'submitted task', time: '10m ago' },
                                    { name: 'David C.', action: 'started task', time: '1h ago' },
                                    { name: 'Sarah J.', action: 'requested review', time: '3h ago' }
                                ]}
                                renderItem={item => (
                                    <List.Item style={{ padding: '12px 0' }}>
                                        <List.Item.Meta
                                            avatar={<Avatar size="small" icon={<UserOutlined />} />}
                                            title={<Text style={{ fontSize: '13px' }}><Text strong>{item.name}</Text> {item.action}</Text>}
                                            description={<Space style={{ fontSize: '11px' }}><HistoryOutlined /> {item.time}</Space>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Space>
                </Col>

                <Col xs={24} lg={18}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                            <Space size="middle">
                                <Select defaultValue="All Interns" style={{ width: 150 }} options={[
                                    { value: 'All Interns', label: 'All Interns' },
                                    { value: 'Sarah Jenkins', label: 'Sarah Jenkins' },
                                    { value: 'David Chen', label: 'David Chen' }
                                ]} />
                                <Select defaultValue="All Statuses" style={{ width: 150 }} options={[
                                    { value: 'All Statuses', label: 'All Statuses' },
                                    { value: 'In Progress', label: 'In Progress' },
                                    { value: 'Completed', label: 'Completed' }
                                ]} />
                            </Space>
                            <Input prefix={<ProjectOutlined />} placeholder="Search tasks..." style={{ width: 250 }} />
                        </div>
                        <Table columns={columns} dataSource={tasks} pagination={{ pageSize: 8 }} />
                    </Card>
                </Col>
            </Row>

            <Modal
                title={<Space><PlusOutlined style={{ color: '#136dec' }} /> Assign New Task</Space>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAddTask} style={{ marginTop: '16px' }}>
                    <Form.Item label="Task Title" name="title" rules={[{ required: true, message: 'Please enter task title' }]}>
                        <Input placeholder="Describe what needs to be done" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Assign To" name="intern" rules={[{ required: true, message: 'Select an intern' }]}>
                                <Select placeholder="Choose intern" options={[
                                    { value: 'Sarah Jenkins', label: 'Sarah Jenkins' },
                                    { value: 'David Chen', label: 'David Chen' }
                                ]} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Due Date" name="dueDate" rules={[{ required: true, message: 'Select due date' }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Priority" name="priority" rules={[{ required: true, message: 'Select priority' }]}>
                        <Select placeholder="Set priority" options={[
                            { value: 'High', label: 'High Priority' },
                            { value: 'Medium', label: 'Medium Priority' },
                            { value: 'Low', label: 'Low Priority' }
                        ]} />
                    </Form.Item>
                    <Form.Item label="Task Description" name="description">
                        <Input.TextArea rows={3} placeholder="Provide additional details, links, or requirements" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
