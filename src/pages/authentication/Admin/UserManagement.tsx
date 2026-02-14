import { FC } from 'react';
import { Table, Tag, Space, Button, Typography, Card } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const UserManagement: FC = () => {
    const dataSource = [
        {
            key: '1',
            name: 'Admin Hệ Thống',
            email: 'admin@tts-learning.com',
            role: 'Admin',
            status: 'Active'
        },
        {
            key: '2',
            name: 'Nguyễn Văn Mentor',
            email: 'mentor1@tts-learning.com',
            role: 'Mentor',
            status: 'Active'
        }
    ];

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <a style={{ fontWeight: 600 }}>{text}</a>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => <Tag color={role === 'Admin' ? 'blue' : 'green'}>{role.toUpperCase()}</Tag>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color='success'>{status}</Tag>
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: () => (
                <Space size='middle'>
                    <Button type='text' icon={<EditOutlined />} />
                    <Button type='text' danger icon={<DeleteOutlined />} />
                </Space>
            )
        }
    ];

    return (
        <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
            >
                <Title level={4} style={{ margin: 0 }}>
                    Quản lý người dùng
                </Title>
                <Button type='primary' icon={<UserAddOutlined />}>
                    Thêm người dùng
                </Button>
            </div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 10 }} />
        </Card>
    );
};
