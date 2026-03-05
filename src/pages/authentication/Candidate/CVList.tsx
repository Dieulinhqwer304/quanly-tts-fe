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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
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

    const [candidatesData, setCandidatesData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCandidates = async () => {
        setIsLoading(true);
        try {
            const params: any = {};
            if (searchText) {
                params.searcher = JSON.stringify({ keyword: searchText, field: 'fullName' });
            }
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            const res = await http.get('/candidates', { params });
            setCandidatesData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, [searchText, statusFilter]);

    const handleShortlist = async (id: string, name: string) => {
        try {
            await http.patch(`/candidates/${id}/status`, { status: 'shortlisted' });
            message.success(`${t('candidate.shortlisted')} ${name}`);
            fetchCandidates();
        } catch {
            message.error(t('common.error'));
        }
    };

    const handleReject = async (id: string, name: string) => {
        try {
            await http.patch(`/candidates/${id}/status`, { status: 'rejected' });
            message.success(`${t('candidate.rejected')} ${name}`);
            fetchCandidates();
        } catch {
            message.error(t('common.error'));
        }
    };

    const columns: ColumnsType<Candidate> = [
        {
            title: t('candidate.candidate_info'),
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text: any, record: any) => (
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => handleView(record)}
                >
                    {record.avatarUrl?.includes('http') ? (
                        <Avatar src={record.avatarUrl} size={40} />
                    ) : (
                        <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size={40}>
                            {record.fullName?.[0]}
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
            dataIndex: 'job',
            key: 'job',
            render: (job: any) => <Text style={{ fontSize: '13px' }}>{job?.title}</Text>
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
                if (status === 'pending_review') {
                    color = 'warning';
                    translatedStatus = t('candidate.pending_review');
                } else if (status === 'cv_screened') {
                    color = 'processing';
                    translatedStatus = t('candidate.cv_screened');
                } else if (status === 'shortlisted') {
                    color = 'success';
                    translatedStatus = t('candidate.shortlisted');
                } else if (status === 'rejected') {
                    color = 'error';
                    translatedStatus = t('candidate.rejected');
                } else if (status === 'interview_scheduled') {
                    color = 'blue';
                    translatedStatus = t('candidate.interview_scheduled');
                } else if (status === 'passed_interview') {
                    color = 'green';
                    translatedStatus = t('candidate.passed_interview');
                } else if (status === 'converted_to_intern') {
                    color = 'purple';
                    translatedStatus = t('candidate.converted_to_intern');
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
            width: 80,
            fixed: 'right',
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
                            disabled: record.status !== 'shortlisted',
                            onClick: () => navigate('/recruitment/interviews')
                        },
                        { type: 'divider' },
                        {
                            key: 'shortlist',
                            label: t('candidate.shortlist_candidate'),
                            icon: <CheckCircleOutlined />,
                            disabled: record.status === 'shortlisted' || record.status === 'rejected',
                            onClick: () => handleShortlist(record.id, record.fullName)
                        },
                        {
                            key: 'reject',
                            label: t('candidate.reject_candidate'),
                            icon: <CloseCircleOutlined />,
                            danger: true,
                            disabled: record.status === 'rejected',
                            onClick: () => handleReject(record.id, record.fullName)
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

    const dataSource = candidatesData?.data || [];

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
            </div>

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
                                { value: 'pending_review', label: t('candidate.pending_review') },
                                { value: 'cv_screened', label: t('candidate.cv_screened') },
                                { value: 'shortlisted', label: t('candidate.shortlisted') },
                                { value: 'rejected', label: t('candidate.rejected') }
                            ]}
                        />
                    </div>
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
                                    message.success('Chọn lọc hàng loạt thành công');
                                    setSelectedRowKeys([]);
                                }}
                            >
                                {t('candidate.shortlist_candidate_btn')}
                            </Button>
                            <Button
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => {
                                    message.success('Loại hàng loạt thành công');
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
                    scroll={{ x: 'max-content' }}
                    dataSource={dataSource}
                    loading={isLoading}
                    pagination={{
                        total: candidatesData?.pagination?.totalRows || 0,
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
