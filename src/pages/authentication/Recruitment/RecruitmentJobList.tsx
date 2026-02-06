import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FilterOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Input,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
    Dropdown,
    MenuProps,
    Breadcrumb
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useState } from 'react';

const { Title, Text } = Typography;

interface JobPosition {
    key: string;
    id: string;
    title: string;
    campaign: string;
    department: string;
    level: string;
    required: number;
    filled: number;
    status: 'Open' | 'Closed' | 'On Hold';
    postedDate: string;
}

const initialData: JobPosition[] = [
    {
        key: '1',
        id: 'JOB-001',
        title: 'Frontend Developer Intern',
        campaign: 'Summer 2024 Engineering',
        department: 'Engineering',
        level: 'Junior / Intern',
        required: 10,
        filled: 4,
        status: 'Open',
        postedDate: '2024-03-01'
    },
    {
        key: '2',
        id: 'JOB-002',
        title: 'Backend Node.js Intern',
        campaign: 'Summer 2024 Engineering',
        department: 'Engineering',
        level: 'Junior / Intern',
        required: 5,
        filled: 2,
        status: 'Open',
        postedDate: '2024-03-05'
    },
    {
        key: '3',
        id: 'JOB-003',
        title: 'UI/UX Design Trainee',
        campaign: 'Product Design Fellows',
        department: 'Design',
        level: 'Entry Level',
        required: 3,
        filled: 3,
        status: 'Closed',
        postedDate: '2024-02-15'
    },
    {
        key: '4',
        id: 'JOB-004',
        title: 'Data Analyst Intern',
        campaign: 'Data Science Cohort',
        department: 'Data',
        level: 'Junior / Intern',
        required: 4,
        filled: 1,
        status: 'Open',
        postedDate: '2024-03-10'
    },
    {
        key: '5',
        id: 'JOB-005',
        title: 'DevOps Intern',
        campaign: 'Summer 2024 Engineering',
        department: 'Engineering',
        level: 'Junior / Intern',
        required: 2,
        filled: 0,
        status: 'On Hold',
        postedDate: '2024-03-12'
    }
];

export const RecruitmentJobList = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All');

    const handleMenuClick = (key: string, record: JobPosition) => {
        if (key === 'view') {
            message.info(`Viewing ${record.title}`);
        } else if (key === 'edit') {
            message.info(`Editing ${record.title}`);
        } else if (key === 'delete') {
            message.warning(`Deleted ${record.title}`);
        }
    };

    const getActionMenu = (record: JobPosition): MenuProps => ({
        items: [
            { key: 'view', label: 'View Details', icon: <EyeOutlined /> },
            { key: 'edit', label: 'Edit', icon: <EditOutlined /> },
            { type: 'divider' },
            { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true }
        ],
        onClick: ({ key }) => handleMenuClick(key, record)
    });

    const columns: ColumnsType<JobPosition> = [
        {
            title: 'Job Position',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <Text strong style={{ display: 'block', color: '#136dec' }}>{text}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.id}</Text>
                </div>
            )
        },
        {
            title: 'Campaign',
            dataIndex: 'campaign',
            key: 'campaign',
            render: (text) => <Text style={{ fontSize: '13px' }}>{text}</Text>
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level'
        },
        {
            title: 'Fulfillment',
            key: 'fulfillment',
            render: (_, record) => (
                <div>
                    <Text strong>{record.filled}</Text> / <Text type="secondary">{record.required}</Text>
                    <div style={{ width: '100%', height: '4px', background: '#f0f0f0', marginTop: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${(record.filled / record.required) * 100}%`,
                            height: '100%',
                            background: record.filled >= record.required ? '#52c41a' : '#1890ff'
                        }} />
                    </div>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'Open') color = 'success';
                if (status === 'On Hold') color = 'warning';
                if (status === 'Closed') color = 'error';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Posted',
            dataIndex: 'postedDate',
            key: 'postedDate',
            render: (text) => <Text type="secondary" style={{ fontSize: '12px' }}>{text}</Text>
        },
        {
            title: 'Actions',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <Dropdown menu={getActionMenu(record)} trigger={['click']}>
                    <Button type="text" icon={<EditOutlined />} />
                </Dropdown>
            )
        }
    ];

    const filteredData = initialData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.campaign.toLowerCase().includes(searchText.toLowerCase());
        const matchesDep = departmentFilter === 'All' || item.department === departmentFilter;
        return matchesSearch && matchesDep;
    });

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[
                        { title: 'Recruitment' },
                        { title: 'Job Management' },
                    ]}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <Title level={3} style={{ margin: 0 }}>Job Management</Title>
                    <Text type="secondary">Manage all open positions across your recruitment campaigns.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate(RouteConfig.RecruitmentPlanCreate.path)}
                >
                    Create Job Post
                </Button>
            </div>

            <Card bordered={false} style={{ borderRadius: '12px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <Space size="middle">
                        <Input
                            placeholder="Search by job or campaign..."
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            defaultValue="All"
                            style={{ width: 160 }}
                            onChange={setDepartmentFilter}
                            options={[
                                { value: 'All', label: 'All Departments' },
                                { value: 'Engineering', label: 'Engineering' },
                                { value: 'Marketing', label: 'Marketing' },
                                { value: 'Design', label: 'Design' },
                                { value: 'Data', label: 'Data Science' }
                            ]}
                        />
                        <Button icon={<FilterOutlined />}>More Filters</Button>
                    </Space>
                    <Space>
                        <Text type="secondary">{filteredData.length} Jobs found</Text>
                    </Space>
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
