import {
    AuditOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    FileTextOutlined,
    HistoryOutlined,
    InfoCircleOutlined,
    LineChartOutlined,
    MessageOutlined,
    SearchOutlined,
    UserOutlined,
    WarningOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Input,
    Layout,
    List,
    Progress,
    Row,
    Space,
    Tag,
    Typography,
    message,
    Modal,
    Spin,
    Empty
} from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { useApprovals, useUpdateApproval } from '../../../hooks/Recruitment/useApprovals';
import { Approval } from '../../../services/Recruitment/approvals';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useResponsive } from '../../../hooks/useResponsive';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

export const DirectorApprovals = () => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [directorNote, setDirectorNote] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected' | 'Adjusting'>('Pending');

    const {
        data: approvalsRes,
        isLoading,
        refetch
    } = useApprovals({
        searcher: { keyword: searchKeyword, field: 'name' },
        status: statusFilter
    });

    const updateApproval = useUpdateApproval();

    const queue = useMemo<Approval[]>(() => {
        return approvalsRes?.data || [];
    }, [approvalsRes?.data]);
    const selectedRequest =
        queue.find((r) => r.id === selectedRequestId) || (queue.length > 0 && !selectedRequestId ? queue[0] : null);

    useEffect(() => {
        if (queue.length > 0 && !selectedRequestId) {
            setSelectedRequestId(queue[0].id);
        }
    }, [queue, selectedRequestId]);

    const handleAction = async (action: 'approve' | 'reject' | 'adjust') => {
        if (!selectedRequest) return;

        const statusMap = {
            approve: 'Approved',
            reject: 'Rejected',
            adjust: 'Adjusting'
        } as const;

        const newStatus = statusMap[action];

        try {
            await updateApproval.mutate({
                id: selectedRequest.id,
                status: newStatus,
                notes: directorNote
            });
            message.success(`Request for ${selectedRequest.name} has been ${newStatus.toLowerCase()}`);
            setDirectorNote('');
            refetch();
            if (queue.length <= 1) {
                setSelectedRequestId(null);
            }
        } catch (err) {
            message.error('Failed to update request. Please try again.');
        }
    };

    const renderEmpty = () => (
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <Empty
                description={
                    statusFilter === 'Pending' ? t('director.no_pending_requests') : t('director.no_approved_requests')
                }
            />
        </div>
    );

    return (
        <Layout
            style={{ height: 'calc(100vh - 64px)', background: '#f6f7f8', flexDirection: isMobile ? 'column' : 'row' }}
        >
            <Sider
                width={isMobile ? '100%' : 400}
                theme='light'
                style={{
                    borderRight: isMobile ? 'none' : '1px solid #E2E8F0',
                    borderBottom: isMobile ? '1px solid #E2E8F0' : 'none',
                    overflowY: 'auto'
                }}
            >
                <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}
                    >
                        <Title level={5} style={{ margin: 0 }}>
                            {t('director.request_queue')}
                        </Title>
                        <Space wrap>
                            <Button
                                size='small'
                                type={statusFilter === 'Pending' ? 'primary' : 'text'}
                                onClick={() => setStatusFilter('Pending')}
                            >
                                {t('director.pending')}
                            </Button>
                            <Button
                                size='small'
                                type={statusFilter === 'Approved' ? 'primary' : 'text'}
                                onClick={() => setStatusFilter('Approved')}
                            >
                                {t('director.approved')}
                            </Button>
                            <Button
                                size='small'
                                type={statusFilter === 'Rejected' ? 'primary' : 'text'}
                                onClick={() => setStatusFilter('Rejected')}
                            >
                                {t('director.rejected')}
                            </Button>
                            <Button
                                size='small'
                                type={statusFilter === 'Adjusting' ? 'primary' : 'text'}
                                onClick={() => setStatusFilter('Adjusting')}
                            >
                                {t('director.adjusting')}
                            </Button>
                        </Space>
                    </div>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder={t('director.search_requests')}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>
                {isLoading ? (
                    <Spin
                        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                        tip={t('director.loading_queue')}
                    >
                        <div style={{ textAlign: 'center', padding: '100px 50px' }} />
                    </Spin>
                ) : (
                    <List
                        dataSource={queue}
                        locale={{ emptyText: renderEmpty() }}
                        renderItem={(item) => (
                            <div
                                style={{
                                    padding: '16px',
                                    borderBottom: '1px solid #E2E8F0',
                                    borderLeft:
                                        selectedRequestId === item.id ||
                                        (!selectedRequestId && queue[0]?.id === item.id)
                                            ? '4px solid #1E40AF'
                                            : '4px solid transparent',
                                    background:
                                        selectedRequestId === item.id ||
                                        (!selectedRequestId && queue[0]?.id === item.id)
                                            ? 'rgba(19, 109, 236, 0.05)'
                                            : '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onClick={() => setSelectedRequestId(item.id)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Tag color={item.type === 'Conversion' ? 'purple' : 'blue'}>{item.type}</Tag>
                                        <Text type='secondary' style={{ fontSize: '12px' }}>
                                            {dayjs(item.createdAt).fromNow()}
                                        </Text>
                                    </div>
                                    <Tag
                                        color={
                                            item.status === 'Pending'
                                                ? 'orange'
                                                : item.status === 'Approved'
                                                  ? 'success'
                                                  : 'error'
                                        }
                                    >
                                        {item.status}
                                    </Tag>
                                </div>
                                <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}
                                >
                                    <Avatar
                                        icon={item.type === 'Recruitment' ? <FileTextOutlined /> : <UserOutlined />}
                                        size={40}
                                        style={{ background: '#f0f2f4', color: '#64748B' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#111418' }}>{item.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748B' }}>{item.title}</div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '12px',
                                        color: '#64748B'
                                    }}
                                >
                                    {item.mentor ? (
                                        <span>
                                            <UserOutlined /> Mentor: {item.mentor}
                                        </span>
                                    ) : (
                                        <span>
                                            <UserOutlined /> HR: {item.hr || 'N/A'}
                                        </span>
                                    )}
                                    {item.score ? (
                                        <span style={{ color: '#10b981', fontWeight: 600 }}>Score: {item.score}/5</span>
                                    ) : (
                                        <span
                                            style={{
                                                color: item.priority === 'High' ? '#d97706' : '#64748B',
                                                fontWeight: 600
                                            }}
                                        >
                                            {item.priority === 'High' && <WarningOutlined />}{' '}
                                            {item.priority || 'Normal'} Priority
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                )}
            </Sider>

            <Content style={{ padding: 0, overflowY: 'auto', position: 'relative' }}>
                {selectedRequest ? (
                    <>
                        <div
                            style={{
                                padding: isMobile ? '12px' : isLaptop ? '18px 24px' : '24px 32px',
                                background: '#fff',
                                borderBottom: '1px solid #E2E8F0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: isMobile ? '10px' : 0
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#64748B',
                                        fontSize: '12px',
                                        marginBottom: '8px'
                                    }}
                                >
                                    <span>{t('director.requests')}</span>
                                </div>
                                <Title level={2} style={{ margin: '0 0 8px 0' }}>
                                    {selectedRequest.type} {t('director.proposal')}: {selectedRequest.name}
                                </Title>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        fontSize: '14px',
                                        color: '#64748B'
                                    }}
                                >
                                    <Tag bordered={false} style={{ background: '#f3f4f6' }}>
                                        {selectedRequest.department || 'General Dept'}
                                    </Tag>
                                    <span>|</span>
                                    <span>
                                        {t('director.submitted_on')}{' '}
                                        {dayjs(selectedRequest.createdAt).format('MMM DD, YYYY')}
                                    </span>
                                </div>
                            </div>
                            <Tag
                                color={
                                    selectedRequest.status === 'Pending'
                                        ? 'warning'
                                        : selectedRequest.status === 'Approved'
                                          ? 'success'
                                          : 'error'
                                }
                                style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '16px' }}
                            >
                                {selectedRequest.status === 'Pending'
                                    ? t('director.pending_review')
                                    : selectedRequest.status === 'Approved'
                                      ? t('director.approved_review')
                                      : t('director.rejected_review')}
                            </Tag>
                        </div>

                        <div
                            style={{
                                padding: isMobile ? '12px' : isLaptop ? '18px 24px' : '32px',
                                paddingBottom: selectedRequest.status === 'Pending' ? '150px' : '24px',
                                maxWidth: '1000px',
                                margin: '0 auto'
                            }}
                        >
                            <Row gutter={24}>
                                <Col xs={24} lg={16}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            marginBottom: '24px',
                                            borderRadius: '12px',
                                            border: '1px solid #E2E8F0'
                                        }}
                                    >
                                        <Title
                                            level={5}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '24px'
                                            }}
                                        >
                                            <AuditOutlined style={{ color: '#1E40AF' }} />{' '}
                                            {selectedRequest.type === 'Recruitment'
                                                ? t('director.proposal_summary') || 'Proposal Summary'
                                                : t('director.candidate_summary')}
                                        </Title>
                                        <div style={{ display: 'flex', gap: '24px' }}>
                                            <Avatar size={96} shape='square' icon={<UserOutlined />} />
                                            <Row gutter={[32, 16]} style={{ flex: 1 }}>
                                                <Col xs={24} md={12}>
                                                    <Text
                                                        type='secondary'
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {selectedRequest.type === 'Conversion'
                                                            ? t('director.current_role')
                                                            : t('director.role_name')}
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {selectedRequest.currentRole || selectedRequest.name}
                                                    </div>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Text
                                                        type='secondary'
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {selectedRequest.type === 'Conversion'
                                                            ? t('director.proposed_role')
                                                            : t('director.department')}
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {selectedRequest.proposedRole || selectedRequest.department}
                                                    </div>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Text
                                                        type='secondary'
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {selectedRequest.mentor
                                                            ? t('director.mentor')
                                                            : t('director.hr_owner')}
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {selectedRequest.mentor || selectedRequest.hr || 'N/A'}
                                                    </div>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Text
                                                        type='secondary'
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {t('director.submission_date')}
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {dayjs(selectedRequest.createdAt).format('MMM DD, YYYY')}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Recruitment Positions Detail */}
                            {selectedRequest.type === 'Recruitment' && (
                                <Card
                                    bordered={false}
                                    style={{
                                        marginBottom: '24px',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0'
                                    }}
                                >
                                    <Title
                                        level={5}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '24px'
                                        }}
                                    >
                                        <FileTextOutlined style={{ color: '#1E40AF' }} /> Recruitment Positions &
                                        Requirements
                                    </Title>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {selectedRequest.details?.positions ? (
                                            selectedRequest.details.positions.map((pos: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        padding: '16px',
                                                        background: '#F8FAFC',
                                                        borderRadius: '8px',
                                                        borderLeft:
                                                            idx % 2 === 0 ? '3px solid #1E40AF' : '3px solid #10B981'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            marginBottom: '12px'
                                                        }}
                                                    >
                                                        <Text strong style={{ fontSize: '15px' }}>
                                                            {pos.title}
                                                        </Text>
                                                        <Tag color={idx % 2 === 0 ? 'blue' : 'green'}>
                                                            {pos.count} {t('director.positions')}
                                                        </Tag>
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        <Text
                                                            type='secondary'
                                                            style={{
                                                                fontSize: '12px',
                                                                display: 'block',
                                                                marginBottom: '4px'
                                                            }}
                                                        >
                                                            {t('director.requirements')}:
                                                        </Text>
                                                        <Text style={{ fontSize: '13px' }}>{pos.requirements}</Text>
                                                    </div>
                                                    <Tag>{pos.level || 'Intern Level'}</Tag>
                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                style={{
                                                    padding: '16px',
                                                    background: '#F8FAFC',
                                                    borderRadius: '8px',
                                                    borderLeft: '3px solid #1E40AF'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '12px'
                                                    }}
                                                >
                                                    <Text strong style={{ fontSize: '15px' }}>
                                                        Frontend Developer Intern
                                                    </Text>
                                                    <Tag color='blue'>5 {t('director.positions')}</Tag>
                                                </div>
                                                <div style={{ marginBottom: '8px' }}>
                                                    <Text
                                                        type='secondary'
                                                        style={{
                                                            fontSize: '12px',
                                                            display: 'block',
                                                            marginBottom: '4px'
                                                        }}
                                                    >
                                                        {t('director.requirements')}:
                                                    </Text>
                                                    <Text style={{ fontSize: '13px' }}>
                                                        ReactJS, TypeScript, HTML/CSS, 6 months experience, team
                                                        collaboration skills
                                                    </Text>
                                                </div>
                                                <Tag>Intern Level</Tag>
                                            </div>
                                        )}
                                        <div style={{ padding: '12px', background: '#e6f7ff', borderRadius: '8px' }}>
                                            <Text strong>
                                                {t('director.total_positions')}:{' '}
                                                {selectedRequest.details?.totalPositions || 1}
                                            </Text>
                                            <Text type='secondary' style={{ marginLeft: '16px', fontSize: '12px' }}>
                                                {t('director.expected_start')}:{' '}
                                                {selectedRequest.details?.expectedStart ||
                                                    dayjs(selectedRequest.createdAt)
                                                        .add(1, 'month')
                                                        .format('MMM DD, YYYY')}
                                            </Text>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            <Row gutter={24}>
                                <Col xs={24} lg={12}>
                                    <Card
                                        bordered={false}
                                        style={{ borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}
                                    >
                                        <Title
                                            level={5}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '24px'
                                            }}
                                        >
                                            <DollarOutlined style={{ color: '#1E40AF' }} />{' '}
                                            {t('director.financial_impact')}
                                        </Title>
                                        <div
                                            style={{
                                                padding: '16px',
                                                background: '#F8FAFC',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    borderBottom: '1px solid #E2E8F0',
                                                    paddingBottom: '12px'
                                                }}
                                            >
                                                <Text type='secondary'>{t('director.allocated_budget')}</Text>
                                                <Text strong>${selectedRequest.budget?.toLocaleString() || '0'}</Text>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text type='secondary'>{t('director.proposed_salary')}</Text>
                                                <Text strong style={{ fontSize: '18px' }}>
                                                    ${selectedRequest.salary?.toLocaleString() || '0'}
                                                </Text>
                                            </div>
                                            {selectedRequest.salary &&
                                                selectedRequest.budget &&
                                                selectedRequest.salary > selectedRequest.budget && (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            background: '#fff7ed',
                                                            padding: '8px 12px',
                                                            borderRadius: '4px',
                                                            color: '#d97706',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        <WarningOutlined /> Exceeds budget by $
                                                        {(
                                                            selectedRequest.salary - selectedRequest.budget
                                                        ).toLocaleString()}{' '}
                                                        (
                                                        {Math.round(
                                                            ((selectedRequest.salary - selectedRequest.budget) /
                                                                selectedRequest.budget) *
                                                                100
                                                        )}
                                                        %)
                                                    </div>
                                                )}
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Card
                                        bordered={false}
                                        style={{ borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}
                                    >
                                        <Title
                                            level={5}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '24px'
                                            }}
                                        >
                                            <MessageOutlined style={{ color: '#1E40AF' }} />{' '}
                                            {t('director.stakeholder_justification')}
                                        </Title>
                                        <div
                                            style={{ position: 'relative', paddingLeft: '16px', marginBottom: '16px' }}
                                        >
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: -8,
                                                    fontSize: '32px',
                                                    color: '#E2E8F0',
                                                    fontFamily: 'serif'
                                                }}
                                            >
                                                "
                                            </span>
                                            <Paragraph
                                                style={{ fontStyle: 'italic', color: '#64748B', lineHeight: 1.6 }}
                                            >
                                                {selectedRequest.details?.justification ||
                                                    'The candidate has consistently exceeded expectations in their current role. Performance metrics indicate a high technical aptitude and strong team integration.'}
                                            </Paragraph>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Avatar size='small' icon={<UserOutlined />} />
                                            <Text strong style={{ fontSize: '12px' }}>
                                                {selectedRequest.mentor || selectedRequest.hr || 'Manager'}
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </div>

                        {selectedRequest.status === 'Pending' && (
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    background: '#fff',
                                    borderTop: '1px solid #E2E8F0',
                                    padding: isMobile ? '12px' : isLaptop ? '18px 24px' : '24px 32px',
                                    boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    zIndex: 10
                                }}
                            >
                                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Text strong>{t('director.directors_notes')}</Text>
                                        <Input.TextArea
                                            rows={2}
                                            placeholder={t('director.add_comment')}
                                            style={{ marginTop: '8px' }}
                                            value={directorNote}
                                            onChange={(e) => setDirectorNote(e.target.value)}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: isMobile ? 'flex-start' : 'center',
                                            flexDirection: isMobile ? 'column' : 'row',
                                            gap: isMobile ? '10px' : 0
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#64748B',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <InfoCircleOutlined /> {t('director.only_visible')}
                                        </div>
                                        <Space wrap>
                                            <Button
                                                danger
                                                icon={<CloseCircleOutlined />}
                                                loading={updateApproval.isLoading}
                                                onClick={() =>
                                                    Modal.confirm({
                                                        title: t('director.confirm_rejection'),
                                                        content: `${t('director.confirm_rejection_msg')} ${selectedRequest.name}?`,
                                                        onOk: () => handleAction('reject')
                                                    })
                                                }
                                            >
                                                {t('director.reject')}
                                            </Button>
                                            <Button
                                                icon={<HistoryOutlined />}
                                                loading={updateApproval.isLoading}
                                                onClick={() => handleAction('adjust')}
                                            >
                                                {t('director.request_adjustment')}
                                            </Button>
                                            <Button
                                                type='primary'
                                                icon={<CheckCircleOutlined />}
                                                style={{ background: '#1E40AF' }}
                                                loading={updateApproval.isLoading}
                                                onClick={() =>
                                                    Modal.confirm({
                                                        title: t('director.confirm_approval'),
                                                        content: `${t('director.confirm_approval_msg')} ${selectedRequest.name}?`,
                                                        onOk: () => handleAction('approve')
                                                    })
                                                }
                                            >
                                                {t('director.approve_request')}
                                            </Button>
                                        </Space>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#8c8c8c'
                        }}
                    >
                        <Empty description={t('director.select_request')} />
                    </div>
                )}
            </Content>
        </Layout>
    );
};
