import {
    PlusOutlined,
    SearchOutlined,
    FilterOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Input,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    Modal,
    Form,
    InputNumber,
    message,
    Breadcrumb,
    Dropdown,
    DatePicker
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/es/input/TextArea';
import dayjs, { Dayjs } from 'dayjs';
import {
    useMentorRequests,
    useCreateMentorRequest,
    useUpdateMentorRequest,
    useDeleteMentorRequest
} from '../../../hooks/Recruitment/useMentorRequests';
import { CreateMentorRequestParams, MentorRequest } from '../../../services/Recruitment/mentorRequests';
import { useResponsive } from '../../../hooks/useResponsive';

const { Title, Text } = Typography;

interface MentorRequestFormValues {
    type: 'Recruitment' | 'Training' | 'Equipment';
    priority: 'High' | 'Medium' | 'Low';
    name: string;
    title: string;
    department: string;
    quantity?: number;
    positions?: string | string[];
    requiredSkills?: string | string[];
    expectedStartDate?: Dayjs;
}

export const MentorRequestList = () => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form] = Form.useForm();

    // Data fetching
    const { data: requestsData, isLoading } = useMentorRequests({
        search: searchText,
        status: statusFilter === 'all' ? undefined : statusFilter
    });

    const createMutation = useCreateMentorRequest();
    const updateMutation = useUpdateMentorRequest();
    const deleteMutation = useDeleteMentorRequest();

    const requests: MentorRequest[] = requestsData?.data?.hits || [];

    const handleOpenCreate = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (record: MentorRequest) => {
        setEditingId(record.id);
        form.setFieldsValue({
            ...record,
            expectedStartDate: record.expectedStartDate ? dayjs(record.expectedStartDate) : undefined
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: MentorRequestFormValues) => {
        try {
            const formData: any = {
                ...values,
                expectedStartDate: values.expectedStartDate ? values.expectedStartDate.format('YYYY-MM-DD') : undefined
            };

            if (editingId) {
                await updateMutation.mutateAsync({
                    id: editingId,
                    ...formData
                });
                message.success(t('mentor_request.update_success'));
            } else {
                await createMutation.mutateAsync(formData);
                message.success(t('mentor_request.create_success'));
            }
            setIsModalOpen(false);
            form.resetFields();
        } catch {
            message.error(t('common.error'));
        }
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: t('mentor_request.confirm_delete'),
            content: t('mentor_request.confirm_delete_msg'),
            okText: t('common.delete'),
            cancelText: t('common.cancel'),
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await deleteMutation.mutateAsync(id);
                    message.success(t('mentor_request.delete_success'));
                } catch {
                    message.error(t('common.error'));
                }
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'warning';
            case 'Approved':
                return 'success';
            case 'Rejected':
                return 'error';
            case 'In Progress':
                return 'processing';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending':
                return <ClockCircleOutlined />;
            case 'Approved':
                return <CheckCircleOutlined />;
            case 'Rejected':
                return <CloseCircleOutlined />;
            default:
                return <ClockCircleOutlined />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Pending':
                return t('mentor_request.pending');
            case 'Approved':
                return t('mentor_request.approved');
            case 'Rejected':
                return t('mentor_request.rejected');
            case 'In Progress':
                return t('mentor_request.in_progress');
            default:
                return status;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'red';
            case 'Medium':
                return 'orange';
            case 'Low':
                return 'blue';
            default:
                return 'default';
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'High':
                return t('mentor_request.high');
            case 'Medium':
                return t('mentor_request.medium');
            case 'Low':
                return t('mentor_request.low');
            default:
                return priority;
        }
    };

    const columns: ColumnsType<MentorRequest> = [
        {
            title: t('mentor_request.request_title'),
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{text}</div>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                        {record.mentor?.fullName || 'N/A'}
                    </Text>
                </div>
            )
        },
        {
            title: t('mentor_request.department'),
            dataIndex: 'department',
            key: 'department',
            width: 150
        },
        {
            title: t('mentor_request.positions_quantity'),
            key: 'position',
            width: 250,
            render: (_, record) => (
                <div>
                    <Tag style={{ marginBottom: '4px' }}>{record.position}</Tag>
                    {record.quantity && (
                        <div style={{ marginTop: '4px' }}>
                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                {t('mentor_request.form.quantity')}: {record.quantity}
                            </Text>
                        </div>
                    )}
                </div>
            )
        },
        {
            title: t('mentor_request.priority'),
            dataIndex: 'priority',
            key: 'priority',
            width: 120,
            render: (priority) => <Tag color={getPriorityColor(priority)}>{getPriorityText(priority)}</Tag>
        },
        {
            title: t('mentor_request.status'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status) => (
                <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            )
        },
        {
            title: t('mentor_request.created_at'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: t('common.actions'),
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'edit',
                                label: t('common.edit'),
                                icon: <EditOutlined />,
                                disabled: record.status !== 'Pending',
                                onClick: () => handleOpenEdit(record)
                            },
                            {
                                key: 'delete',
                                label: t('common.delete'),
                                icon: <DeleteOutlined />,
                                danger: true,
                                disabled: record.status === 'Approved',
                                onClick: () => handleDelete(record.id)
                            }
                        ]
                    }}
                    trigger={['click']}
                >
                    <Button type='text' icon={<EditOutlined rotate={90} />} />
                </Dropdown>
            )
        }
    ];

    // Stats Calculation
    const pendingCount = requests.filter((r) => r.status === 'Pending').length;
    const approvedCount = requests.filter((r) => r.status === 'Approved').length;
    const processingCount = requests.filter((r) => r.status === 'In Progress').length;

    return (
        <div style={{ padding: isMobile ? '12px' : isLaptop ? '18px' : '24px' }}>
            <div style={{ marginBottom: '16px' }}>
                <Breadcrumb
                    items={[{ title: t('menu.recruitment_management') }, { title: t('mentor_request.title') }]}
                />
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'flex-start',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '10px' : 0,
                    marginBottom: '24px'
                }}
            >
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        {t('mentor_request.title')}
                    </Title>
                    <Text type='secondary'>{t('mentor_request.desc')}</Text>
                </div>
                <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreate}>
                    {t('mentor_request.create_request')}
                </Button>
            </div>

            <Card bordered={false}>
                <div
                    style={{
                        marginBottom: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '10px' : 0
                    }}
                >
                    <Space wrap>
                        <Input
                            placeholder={t('mentor_request.search_placeholder')}
                            prefix={<SearchOutlined />}
                            style={{ width: isMobile ? '100%' : 250 }}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            defaultValue='all'
                            style={{ width: isMobile ? '100%' : 150 }}
                            onChange={setStatusFilter}
                            options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'Pending', label: t('mentor_request.pending') },
                                { value: 'Approved', label: t('mentor_request.approved') },
                                { value: 'Rejected', label: t('mentor_request.rejected') },
                                { value: 'In Progress', label: t('mentor_request.in_progress') }
                            ]}
                        />
                    </Space>
                    <Button icon={<FilterOutlined />}>{t('common.filter')}</Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={requests}
                    rowKey='id'
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            <Modal
                title={editingId ? t('mentor_request.edit_request') : t('mentor_request.create_request')}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
                width={isMobile ? 'calc(100vw - 24px)' : isLaptop ? 620 : 700}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleSubmit}
                    initialValues={{ type: 'Recruitment', priority: 'Medium' }}
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('mentor_request.form.type')} name='type'>
                                <Select>
                                    <Select.Option value='Recruitment'>Recruitment</Select.Option>
                                    <Select.Option value='Training'>Training</Select.Option>
                                    <Select.Option value='Equipment'>Equipment</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={t('mentor_request.form.priority')}
                                name='priority'
                                rules={[{ required: true, message: t('common.required_field') }]}
                            >
                                <Select>
                                    <Select.Option value='High'>{t('mentor_request.high')}</Select.Option>
                                    <Select.Option value='Medium'>{t('mentor_request.medium')}</Select.Option>
                                    <Select.Option value='Low'>{t('mentor_request.low')}</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={t('mentor_request.form.name')}
                        name='name'
                        rules={[{ required: true, message: t('common.required_field') }]}
                    >
                        <Input placeholder='VD: Kế hoạch Tuyển dụng Hè 2025' />
                    </Form.Item>
                    <Form.Item
                        label={t('mentor_request.form.title')}
                        name='title'
                        rules={[{ required: true, message: t('common.required_field') }]}
                    >
                        <Input placeholder='VD: Đề xuất tuyển thêm 5 thực tập sinh Backend' />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={t('mentor_request.form.department')}
                                name='department'
                                rules={[{ required: true, message: t('common.required_field') }]}
                            >
                                <Select>
                                    <Select.Option value='Engineering'>Engineering</Select.Option>
                                    <Select.Option value='Product'>Product</Select.Option>
                                    <Select.Option value='Design'>Design</Select.Option>
                                    <Select.Option value='QA'>QA</Select.Option>
                                    <Select.Option value='HR'>HR</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label={t('mentor_request.form.quantity')} name='quantity'>
                                <InputNumber style={{ width: '100%' }} min={1} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label={t('mentor_request.form.positions')} name='position'>
                        <Input placeholder={t('mentor_request.form.positions_placeholder')} />
                    </Form.Item>
                    <Form.Item label={t('mentor_request.form.skills')} name='requiredSkills'>
                        <TextArea rows={2} placeholder={t('mentor_request.form.skills_placeholder')} />
                    </Form.Item>
                    <Form.Item label={t('mentor_request.form.expected_date')} name='expectedStartDate'>
                        <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
