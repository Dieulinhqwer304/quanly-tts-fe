import { FC, useState } from 'react';
import {
    Table,
    Tag,
    Space,
    Button,
    Typography,
    Card,
    Input,
    Select,
    Modal,
    Form,
    message,
    Popconfirm,
    Tooltip,
    Avatar
} from 'antd';
import {
    UserAddOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
    UserOutlined,
    CheckCircleOutlined,
    StopOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { Option } = Select;

interface UserRecord {
    key: string;
    name: string;
    email: string;
    role: 'Admin' | 'Mentor' | 'Intern' | 'Director';
    status: 'Active' | 'Inactive';
    lastLogin?: string;
}

export const UserManagement: FC = () => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const [form] = Form.useForm();

    const [users, setUsers] = useState<UserRecord[]>([
        {
            key: '1',
            name: 'Admin Hệ Thống',
            email: 'admin@tts-learning.com',
            role: 'Admin',
            status: 'Active',
            lastLogin: '2024-03-15 10:30'
        },
        {
            key: '2',
            name: 'Nguyễn Văn Mentor',
            email: 'mentor1@tts-learning.com',
            role: 'Mentor',
            status: 'Active',
            lastLogin: '2024-03-16 09:15'
        },
        {
            key: '3',
            name: 'Trần Thị Intern',
            email: 'intern1@tts-learning.com',
            role: 'Intern',
            status: 'Inactive',
            lastLogin: '2024-03-10 14:20'
        },
        {
            key: '4',
            name: 'Lê Quang Director',
            email: 'director@tts-learning.com',
            role: 'Director',
            status: 'Active',
            lastLogin: '2024-03-16 08:00'
        }
    ]);

    const handleAddUser = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEditUser = (record: UserRecord) => {
        setEditingUser(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDeleteUser = (key: string) => {
        setUsers(users.filter((user) => user.key !== key));
        message.success('Xóa người dùng thành công');
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            if (editingUser) {
                setUsers(users.map((u) => (u.key === editingUser.key ? { ...u, ...values } : u)));
                message.success('Cập nhật người dùng thành công');
            } else {
                const newUser = {
                    key: Date.now().toString(),
                    ...values,
                    status: 'Active',
                    lastLogin: '-'
                };
                setUsers([...users, newUser]);
                message.success('Thêm người dùng thành công');
            }
            setIsModalOpen(false);
        });
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const columns = [
        {
            title: 'Người dùng',
            key: 'user',
            render: (record: UserRecord) => (
                <Space>
                    <Avatar
                        icon={<UserOutlined />}
                        style={{ backgroundColor: record.role === 'Admin' ? '#136dec' : '#f56a00' }}
                    />
                    <div>
                        <Text strong style={{ display: 'block' }}>
                            {record.name}
                        </Text>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                let color = 'default';
                if (role === 'Admin') color = 'blue';
                if (role === 'Mentor') color = 'green';
                if (role === 'Director') color = 'purple';
                if (role === 'Intern') color = 'orange';
                return <Tag color={color}>{role.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag
                    icon={status === 'Active' ? <CheckCircleOutlined /> : <StopOutlined />}
                    color={status === 'Active' ? 'success' : 'error'}
                >
                    {status === 'Active' ? 'Đang hoạt động' : 'Đã khóa'}
                </Tag>
            )
        },
        {
            title: 'Đăng nhập cuối',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            render: (text: string) => (
                <Text type='secondary' style={{ fontSize: '13px' }}>
                    {text}
                </Text>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (record: UserRecord) => (
                <Space size='small'>
                    <Tooltip title='Chỉnh sửa'>
                        <Button type='text' icon={<EditOutlined />} onClick={() => handleEditUser(record)} />
                    </Tooltip>
                    <Popconfirm
                        title='Xác nhận xóa'
                        description='Bạn có chắc chắn muốn xóa người dùng này?'
                        onConfirm={() => handleDeleteUser(record.key)}
                        okText='Xóa'
                        cancelText='Hủy'
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title='Xóa'>
                            <Button type='text' danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '32px'
                    }}
                >
                    <div>
                        <Title level={3} style={{ margin: 0, color: '#1a3353' }}>
                            Quản lý người dùng
                        </Title>
                        <Text type='secondary'>Quản lý tài khoản, vai trò và quyền truy cập của nhân viên.</Text>
                    </div>
                    <Button
                        type='primary'
                        size='large'
                        icon={<UserAddOutlined />}
                        onClick={handleAddUser}
                        style={{ height: '45px', borderRadius: '8px', padding: '0 24px' }}
                    >
                        Thêm người dùng mới
                    </Button>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <Input
                        placeholder='Tìm kiếm theo tên hoặc email...'
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        style={{ width: '300px', borderRadius: '8px' }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                    <Select
                        placeholder='Lọc theo vai trò'
                        style={{ width: '180px' }}
                        value={roleFilter}
                        onChange={setRoleFilter}
                        allowClear
                    >
                        <Option value='Admin'>Admin</Option>
                        <Option value='Mentor'>Mentor</Option>
                        <Option value='Intern'>Intern</Option>
                        <Option value='Director'>Director</Option>
                    </Select>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            setSearchText('');
                            setRoleFilter(null);
                        }}
                    />
                </div>

                <Table
                    dataSource={filteredUsers}
                    columns={columns}
                    pagination={{ pageSize: 8, showSizeChanger: true }}
                    style={{ borderRadius: '8px' }}
                />

                <Modal
                    title={editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
                    open={isModalOpen}
                    onOk={handleModalOk}
                    onCancel={() => setIsModalOpen(false)}
                    okText={editingUser ? 'Cập nhật' : 'Tạo mới'}
                    cancelText='Hủy bỏ'
                    width={500}
                    centered
                >
                    <Form form={form} layout='vertical' style={{ marginTop: '24px' }}>
                        <Form.Item
                            name='name'
                            label='Họ và tên'
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                        >
                            <Input placeholder='Nguyễn Văn A' />
                        </Form.Item>
                        <Form.Item
                            name='email'
                            label='Địa chỉ Email'
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không đúng định dạng' }
                            ]}
                        >
                            <Input placeholder='example@company.com' />
                        </Form.Item>
                        <Form.Item
                            name='role'
                            label='Vai trò'
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                        >
                            <Select placeholder='Chọn vai trò'>
                                <Option value='Admin'>Admin</Option>
                                <Option value='Mentor'>Mentor</Option>
                                <Option value='Intern'>Intern</Option>
                                <Option value='Director'>Director</Option>
                            </Select>
                        </Form.Item>
                        {editingUser && (
                            <Form.Item name='status' label='Trạng thái'>
                                <Select>
                                    <Option value='Active'>Đang hoạt động</Option>
                                    <Option value='Inactive'>Đã khóa</Option>
                                </Select>
                            </Form.Item>
                        )}
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};
