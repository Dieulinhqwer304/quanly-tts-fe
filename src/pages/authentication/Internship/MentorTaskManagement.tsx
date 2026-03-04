import {
    PlusOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    ProjectOutlined,
    EllipsisOutlined,
    UserOutlined,
    HistoryOutlined,
    CheckOutlined,
    CloseOutlined,
    EyeOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Input,
    Row,
    Space,
    Table,
    Tag,
    Typography,
    Modal,
    Form,
    Select,
    DatePicker,
    Dropdown,
    MenuProps,
    App
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
import { Task } from '../../../services/Internship/tasks';

const { Title, Text } = Typography;

const STATUS_MAP_TO_BACKEND: any = {
    'In Progress': 'in_progress',
    'Under Review': 'under_review',
    Completed: 'completed',
    'To Do': 'to_do'
};

export const MentorTaskManagement = () => {
    const { t } = useTranslation();
    const { message: messageApi } = App.useApp();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [internFilter, setInternFilter] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [tasksData, setTasksData] = useState<any>(null);
    const [internsData, setInternsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const params: any = {};
            if (searchText) {
                params.searcher = JSON.stringify({ keyword: searchText, field: 'title' });
            }
            if (statusFilter !== 'All Statuses' && statusFilter !== 'All') {
                params.status = statusFilter;
            }
            if (internFilter && internFilter !== 'All Interns') {
                params.internId = internFilter;
            }
            const res = await http.get('/tasks', { params });
            setTasksData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInterns = async () => {
        try {
            const res = await http.get('/interns');
            setInternsData(res);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [searchText, statusFilter, internFilter]);

    useEffect(() => {
        fetchInterns();
    }, []);

    const handleAddTask = async (values: any) => {
        setIsProcessing(true);
        try {
            const selectedIntern = internsData?.data?.find((i: any) => i.id === values.internId);
            await http.post('/tasks', {
                title: values.title,
                internId: values.internId,
                mentorId: selectedIntern?.mentorId || '93086eb4-a316-431b-a53c-1349f280a8f8', // Fallback to mentor from intern or default
                priority: values.priority.toLowerCase() as any,
                dueDate: values.dueDate.format('YYYY-MM-DD'),
                description: values.description || ''
            });
            setIsModalOpen(false);
            form.resetFields();
            messageApi.success(t('common.success'));
            fetchTasks();
        } catch {
            messageApi.error(t('common.error'));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateStatus = (id: string, newStatus: string) => {
        const backendStatus = STATUS_MAP_TO_BACKEND[newStatus] || newStatus.toLowerCase().replace(' ', '_');
        http.patch(`/tasks/${id}`, {
            status: backendStatus
        }).then(() => {
            messageApi.success(t('common.success'));
            fetchTasks();
        });
    };

    const responseData = tasksData;
    const dataSource = responseData?.data || [];

    const getActionMenu = (record: Task): MenuProps => ({
        items: [
            {
                key: 'view',
                label: t('task_mgmt.view_details'),
                icon: <EyeOutlined />,
                onClick: () =>
                    Modal.info({ title: record.title, content: record.description || 'No description provided.' })
            },
            {
                key: 'approve',
                label: t('task_mgmt.approve_complete'),
                icon: <CheckOutlined />,
                disabled: record.status === 'completed',
                onClick: () => handleUpdateStatus(record.id, 'completed')
            },
            {
                key: 'return',
                label: t('task_mgmt.request_revision'),
                icon: <CloseOutlined />,
                disabled: record.status === 'completed' || record.status === 'to_do',
                onClick: () => handleUpdateStatus(record.id, 'in_progress')
            }
        ]
    });

    const columns: ColumnsType<Task> = [
        {
            title: t('task_mgmt.task_id'),
            dataIndex: 'id',
            key: 'id',
            render: (text) => (
                <Text type='secondary' style={{ fontSize: '12px' }}>
                    {text}
                </Text>
            )
        },
        {
            title: t('common.status'),
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                const s = status?.toLowerCase();
                let color = 'default';
                if (s === 'in_progress') color = 'blue';
                if (s === 'completed') color = 'success';
                if (s === 'under_review') color = 'warning';
                if (s === 'need_rework') color = 'error';

                const statusMap: any = {
                    in_progress: t('task_mgmt.in_progress'),
                    under_review: t('task_mgmt.under_review'),
                    completed: t('task_mgmt.completed'),
                    to_do: t('task_mgmt.to_do'),
                    need_rework: t('task_mgmt.need_rework')
                };
                return (
                    <Tag color={color} style={{ borderRadius: '10px' }}>
                        {statusMap[s] || status}
                    </Tag>
                );
            }
        },
        {
            title: t('task_mgmt.task_title'),
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: t('task_mgmt.intern'),
            dataIndex: 'internName',
            key: 'internName',
            ellipsis: true,
            render: (text, record: any) => (
                <Space>
                    <Avatar size='small' src={record.internAvatar} />
                    <Text>{typeof text === 'string' ? text : record.intern?.user?.fullName || 'N/A'}</Text>
                </Space>
            )
        },
        {
            title: t('task_mgmt.priority'),
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => {
                const p = priority?.toLowerCase();
                let color = 'blue';
                if (p === 'high') color = 'volcano';
                if (p === 'medium') color = 'gold';
                return (
                    <Tag color={color}>
                        {p === 'high'
                            ? t('task_mgmt.high')
                            : p === 'medium'
                              ? t('task_mgmt.medium')
                              : t('task_mgmt.low')}
                    </Tag>
                );
            }
        },
        {
            title: t('task_mgmt.due_date'),
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => (
                <Space>
                    <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                    <Text style={{ fontSize: '13px' }}>{typeof date === 'string' ? date : 'N/A'}</Text>
                </Space>
            )
        },
        {
            title: t('common.actions'),
            key: 'action',
            width: 80,
            fixed: 'right',
            render: (_, record) => (
                <Dropdown menu={getActionMenu(record)} trigger={['click']}>
                    <Button type='text' icon={<EllipsisOutlined />} />
                </Dropdown>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '24px'
                }}
            >
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        {t('task_mgmt.title')}
                    </Title>
                    <Text type='secondary'>{t('task_mgmt.desc')}</Text>
                </div>
                <Button type='primary' icon={<PlusOutlined />} size='large' onClick={() => setIsModalOpen(true)}>
                    {t('task_mgmt.assign_task')}
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={24}>
                    <Card variant='borderless' style={{ borderRadius: '12px' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                            <Space size='middle'>
                                <Select
                                    defaultValue='All Interns'
                                    style={{ width: 150 }}
                                    onChange={setInternFilter}
                                    options={[
                                        { value: 'All Interns', label: t('task_mgmt.all_interns') },
                                        ...(internsData?.data?.map((i: any) => ({ value: i.id, label: i.name })) || [])
                                    ]}
                                />
                                <Select
                                    defaultValue='All Statuses'
                                    style={{ width: 150 }}
                                    onChange={setStatusFilter}
                                    options={[
                                        { value: 'All Statuses', label: t('task_mgmt.all_statuses') },
                                        { value: 'in_progress', label: t('task_mgmt.in_progress') },
                                        { value: 'under_review', label: t('task_mgmt.under_review') },
                                        { value: 'completed', label: t('task_mgmt.completed') },
                                        { value: 'to_do', label: t('task_mgmt.to_do') }
                                    ]}
                                />
                            </Space>
                            <Input
                                prefix={<ProjectOutlined />}
                                placeholder={t('task_mgmt.search_tasks')}
                                style={{ width: 250 }}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            scroll={{ x: 'max-content' }}
                            loading={isLoading}
                            pagination={{
                                total: tasksData?.pagination?.totalRows || dataSource.length,
                                pageSize: 8
                            }}
                            rowKey='id'
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                title={
                    <Space>
                        <PlusOutlined style={{ color: '#1E40AF' }} /> {t('task_mgmt.assign_task')}
                    </Space>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isProcessing}
                destroyOnClose
            >
                <Form form={form} layout='vertical' onFinish={handleAddTask} style={{ marginTop: '16px' }}>
                    <Form.Item
                        label={t('task_mgmt.task_title')}
                        name='title'
                        rules={[{ required: true, message: t('common.required_field') }]}
                    >
                        <Input placeholder={t('task_mgmt.task_title')} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t('task_mgmt.intern')}
                                name='internId'
                                rules={[{ required: true, message: t('common.required_field') }]}
                            >
                                <Select
                                    placeholder={t('task_mgmt.choose_intern')}
                                    options={internsData?.data?.map((i: any) => ({ value: i.id, label: i.name }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t('task_mgmt.due_date')}
                                name='dueDate'
                                rules={[{ required: true, message: t('common.required_field') }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={t('task_mgmt.priority')}
                        name='priority'
                        rules={[{ required: true, message: t('common.required_field') }]}
                    >
                        <Select
                            placeholder={t('task_mgmt.priority')}
                            options={[
                                { value: 'High', label: t('task_mgmt.high') },
                                { value: 'Medium', label: t('task_mgmt.medium') },
                                { value: 'Low', label: t('task_mgmt.low') }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label={t('learning_path.description_optional')} name='description'>
                        <Input.TextArea rows={3} placeholder={t('learning_path.description_optional')} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
