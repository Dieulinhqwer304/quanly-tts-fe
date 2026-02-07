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
    Typography,
    message,
    Dropdown,
    MenuProps,
    Breadcrumb
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
    EyeOutlined,
    FilterOutlined,
    RiseOutlined,
    SearchOutlined,
    SortAscendingOutlined,
    TeamOutlined,
    MoreOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCandidates, useShortlistCandidate, useRejectCandidate } from '../../../hooks/Recruitment/useCandidates';
import { Candidate } from '../../../services/Recruitment/candidates';
import { CVDetailModal } from './components/CVDetailModal';

const { Title, Text } = Typography;

export const CVList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleView = (candidate: Candidate) => {
        setViewingCandidate(candidate);
        setIsDetailModalOpen(true);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const hasSelected = selectedRowKeys.length > 0;

    const { data: candidatesData, isLoading } = useCandidates({
        searcher: searchText ? { keyword: searchText, field: 'name' } : undefined,
        status: statusFilter
    });

    const shortlistMutation = useShortlistCandidate();
    const rejectMutation = useRejectCandidate();

    const handleShortlist = async (id: string, name: string) => {
        try {
            await shortlistMutation.mutateAsync({ id });
            message.success(`${t('candidate.shortlisted')} ${name}`);
        } catch {
            message.error(t('common.error'));
        }
    };

    const handleReject = async (id: string, name: string) => {
        try {
            await rejectMutation.mutateAsync({ id });
            message.success(`${t('candidate.rejected')} ${name}`);
        } catch {
            message.error(t('common.error'));
        }
    };

    const columns: ColumnsType<Candidate> = [
        {
            title: t('candidate.candidate_info'),
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => (
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => handleView(record)}
                >
                    {record.avatar?.includes('http') ? (
                        <Avatar src={record.avatar} size={40} />
                    ) : (
                        <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size={40}>
                            {record.name?.[0]}
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
            title: t('candidate.job_title'),
            dataIndex: 'appliedForTitle',
            key: 'job',
            render: (text: any) => <Text style={{ fontSize: '13px' }}>{text}</Text>
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
                if (status === 'Pending Review') {
                    color = 'warning';
                    translatedStatus = t('candidate.pending_review');
                }
                if (status === 'CV Screened') {
                    color = 'processing';
                    translatedStatus = t('candidate.cv_screened');
                }
                if (status === 'Shortlisted') {
                    color = 'success';
                    translatedStatus = t('candidate.shortlisted');
                }
                if (status === 'Rejected') {
                    color = 'error';
                    translatedStatus = t('candidate.rejected');
                }

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
                <div style={{ width: 100 }}>
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
            render: (_: any, record: any) => {
                const actionMenu: MenuProps = {
                    items: [
                        {
                            key: 'view',
                            label: t('common.view'),
                            icon: <EyeOutlined />,
                            onClick: () => handleView(record)
                        },
                        {
                            key: 'interview',
                            label: t('interview.schedule_title'),
                            icon: <CalendarOutlined />,
                            disabled: record.status !== 'Shortlisted',
                            onClick: () => navigate('/recruitment/interviews')
                        },
                        { type: 'divider' },
                        {
                            key: 'shortlist',
                            label: t('candidate.shortlist_candidate'),
                            icon: <CheckCircleOutlined />,
                            disabled: record.status === 'Shortlisted' || record.status === 'Rejected',
                            onClick: () => handleShortlist(record.id, record.name)
                        },
                        {
                            key: 'reject',
                            label: t('candidate.reject_candidate'),
                            icon: <CloseCircleOutlined />,
                            danger: true,
                            disabled: record.status === 'Rejected',
                            onClick: () => handleReject(record.id, record.name)
                        }
                    ]
                };

                return (
                    <Dropdown menu={actionMenu} trigger={['click']}>
                        <Button type='text' icon={<MoreOutlined />} />
                    </Dropdown>
                );
            }
        }
    ];

    const dataSource = candidatesData?.data?.hits || [];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[{ title: t('menu.recruitment_management') }, { title: t('candidate.screening') }]}
                />
            </div>

            <div
                style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        {t('candidate.screening')}
                    </Title>
                    <Text type='secondary'>{t('candidate.screening_desc')}</Text>
                </div>
                <Space>
                    <Button icon={<DownloadOutlined />}>{t('recruitment.export_csv')}</Button>
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
                            {dataSource.length}
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
                            {dataSource.filter((c) => c.status === 'Pending Review').length}
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
                            {dataSource.filter((c) => c.status === 'Shortlisted').length}
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
                            {dataSource.filter((c) => c.status === 'Rejected').length}
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
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            defaultValue='all'
                            style={{ width: 160 }}
                            onChange={setStatusFilter}
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
                {hasSelected && (
                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '12px 24px',
                            background: '#e6f7ff',
                            border: '1px solid #91d5ff',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Text strong>
                            {t('interview.selected')} {selectedRowKeys.length} {t('common.candidates')}
                        </Text>
                        <Space>
                            <Button
                                type='primary'
                                icon={<CheckCircleOutlined />}
                                onClick={() => {
                                    message.success('Batch shortlist successful');
                                    setSelectedRowKeys([]);
                                }}
                            >
                                {t('candidate.shortlist_candidate_btn')}
                            </Button>
                            <Button
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => {
                                    message.success('Batch reject successful');
                                    setSelectedRowKeys([]);
                                }}
                            >
                                {t('candidate.reject_candidate_btn')}
                            </Button>
                            <Button onClick={() => setSelectedRowKeys([])}>{t('common.cancel')}</Button>
                        </Space>
                    </div>
                )}
                <Table
                    rowSelection={rowSelection}
                    columns={columns as any}
                    dataSource={dataSource}
                    loading={isLoading}
                    pagination={{
                        total: candidatesData?.data?.pagination?.totalRows || 0,
                        showTotal: (total, range) =>
                            `${t('common.showing')} ${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.candidates')}`,
                        pageSize: 5
                    }}
                    rowKey='id'
                />
            </Card>

            <CVDetailModal
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                candidate={viewingCandidate}
            />
        </div>
    );
};
