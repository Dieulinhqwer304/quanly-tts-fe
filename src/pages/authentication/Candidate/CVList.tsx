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
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
    EyeOutlined,
    FilterOutlined,
    RiseOutlined,
    SearchOutlined,
    SortAscendingOutlined,
    TeamOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useTranslation } from 'react-i18next';
import { useCandidates, useShortlistCandidate, useRejectCandidate } from '../../../hooks/Recruitment/useCandidates';
import { Candidate } from '../../../services/Recruitment/candidates';
import { RecruitmentJobModal } from '../Recruitment/components/RecruitmentJobModal';

const { Title, Text } = Typography;

export const CVList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);

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
                    onClick={() => navigate(RouteConfig.CVDetail.getPath(record.id))}
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
                    {record.status !== 'Rejected' && record.status !== 'Shortlisted' && (
                        <Tooltip title={t('candidate.shortlist_candidate')}>
                            <Button
                                type='text'
                                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                onClick={() => handleShortlist(record.id, record.name)}
                                loading={shortlistMutation.isPending}
                            />
                        </Tooltip>
                    )}
                    {record.status !== 'Rejected' && (
                        <Tooltip title={t('candidate.reject_candidate')}>
                            <Button
                                type='text'
                                icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={() => handleReject(record.id, record.name)}
                                loading={rejectMutation.isPending}
                            />
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    const dataSource = candidatesData?.data?.hits || [];

    return (
        <div style={{ padding: '24px' }}>
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
                    <Button onClick={() => message.info(t('candidate.edit_job'))}>{t('candidate.edit_job')}</Button>
                    <Button type='primary' icon={<TeamOutlined />} onClick={() => setIsJobModalOpen(true)}>
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
                <Table
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

            <RecruitmentJobModal
                open={isJobModalOpen}
                onCancel={() => setIsJobModalOpen(false)}
                onSuccess={() => setIsJobModalOpen(false)}
            />
        </div>
    );
};
