import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
    EyeOutlined,
    FilterOutlined,
    ReloadOutlined,
    SearchOutlined,
    SortAscendingOutlined,
    TeamOutlined,
    RiseOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Input,
    Progress,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
    message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';

const { Title, Text } = Typography;

interface Candidate {
    key: string;
    id: string;
    name: string;
    email: string;
    appliedDate: string;
    timeAgo: string;
    status: 'Pending Review' | 'CV Screened' | 'Shortlisted' | 'Rejected';
    matchScore: number;
    avatar: string;
}

const initialData: Candidate[] = [
    {
        key: '1',
        id: '1',
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        appliedDate: 'Oct 24, 2023',
        timeAgo: '2 hours ago',
        status: 'Pending Review',
        matchScore: 92,
        avatar: 'https://i.pravatar.cc/150?u=1'
    },
    {
        key: '2',
        id: '2',
        name: 'David Chen',
        email: 'david.c@university.edu',
        appliedDate: 'Oct 23, 2023',
        timeAgo: '1 day ago',
        status: 'CV Screened',
        matchScore: 78,
        avatar: 'https://i.pravatar.cc/150?u=2'
    },
    {
        key: '3',
        id: '3',
        name: 'Marcus Jones',
        email: 'marcus.jones@email.com',
        appliedDate: 'Oct 22, 2023',
        timeAgo: '2 days ago',
        status: 'Rejected',
        matchScore: 45,
        avatar: 'MJ'
    },
    {
        key: '4',
        id: '4',
        name: 'Emily Wong',
        email: 'emily.w@design.io',
        appliedDate: 'Oct 20, 2023',
        timeAgo: '4 days ago',
        status: 'Shortlisted',
        matchScore: 98,
        avatar: 'https://i.pravatar.cc/150?u=4'
    },
    {
        key: '5',
        id: '5',
        name: 'Alex Johnson',
        email: 'alex.j@dev.net',
        appliedDate: 'Oct 19, 2023',
        timeAgo: '5 days ago',
        status: 'Pending Review',
        matchScore: 65,
        avatar: 'AJ'
    }
];

export const CVList = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [data] = useState<Candidate[]>(initialData);

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
    };

    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.email.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAction = (action: string, name: string) => {
        message.success(`${action} candidate ${name} successfully`);
    };

    const columns: ColumnsType<Candidate> = [
        {
            title: 'Candidate',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => navigate(RouteConfig.CVDetail.getPath(record.id))}
                >
                    {record.avatar.includes('http') ? (
                        <Avatar src={record.avatar} size={40} />
                    ) : (
                        <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size={40}>
                            {record.avatar}
                        </Avatar>
                    )}
                    <div>
                        <Text strong style={{ display: 'block' }}>
                            {text}
                        </Text>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            {record.email}
                        </Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Applied Date',
            dataIndex: 'appliedDate',
            key: 'appliedDate',
            render: (text, record) => (
                <div>
                    <Text style={{ display: 'block' }}>{text}</Text>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                        {record.timeAgo}
                    </Text>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'Pending Review') color = 'warning';
                if (status === 'CV Screened') color = 'processing';
                if (status === 'Shortlisted') color = 'success';
                if (status === 'Rejected') color = 'error';

                return (
                    <Tag color={color} style={{ borderRadius: '10px' }}>
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Match Score',
            dataIndex: 'matchScore',
            key: 'matchScore',
            sorter: (a, b) => a.matchScore - b.matchScore,
            render: (score) => (
                <div style={{ width: 120 }}>
                    <Progress
                        percent={score}
                        size='small'
                        status={score >= 80 ? 'success' : score >= 50 ? 'normal' : 'exception'}
                        showInfo={true}
                        format={(percent) => `${percent}%`}
                    />
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title='View Details'>
                        <Button
                            type='text'
                            icon={<EyeOutlined />}
                            onClick={() => navigate(RouteConfig.CVDetail.getPath(record.id))}
                        />
                    </Tooltip>
                    {record.status !== 'Rejected' && (
                        <Tooltip title='Shortlist Candidate'>
                            <Button
                                type='text'
                                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                onClick={() => handleAction('Shortlisted', record.name)}
                            />
                        </Tooltip>
                    )}
                    {record.status !== 'Rejected' ? (
                        <Tooltip title='Reject Candidate'>
                            <Button
                                type='text'
                                icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={() => handleAction('Rejected', record.name)}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title='Reconsider Candidate'>
                            <Button
                                type='text'
                                icon={<ReloadOutlined />}
                                onClick={() => handleAction('Reconsidered', record.name)}
                            />
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div
                style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        Screening: Frontend Developer Intern
                    </Title>
                    <Text type='secondary'>Manage and screen incoming applications for the Summer 2024 cohort.</Text>
                </div>
                <Space>
                    <Button>Edit Job</Button>
                    <Button type='primary' icon={<TeamOutlined />}>
                        Post New Job
                    </Button>
                </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type='secondary'>Total Applications</Text>
                            <TeamOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        </div>
                        <Title level={2} style={{ margin: '8px 0' }}>
                            {data.length}
                        </Title>
                        <Text type='success' style={{ fontSize: '12px' }}>
                            <RiseOutlined /> +12% from last week
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px', borderRight: '4px solid #fa8c16' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type='secondary'>Pending Review</Text>
                            <FilterOutlined style={{ fontSize: '20px', color: '#fa8c16' }} />
                        </div>
                        <Title level={2} style={{ margin: '8px 0' }}>
                            {data.filter((c) => c.status === 'Pending Review').length}
                        </Title>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            Needs immediate action
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px', borderRight: '4px solid #52c41a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type='secondary'>Shortlisted</Text>
                            <CheckCircleOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                        </div>
                        <Title level={2} style={{ margin: '8px 0' }}>
                            {data.filter((c) => c.status === 'Shortlisted').length}
                        </Title>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            Ready for interview
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type='secondary'>Rejected</Text>
                            <CloseCircleOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
                        </div>
                        <Title level={2} style={{ margin: '8px 0' }}>
                            {data.filter((c) => c.status === 'Rejected').length}
                        </Title>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            Archived applications
                        </Text>
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} style={{ borderRadius: '12px' }}>
                <div
                    style={{
                        marginBottom: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}
                >
                    <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder='Search candidates...'
                            style={{ width: 300 }}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Select
                            defaultValue='all'
                            style={{ width: 160 }}
                            onChange={handleStatusChange}
                            options={[
                                { value: 'all', label: 'All Statuses' },
                                { value: 'Pending Review', label: 'Pending Review' },
                                { value: 'CV Screened', label: 'CV Screened' },
                                { value: 'Shortlisted', label: 'Shortlisted' },
                                { value: 'Rejected', label: 'Rejected' }
                            ]}
                        />
                    </div>
                    <Space>
                        <Button icon={<SortAscendingOutlined />} title='Sort' />
                        <Button icon={<FilterOutlined />} title='Filter' />
                        <Button icon={<DownloadOutlined />}>Export CSV</Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                        total: filteredData.length,
                        showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} candidates`,
                        pageSize: 5
                    }}
                />
            </Card>
        </div>
    );
};
