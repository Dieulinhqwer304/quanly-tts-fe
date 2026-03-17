import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import {
    Avatar,
    Badge,
    Button,
    Card,
    Input,
    Tabs,
    Tag,
    Typography,
    Table,
    message,
    Dropdown,
    MenuProps,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    SearchOutlined,
    MoreOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
import { Candidate } from '../../../services/Recruitment/candidates';
import { CVDetailModal } from './components/CVDetailModal';
import { ConvertToInternModal } from './components/ConvertToInternModal';

const { Title, Text } = Typography;

interface StatusSummary {
    total: number;
    pending_review: number;
    cv_dat: number; // shortlisted + cv_screened (computed by BE)
    interview_scheduled: number;
    offer: number;
    rejected_cv: number;
    rejected_interview: number;
    [key: string]: number;
}

const TABS = [
    { key: 'all', labelKey: 'candidate.tab_all', summaryKey: 'total' },
    { key: 'pending_review', labelKey: 'candidate.tab_new_cv', summaryKey: 'pending_review' },
    { key: 'cv_dat', labelKey: 'candidate.tab_cv_dat', summaryKey: 'cv_dat' },
    { key: 'interview_scheduled', labelKey: 'candidate.tab_interview', summaryKey: 'interview_scheduled' },
    { key: 'offer', labelKey: 'candidate.tab_offer', summaryKey: 'offer' },
    { key: 'rejected_cv', labelKey: 'candidate.tab_reject_cv', summaryKey: 'rejected_cv' },
    { key: 'rejected_interview', labelKey: 'candidate.tab_reject_pv', summaryKey: 'rejected_interview' }
];

const STATUS_TAG: Record<string, { color: string; label: string }> = {
    pending_review: { color: 'warning', label: 'candidate.pending_review' },
    cv_screened: { color: 'processing', label: 'candidate.cv_screened' },
    shortlisted: { color: 'success', label: 'candidate.shortlisted' },
    interview_scheduled: { color: 'blue', label: 'candidate.interview_scheduled' },
    passed_interview: { color: 'green', label: 'candidate.passed_interview' },
    offer: { color: 'cyan', label: 'candidate.offer' },
    rejected: { color: 'error', label: 'candidate.rejected' },
    rejected_cv: { color: 'error', label: 'candidate.tab_reject_cv' },
    rejected_interview: { color: 'volcano', label: 'candidate.tab_reject_pv' },
    converted_to_intern: { color: 'purple', label: 'candidate.converted_to_intern' }
};

type AllowedActionStatus =
    | 'pending_review'
    | 'shortlisted'
    | 'interview_scheduled'
    | 'offer'
    | 'rejected_cv'
    | 'rejected_interview';

const STATUS_ACTIONS: AllowedActionStatus[] = [
    'pending_review',
    'shortlisted',
    'interview_scheduled',
    'offer',
    'rejected_cv',
    'rejected_interview'
];

const isStatusInTab = (tab: string, status: AllowedActionStatus) => {
    if (tab === 'all') return true;
    if (tab === 'cv_dat') return status === 'shortlisted';
    return tab === status;
};

const getTabForStatus = (status: AllowedActionStatus) => {
    if (status === 'shortlisted') return 'cv_dat';
    return status;
};

export const CVList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [candidatesData, setCandidatesData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [summary, setSummary] = useState<StatusSummary>({
        total: 0,
        pending_review: 0,
        cv_dat: 0,
        interview_scheduled: 0,
        offer: 0,
        rejected_cv: 0,
        rejected_interview: 0
    });
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const [convertingCandidate, setConvertingCandidate] = useState<Candidate | null>(null);

    const fetchSummary = async () => {
        try {
            const res = await http.get('/candidates/summary');
            setSummary(res as StatusSummary);
        } catch {
            // non-blocking
        }
    };

    const fetchCandidates = async () => {
        setIsLoading(true);
        try {
            const params: any = {};
            if (searchText.trim()) params.q = searchText.trim();
            if (activeTab !== 'all') {
                params.status = activeTab;
            }
            params.page = page;
            params.pageSize = pageSize;
            const res = await http.get('/candidates', { params });
            setCandidatesData(res);
        } catch (error) {
            message.error(t('common.error'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    useEffect(() => {
        fetchCandidates();
    }, [searchText, activeTab, page, pageSize]);

    const handleView = (candidate: Candidate) => {
        setViewingCandidate(candidate);
        setIsDetailModalOpen(true);
    };

    const handleChangeStatus = async (id: string, name: string, status: AllowedActionStatus) => {
        try {
            await http.patch(`/candidates/${id}`, { status });
            const statusLabel = STATUS_TAG[status]?.label ? t(STATUS_TAG[status].label) : status;
            message.success(`Đã chuyển trạng thái ${name} -> ${statusLabel}`);

            const nextTab = getTabForStatus(status);
            if (isStatusInTab(activeTab, status)) {
                fetchCandidates();
            } else {
                setActiveTab(nextTab);
                setPage(1);
            }
            fetchSummary();
        } catch {
            message.error(t('common.error'));
        }
    };

    const handleShortlist = async (id: string, name: string) => {
        await handleChangeStatus(id, name, 'shortlisted');
    };

    const handleReject = async (id: string, name: string) => {
        await handleChangeStatus(id, name, 'rejected_cv');
    };

    const handleBulkAction = async (status: 'shortlisted' | 'rejected_cv') => {
        if (selectedRowKeys.length === 0) return;

        try {
            await Promise.all(selectedRowKeys.map((id) => http.patch(`/candidates/${id}`, { status })));
            message.success(status === 'shortlisted' ? 'Đã shortlist các hồ sơ đã chọn.' : 'Đã từ chối các hồ sơ đã chọn.');
            setSelectedRowKeys([]);

            const nextTab = getTabForStatus(status);
            if (isStatusInTab(activeTab, status)) {
                fetchCandidates();
            } else {
                setActiveTab(nextTab);
                setPage(1);
            }
            fetchSummary();
        } catch {
            message.error(t('common.error'));
        }
    };

    const openConvertModal = (candidate: Candidate) => {
        setConvertingCandidate(candidate);
        setIsConvertModalOpen(true);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys)
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
            render: (status: string) => {
                const tag = STATUS_TAG[status];
                return (
                    <Tag color={tag?.color ?? 'default'} style={{ borderRadius: '10px' }}>
                        {tag ? t(tag.label) : status}
                    </Tag>
                );
            }
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
                        {
                            key: 'change-status',
                            label: 'Chuyển trạng thái',
                            children: STATUS_ACTIONS.map((status) => ({
                                key: `status-${status}`,
                                label: STATUS_TAG[status]?.label ? t(STATUS_TAG[status].label) : status,
                                disabled: record.status === status,
                                onClick: () => handleChangeStatus(record.id, record.fullName, status)
                            }))
                        },
                        {
                            key: 'convert-to-intern',
                            label: 'Chuyển thành thực tập sinh',
                            disabled: record.status !== 'offer',
                            onClick: () => openConvertModal(record as Candidate)
                        },
                        { type: 'divider' },
                        {
                            key: 'shortlist',
                            label: t('candidate.shortlist_candidate'),
                            icon: <CheckCircleOutlined />,
                            disabled: ['shortlisted', 'rejected', 'rejected_cv', 'rejected_interview'].includes(
                                record.status
                            ),
                            onClick: () => handleShortlist(record.id, record.fullName)
                        },
                        {
                            key: 'reject',
                            label: t('candidate.reject_candidate'),
                            icon: <CloseCircleOutlined />,
                            danger: true,
                            disabled: ['rejected', 'rejected_cv', 'rejected_interview'].includes(record.status),
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

    const tabItems = TABS.map((tab) => {
        const count = summary[tab.summaryKey] ?? 0;
        return {
            key: tab.key,
            label: (
                <span>
                    {t(tab.labelKey)}
                    {count > 0 && (
                        <Badge
                            count={count}
                            size='small'
                            style={{
                                marginLeft: 6,
                                backgroundColor: activeTab === tab.key ? '#1677ff' : '#d9d9d9',
                                color: activeTab === tab.key ? '#fff' : '#666'
                            }}
                        />
                    )}
                </span>
            )
        };
    });

    const dataSource = candidatesData?.hits || candidatesData?.data || [];

    return (
        <div style={{ padding: '24px' }}>
            <div
                style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        {t('candidate.screening')}
                    </Title>
                </div>
            </div>

            <Card bordered={false} style={{ borderRadius: '12px' }}>
                {/* Tabs */}
                <Tabs
                    activeKey={activeTab}
                    onChange={(value) => {
                        setActiveTab(value);
                        setPage(1);
                    }}
                    items={tabItems}
                    style={{ marginBottom: 0 }}
                />

                {/* Search bar */}
                <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder={t('candidate.search_placeholder')}
                        style={{ width: 300 }}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* Bulk action bar */}
                {selectedRowKeys.length > 0 && (
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
                        <span style={{ display: 'flex', gap: 8 }}>
                            <Button
                                type='primary'
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleBulkAction('shortlisted')}
                            >
                                {t('candidate.shortlist_candidate_btn')}
                            </Button>
                            <Button
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleBulkAction('rejected_cv')}
                            >
                                {t('candidate.reject_candidate_btn')}
                            </Button>
                            <Button onClick={() => setSelectedRowKeys([])}>{t('common.cancel')}</Button>
                        </span>
                    </div>
                )}

                <Table
                    rowSelection={rowSelection}
                    columns={columns as any}
                    scroll={{ x: 'max-content' }}
                    dataSource={dataSource}
                    loading={isLoading}
                    pagination={{
                        current: page,
                        pageSize,
                        total: candidatesData?.pagination?.totalRows || 0,
                        onChange: (nextPage, nextPageSize) => {
                            setPage(nextPage);
                            if (nextPageSize && nextPageSize !== pageSize) {
                                setPageSize(nextPageSize);
                            }
                        },
                        showTotal: (total, range) =>
                            `${t('common.showing')} ${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.candidates')}`,
                        showSizeChanger: true
                    }}
                    rowKey='id'
                />
            </Card>

            <CVDetailModal
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                candidate={viewingCandidate}
                onUpdated={() => {
                    fetchCandidates();
                    fetchSummary();
                }}
            />

            {convertingCandidate && (
                <ConvertToInternModal
                    open={isConvertModalOpen}
                    onCancel={() => {
                        setIsConvertModalOpen(false);
                        setConvertingCandidate(null);
                    }}
                    onSuccess={async () => {
                        setActiveTab('all');
                        setPage(1);
                        await fetchCandidates();
                        await fetchSummary();
                    }}
                    candidateId={convertingCandidate.id}
                    candidateName={convertingCandidate.fullName}
                />
            )}
        </div>
    );
};
