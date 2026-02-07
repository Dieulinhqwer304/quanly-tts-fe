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
    Dropdown
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/es/input/TextArea';

const { Title, Text } = Typography;

interface RecruitmentRequest {
    id: string;
    type: 'Recruitment' | 'Training' | 'Equipment';
    name: string;
    title: string;
    department: string;
    requestedBy: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
    positions?: string[];
    quantity?: number;
    requiredSkills?: string[];
    expectedStartDate?: string;
    createdAt: string;
    updatedAt: string;
}

const mockRequests: RecruitmentRequest[] = [
    {
        id: 'REQ-001',
        type: 'Recruitment',
        name: 'Kế hoạch Hè 2025',
        title: 'Đề xuất mở rộng slot thực tập sinh cho team AI',
        department: 'Engineering',
        requestedBy: 'Nguyễn Văn Mentor',
        priority: 'High',
        status: 'Pending',
        positions: ['AI/ML Intern', 'Data Science Intern'],
        quantity: 5,
        requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
        expectedStartDate: '2025-06-01',
        createdAt: '2025-03-06T10:30:00',
        updatedAt: '2025-03-06T10:30:00'
    },
    {
        id: 'REQ-002',
        type: 'Recruitment',
        name: 'Tuyển Frontend Q2',
        title: 'Cần thực tập sinh Frontend cho dự án mới',
        department: 'Product',
        requestedBy: 'Trần Thị Leader',
        priority: 'Medium',
        status: 'Approved',
        positions: ['Frontend Developer Intern'],
        quantity: 3,
        requiredSkills: ['ReactJS', 'TypeScript', 'CSS', 'HTML'],
        expectedStartDate: '2025-04-15',
        createdAt: '2025-03-01T09:00:00',
        updatedAt: '2025-03-05T14:20:00'
    },
    {
        id: 'REQ-003',
        type: 'Recruitment',
        name: 'Backend Team Expansion',
        title: 'Mở rộng đội Backend cho microservices',
        department: 'Engineering',
        requestedBy: 'Lê Văn Tech Lead',
        priority: 'High',
        status: 'In Progress',
        positions: ['Backend Developer Intern'],
        quantity: 4,
        requiredSkills: ['NodeJS', 'NestJS', 'MongoDB', 'PostgreSQL'],
        expectedStartDate: '2025-05-01',
        createdAt: '2025-02-28T11:15:00',
        updatedAt: '2025-03-04T16:45:00'
    }
];

export const MentorRequestList = () => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [requests, setRequests] = useState<RecruitmentRequest[]>(mockRequests);

    const handleCreateRequest = (values: any) => {
        const newRequest: RecruitmentRequest = {
            id: `REQ-${String(requests.length + 1).padStart(3, '0')}`,
            type: values.type || 'Recruitment',
            name: values.name,
            title: values.title,
            department: values.department,
            requestedBy: 'Current User', // Should come from auth context
            priority: values.priority,
            status: 'Pending',
            positions: values.positions?.split(',').map((p: string) => p.trim()),
            quantity: values.quantity,
            requiredSkills: values.requiredSkills?.split(',').map((s: string) => s.trim()),
            expectedStartDate: values.expectedStartDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setRequests([newRequest, ...requests]);
        message.success('Đề xuất đã được tạo thành công!');
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa đề xuất này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                setRequests(requests.filter((r) => r.id !== id));
                message.success('Đã xóa đề xuất');
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

    const columns: ColumnsType<RecruitmentRequest> = [
        {
            title: 'Mã đề xuất',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Tiêu đề đề xuất',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{text}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.name}
                    </Text>
                </div>
            )
        },
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            key: 'department',
            width: 150
        },
        {
            title: 'Vị trí & Số lượng',
            key: 'positions',
            width: 200,
            render: (_, record) => (
                <div>
                    {record.positions?.map((pos, idx) => (
                        <Tag key={idx} style={{ marginBottom: '4px' }}>
                            {pos}
                        </Tag>
                    ))}
                    {record.quantity && (
                        <div style={{ marginTop: '4px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Số lượng: {record.quantity}
                            </Text>
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            width: 120,
            render: (priority) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status) => (
                <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
                    {status === 'Pending'
                        ? 'Chờ duyệt'
                        : status === 'Approved'
                            ? 'Đã duyệt'
                            : status === 'Rejected'
                                ? 'Từ chối'
                                : 'Đang xử lý'}
                </Tag>
            )
        },
        {
            title: 'Ngày tạo',
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
                                label: 'Chỉnh sửa',
                                icon: <EditOutlined />,
                                disabled: record.status !== 'Pending'
                            },
                            {
                                key: 'delete',
                                label: 'Xóa',
                                icon: <DeleteOutlined />,
                                danger: true,
                                disabled: record.status === 'Approved'
                            }
                        ],
                        onClick: ({ key }) => {
                            if (key === 'delete') {
                                handleDelete(record.id);
                            }
                        }
                    }}
                    trigger={['click']}
                >
                    <Button type="text">...</Button>
                </Dropdown>
            )
        }
    ];

    const filteredData = requests.filter((req) => {
        const matchSearch =
            req.title.toLowerCase().includes(searchText.toLowerCase()) ||
            req.name.toLowerCase().includes(searchText.toLowerCase()) ||
            req.department.toLowerCase().includes(searchText.toLowerCase());
        const matchStatus = statusFilter === 'all' || req.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: requests.length,
        pending: requests.filter((r) => r.status === 'Pending').length,
        approved: requests.filter((r) => r.status === 'Approved').length,
        rejected: requests.filter((r) => r.status === 'Rejected').length
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[{ title: t('menu.recruitment_management') }, { title: 'Đề xuất tuyển dụng' }]}
                />
            </div>

            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
            >
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        Đề xuất tuyển dụng
                    </Title>
                    <Text type="secondary">Quản lý các đề xuất nhu cầu tuyển dụng từ các phòng ban</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsModalOpen(true)}>
                    Tạo đề xuất mới
                </Button>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ color: '#8c8c8c', marginBottom: '8px' }}>Tổng đề xuất</div>
                        <Title level={2} style={{ margin: 0 }}>
                            {stats.total}
                        </Title>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ color: '#8c8c8c', marginBottom: '8px' }}>Chờ duyệt</div>
                        <Title level={2} style={{ margin: 0, color: '#faad14' }}>
                            {stats.pending}
                        </Title>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ color: '#8c8c8c', marginBottom: '8px' }}>Đã duyệt</div>
                        <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                            {stats.approved}
                        </Title>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ color: '#8c8c8c', marginBottom: '8px' }}>Từ chối</div>
                        <Title level={2} style={{ margin: 0, color: '#ff4d4f' }}>
                            {stats.rejected}
                        </Title>
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card bordered={false} style={{ borderRadius: '12px', marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Input
                            placeholder="Tìm kiếm theo tiêu đề, tên kế hoạch, phòng ban..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={[
                                { label: 'Tất cả trạng thái', value: 'all' },
                                { label: 'Chờ duyệt', value: 'Pending' },
                                { label: 'Đã duyệt', value: 'Approved' },
                                { label: 'Từ chối', value: 'Rejected' },
                                { label: 'Đang xử lý', value: 'In Progress' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} md={6}>
                        <Button icon={<FilterOutlined />} block>
                            Bộ lọc nâng cao
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card bordered={false} style={{ borderRadius: '12px' }}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đề xuất`
                    }}
                />
            </Card>

            {/* Create Request Modal */}
            <Modal
                title="Tạo đề xuất tuyển dụng mới"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateRequest} style={{ marginTop: '24px' }}>
                    <Form.Item
                        label="Loại đề xuất"
                        name="type"
                        initialValue="Recruitment"
                        rules={[{ required: true, message: 'Vui lòng chọn loại đề xuất' }]}
                    >
                        <Select
                            options={[
                                { label: 'Tuyển dụng (Recruitment)', value: 'Recruitment' },
                                { label: 'Đào tạo (Training)', value: 'Training' },
                                { label: 'Thiết bị (Equipment)', value: 'Equipment' }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tên kế hoạch"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên kế hoạch' }]}
                    >
                        <Input placeholder="VD: Kế hoạch Hè 2025" />
                    </Form.Item>

                    <Form.Item
                        label="Tiêu đề đề xuất"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input placeholder="VD: Đề xuất mở rộng slot thực tập sinh cho team AI" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phòng ban"
                                name="department"
                                rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                            >
                                <Select
                                    placeholder="Chọn phòng ban"
                                    options={[
                                        { label: 'Engineering', value: 'Engineering' },
                                        { label: 'Product', value: 'Product' },
                                        { label: 'Design', value: 'Design' },
                                        { label: 'Marketing', value: 'Marketing' },
                                        { label: 'HR', value: 'HR' }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Độ ưu tiên"
                                name="priority"
                                initialValue="Medium"
                                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
                            >
                                <Select
                                    options={[
                                        { label: 'Cao (High)', value: 'High' },
                                        { label: 'Trung bình (Medium)', value: 'Medium' },
                                        { label: 'Thấp (Low)', value: 'Low' }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Vị trí cần tuyển" name="positions">
                        <Input placeholder="VD: Frontend Developer Intern, Backend Developer Intern (phân cách bằng dấu phẩy)" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Số lượng" name="quantity">
                                <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="VD: 5" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Thời gian dự kiến" name="expectedStartDate">
                                <Input type="date" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Yêu cầu kỹ năng" name="requiredSkills">
                        <TextArea
                            rows={3}
                            placeholder="VD: ReactJS, TypeScript, NodeJS (phân cách bằng dấu phẩy)"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    form.resetFields();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Gửi đề xuất
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
