import { FC } from 'react';
import { Table, Tag, Typography, Card, Button } from 'antd';
import { SafetyCertificateOutlined, SettingOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const PermissionManagement: FC = () => {
    const dataSource = [
        {
            key: '1',
            role: 'Admin',
            permissions: ['FULL_ACCESS'],
            description: 'Toàn quyền quản trị hệ thống'
        },
        {
            key: '2',
            role: 'Mentor',
            permissions: ['READ_ALL', 'MANAGE_INTERNS', 'EVALUATE_TASKS'],
            description: 'Quản lý thực tập sinh và đánh giá'
        },
        {
            key: '3',
            role: 'Intern',
            permissions: ['READ_OWN_DATA', 'SUBMIT_TASKS'],
            description: 'Xem tài liệu và nộp bài tập'
        }
    ];

    const columns = [
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (text: string) => <strong>{text}</strong>
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Quyền hạn',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (perms: string[]) => (
                <>
                    {perms.map((p) => (
                        <Tag key={p} color='purple' style={{ marginBottom: '4px' }}>
                            {p}
                        </Tag>
                    ))}
                </>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: () => (
                <Button type='link' icon={<SettingOutlined />}>
                    Cấu hình
                </Button>
            )
        }
    ];

    return (
        <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
            >
                <Title level={4} style={{ margin: 0 }}>
                    Phân quyền hệ thống
                </Title>
                <Button type='primary' icon={<SafetyCertificateOutlined />}>
                    Thêm vai trò
                </Button>
            </div>
            <Table dataSource={dataSource} columns={columns} pagination={false} />
        </Card>
    );
};
