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
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
        message.success(`${t('common.success')}: ${action} ${name}`);
    };

    const columns: ColumnsType<Candidate> = [
        {
            title: t('candidate.candidate_info'),
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => (
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
            title: t('candidate.applied_date'),
            dataIndex: 'appliedDate',
            key: 'appliedDate',
            render: (text: any, record: any) => (
                <div>
                    <Text style={{ display: 'block' }}>{text}</Text>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                        {record.timeAgo}
                    </Text>
                </div>
            )
        },
        {
            title: t('common.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status: any) => {
                let color = 'default';
                let translatedStatus = status;
                if (status === 'Pending Review') { color = 'warning'; translatedStatus = t('candidate.pending_review'); }
                if (status === 'CV Screened') { color = 'processing'; translatedStatus = t('candidate.cv_screened'); }
                if (status === 'Shortlisted') { color = 'success'; translatedStatus = t('candidate.shortlisted'); }
                if (status === 'Rejected') { color = 'error'; translatedStatus = t('candidate.rejected'); }

                return (
                    <Tag color={color} style={{ borderRadius: '10px' }}>
                        {translatedStatus}
                    </Tag>
                );
            }
        },
        {
            title: t('candidate.match_score'),
            dataIndex: 'matchScore',
            key: 'matchScore',
            sorter: (a, b) => a.matchScore - b.matchScore,
            render: (score: any) => (
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
            title: t('common.actions'),
            key: 'action',
            align: 'right',
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title={t('common.view')}>
                        <Button
                            type='text'
                            icon={<EyeOutlined />}
                            onClick={() => navigate(RouteConfig.CVDetail.getPath(record.id))}
                        />
                    </Tooltip>
                    {record.status !== 'Rejected' && (
                        <Tooltip title={t('candidate.shortlist_candidate')}>
                            <Button
                                type='text'
                                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                onClick={() => handleAction(t('candidate.shortlisted'), record.name)}
                            />
                        </Tooltip>
                    )}
                    {record.status !== 'Rejected' ? (
                        <Tooltip title={t('candidate.reject_candidate')}>
                            <Button
                                type='text'
                                icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={() => handleAction(t('candidate.rejected'), record.name)}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title={t('candidate.reconsider_candidate')}>
                            <Button
                                type='text'
                                icon={<ReloadOutlined />}
                                onClick={() => handleAction(t('candidate.reconsider_candidate'), record.name)}
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
                        {t('candidate.screening')}: Frontend Developer Intern
                    </Title>
                    <Text type='secondary'>{t('candidate.screening_desc')}</Text>
                </div>
                <Space>
                    <Button>{t('candidate.edit_job')}</Button>
                    <Button type='primary' icon={<TeamOutlined />}>
                        {t('candidate.post_new_job')}
                    </Button>
                </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type='secondary'>{t('candidate.total_applications')}</Text>
                            <TeamOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        </div>
                        <Title level={2} style={{ margin: '8px 0' }}>
                            {data.length}
                        </Title>
                        <Text type='success' style={{ fontSize: '12px' }}>
                            <RiseOutlined /> +12% {t('common.last_week')}
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px', borderRight: '4px solid #fa8c16' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type='secondary'>{t('candidate.pending_review')}</Text>
                            <FilterOutlined style={{ fontSize: '20px', color: '#fa8c16' }} />
                        </div>
                        <Title level={2} style={{ margin: '8px 0' }}>
                            {data.filter((c) => c.status === 'Pending Review').length}
                        </Title>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            {t('candidate.needs_immediate_action')}
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px', borderRight: '4px solid #52c41a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type='secondary'>{t('candidate.shortlisted')}</Text>
                            <CheckCircleOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                        </div>
                        <Title level={2} style={{ margin: '8px 0' }}>
                            {data.filter((c) => c.status === 'Shortlisted').length}
                        </Title>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            {t('candidate.ready_for_interview')}
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type='secondary'>{t('candidate.rejected')}</Text>
                            <CloseCircleOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
                        </div>
                        <Title level={2} style={{ margin: '8px 0' }}>
                            {data.filter((c) => c.status === 'Rejected').length}
                        </Title>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            {t('candidate.archived_applications')}
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
                            placeholder={t('candidate.search_placeholder')}
                            style={{ width: 300 }}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Select
                            defaultValue='all'
                            style={{ width: 160 }}
                            onChange={handleStatusChange}
                            options={[
                                { value: 'all', label: t('common.all') },
                                { value: 'Pending Review', label: t('candidate.pending_review') },
                                { value: 'CV Screened', label: t('candidate.cv_screened') },
                                { value: 'Shortlisted', label: t('candidate.shortlisted') },
                                { value: 'Rejected', label: t('candidate.rejected') }
                            ]}
                        />
                    </div>
                    <Space>
                        <Button icon={<SortAscendingOutlined />} title='Sort' />
                        <Button icon={<FilterOutlined />} title={t('common.filter')} />
                        <Button icon={<DownloadOutlined />}>{t('recruitment.export_csv')}</Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                        total: filteredData.length,
                        showTotal: (total, range) => `${t('common.showing')} ${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.candidates')}`,
                        pageSize: 5
                    }}
                />
            </Card>
        </div>
    );
};
