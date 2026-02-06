import {
    SearchOutlined,
    EditOutlined,
    EyeOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Input,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
    Breadcrumb,
    Progress
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title, Text } = Typography;

interface Intern {
    key: string;
    id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    track: string;
    mentor: string;
    startDate: string;
    endDate: string;
    progress: number;
    status: 'Active' | 'Completed' | 'Dropped';
}

const initialData: Intern[] = [
    {
        key: '1',
        id: 'ITS-001',
        name: 'Sarah Jenkins',
        avatar: 'https://i.pravatar.cc/150?u=1',
        email: 'sarah.j@example.com',
        phone: '+1 234 567 890',
        track: 'Frontend Development',
        mentor: 'Michael Ross',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        progress: 75,
        status: 'Active'
    },
    {
        key: '2',
        id: 'ITS-002',
        name: 'David Chen',
        avatar: 'https://i.pravatar.cc/150?u=2',
        email: 'david.c@example.com',
        phone: '+1 234 567 891',
        track: 'Backend Development',
        mentor: 'Harvey Specter',
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        progress: 40,
        status: 'Active'
    },
    {
        key: '3',
        id: 'ITS-003',
        name: 'Emily Davis',
        avatar: 'https://i.pravatar.cc/150?u=3',
        email: 'emily.d@example.com',
        phone: '+1 234 567 892',
        track: 'UI/UX Design',
        mentor: 'Rachel Zane',
        startDate: '2023-11-01',
        endDate: '2024-02-01',
        progress: 100,
        status: 'Completed'
    },
    {
        key: '4',
        id: 'ITS-004',
        name: 'Michael Ross Jr.',
        avatar: 'https://i.pravatar.cc/150?u=4',
        email: 'mike.r@example.com',
        phone: '+1 234 567 893',
        track: 'Fullstack Track',
        mentor: 'Louis Litt',
        startDate: '2024-03-01',
        endDate: '2024-06-01',
        progress: 10,
        status: 'Active'
    }
];

export const InternList = () => {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const columns: ColumnsType<Intern> = [
        {
            title: 'Intern Info',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space size="middle">
                    <Avatar size={40} src={record.avatar} icon={<UserOutlined />} />
                    <div>
                        <Text strong style={{ display: 'block' }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.id}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (_, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                        <MailOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} /> {record.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                        <PhoneOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} /> {record.phone}
                    </div>
                </div>
            )
        },
        {
            title: 'Track & Mentor',
            key: 'track',
            render: (_, record) => (
                <div>
                    <Tag color="purple">{record.track}</Tag>
                    <div style={{ marginTop: '4px', fontSize: '12px' }}>
                        <Text type="secondary">Mentor: </Text>
                        <Text strong>{record.mentor}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Duration',
            key: 'duration',
            render: (_, record) => (
                <div style={{ fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarOutlined style={{ color: '#8c8c8c' }} /> {record.startDate}
                    </div>
                    <Text type="secondary" style={{ fontSize: '11px', paddingLeft: '18px' }}>to {record.endDate}</Text>
                </div>
            )
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            width: 180,
            render: (progress) => (
                <div style={{ width: '100%' }}>
                    <Progress percent={progress} size="small" strokeColor="#136dec" />
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'processing';
                if (status === 'Completed') color = 'success';
                if (status === 'Dropped') color = 'error';
                return <Tag color={color} style={{ borderRadius: '10px' }}>{status}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="text" icon={<EyeOutlined />} onClick={() => message.info(`Viewing ${record.name}`)} />
                    <Button type="text" icon={<EditOutlined />} onClick={() => message.info(`Editing ${record.name}`)} />
                </Space>
            )
        }
    ];

    const filteredData = initialData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.track.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[
                        { title: 'Internship' },
                        { title: 'Intern List' },
                    ]}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <Title level={3} style={{ margin: 0 }}>Internship Management</Title>
                    <Text type="secondary">View and manage all active, completed, and dropped internship profiles.</Text>
                </div>
                <Button type="primary">Export List</Button>
            </div>

            <Card bordered={false} style={{ borderRadius: '12px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                    <Input
                        placeholder="Search interns by name or track..."
                        prefix={<SearchOutlined />}
                        style={{ width: 350 }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        defaultValue="All"
                        style={{ width: 160 }}
                        onChange={setStatusFilter}
                        options={[
                            { value: 'All', label: 'All Statuses' },
                            { value: 'Active', label: 'Active' },
                            { value: 'Completed', label: 'Completed' },
                            { value: 'Dropped', label: 'Dropped' }
                        ]}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};
