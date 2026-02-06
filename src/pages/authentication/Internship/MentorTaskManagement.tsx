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
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
        message.success(t('common.success'));
    };

    const columns: ColumnsType<Task> = [
        {
            title: t('task_mgmt.task_id'),
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text type="secondary" style={{ fontSize: '12px' }}>{text}</Text>
        },
        {
            title: t('task_mgmt.task_title'),
            dataIndex: 'title',
            key: 'title',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: t('task_mgmt.intern'),
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
            title: t('task_mgmt.priority'),
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => {
                let color = 'blue';
                if (priority === 'High') color = 'volcano';
                if (priority === 'Medium') color = 'gold';
                return <Tag color={color}>{priority === 'High' ? t('task_mgmt.high') : priority === 'Medium' ? t('task_mgmt.medium') : t('task_mgmt.low')}</Tag>;
            }
        },
        {
            title: t('task_mgmt.due_date'),
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
            title: t('common.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'In Progress') color = 'blue';
                if (status === 'Completed') color = 'success';
                const statusMap: any = {
                    'In Progress': t('task_mgmt.in_progress'),
                    'Under Review': t('task_mgmt.under_review'),
                    'Completed': t('task_mgmt.completed'),
                    'To Do': t('task_mgmt.to_do')
                };
                return <Tag color={color} style={{ borderRadius: '10px' }}>{statusMap[status] || status}</Tag>;
            }
        },
        {
            title: t('common.actions'),
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
                    <Title level={2} style={{ margin: 0 }}>{t('task_mgmt.title')}</Title>
                    <Text type="secondary">{t('task_mgmt.desc')}</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setIsModalOpen(true)}
                >
                    {t('task_mgmt.assign_task')}
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={6}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Card title={t('task_mgmt.stats')} bordered={false} style={{ borderRadius: '12px' }}>
                            <div style={{ padding: '10px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <Space><TeamOutlined style={{ color: '#136dec' }} /> <Text>{t('task_mgmt.active_interns')}</Text></Space>
                                    <Text strong>4</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <Space><ProjectOutlined style={{ color: '#faad14' }} /> <Text>{t('task_mgmt.open_tasks')}</Text></Space>
                                    <Text strong>15</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> <Text>{t('task_mgmt.completed')}</Text></Space>
                                    <Text strong>42</Text>
                                </div>
                            </div>
                        </Card>

                        <Card title={t('task_mgmt.activity')} bordered={false} style={{ borderRadius: '12px' }}>
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
                                <Select defaultValue={t('task_mgmt.all_interns')} style={{ width: 150 }} options={[
                                    { value: 'All Interns', label: t('task_mgmt.all_interns') },
                                    { value: 'Sarah Jenkins', label: 'Sarah Jenkins' },
                                    { value: 'David Chen', label: 'David Chen' }
                                ]} />
                                <Select defaultValue={t('task_mgmt.all_statuses')} style={{ width: 150 }} options={[
                                    { value: 'All Statuses', label: t('task_mgmt.all_statuses') },
                                    { value: 'In Progress', label: t('task_mgmt.in_progress') },
                                    { value: 'Completed', label: t('task_mgmt.completed') }
                                ]} />
                            </Space>
                            <Input prefix={<ProjectOutlined />} placeholder={t('task_mgmt.search_tasks')} style={{ width: 250 }} />
                        </div>
                        <Table columns={columns} dataSource={tasks} pagination={{ pageSize: 8 }} />
                    </Card>
                </Col>
            </Row>

            <Modal
                title={<Space><PlusOutlined style={{ color: '#136dec' }} /> {t('task_mgmt.assign_task')}</Space>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAddTask} style={{ marginTop: '16px' }}>
                    <Form.Item label={t('task_mgmt.task_title')} name="title" rules={[{ required: true, message: t('common.required_field') }]}>
                        <Input placeholder={t('task_mgmt.task_title')} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={t('task_mgmt.intern')} name="intern" rules={[{ required: true, message: t('common.required_field') }]}>
                                <Select placeholder="Choose intern" options={[
                                    { value: 'Sarah Jenkins', label: 'Sarah Jenkins' },
                                    { value: 'David Chen', label: 'David Chen' }
                                ]} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t('task_mgmt.due_date')} name="dueDate" rules={[{ required: true, message: t('common.required_field') }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label={t('task_mgmt.priority')} name="priority" rules={[{ required: true, message: t('common.required_field') }]}>
                        <Select placeholder={t('task_mgmt.priority')} options={[
                            { value: 'High', label: t('task_mgmt.high') },
                            { value: 'Medium', label: t('task_mgmt.medium') },
                            { value: 'Low', label: t('task_mgmt.low') }
                        ]} />
                    </Form.Item>
                    <Form.Item label={t('learning_path.description_optional')} name="description">
                        <Input.TextArea rows={3} placeholder={t('learning_path.description_optional')} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
