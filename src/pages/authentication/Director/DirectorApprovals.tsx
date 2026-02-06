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
import { useState, useEffect } from 'react';
import { useApprovals, useUpdateApproval } from '../../../hooks/Recruitment/useApprovals';
import dayjs from 'dayjs';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

export const DirectorApprovals = () => {
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [directorNote, setDirectorNote] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected' | 'Adjusting'>('Pending');

    const { data: approvalsRes, isLoading } = useApprovals({
        searcher: { keyword: searchKeyword, field: 'name' },
        status: statusFilter
    });

    const updateApproval = useUpdateApproval();

    const queue = approvalsRes?.data?.hits || [];
    const selectedRequest =
        queue.find((r) => r.id === selectedRequestId) || (queue.length > 0 && !selectedRequestId ? queue[0] : null);

    useEffect(() => {
        if (queue.length > 0 && !selectedRequestId) {
            setSelectedRequestId(queue[0].id);
        }
    }, [queue, selectedRequestId]);

    const handleAction = (action: 'approve' | 'reject' | 'adjust') => {
        if (!selectedRequest) return;

        const statusMap = {
            approve: 'Approved',
            reject: 'Rejected',
            adjust: 'Adjusting'
        } as const;

        const newStatus = statusMap[action];

        updateApproval.mutate(
            {
                id: selectedRequest.id,
                status: newStatus,
                notes: directorNote
            },
            {
                onSuccess: () => {
                    message.success(`Request for ${selectedRequest.name} has been ${newStatus.toLowerCase()}`);
                    setDirectorNote('');
                    // If the selected one is gone (due to filter), reset selection
                    if (queue.length <= 1) {
                        setSelectedRequestId(null);
                    }
                },
                onError: () => {
                    message.error('Failed to update request. Please try again.');
                }
            }
        );
    };

    const renderEmpty = () => (
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <Empty description={`No ${statusFilter.toLowerCase()} requests found.`} />
        </div>
    );

    return (
        <Layout style={{ height: 'calc(100vh - 64px)', background: '#f6f7f8' }}>
            <Sider width={400} theme='light' style={{ borderRight: '1px solid #e5e7eb', overflowY: 'auto' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}
                    >
                        <Title level={5} style={{ margin: 0 }}>
                            Request Queue
                        </Title>
                        <Space>
                            <Button
                                size='small'
                                type={statusFilter === 'Pending' ? 'primary' : 'text'}
                                onClick={() => setStatusFilter('Pending')}
                            >
                                Pending
                            </Button>
                            <Button
                                size='small'
                                type={statusFilter === 'Approved' ? 'primary' : 'text'}
                                onClick={() => setStatusFilter('Approved')}
                            >
                                History
                            </Button>
                        </Space>
                    </div>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder='Search requests...'
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip='Loading queue...' />
                    </div>
                ) : (
                    <List
                        dataSource={queue}
                        locale={{ emptyText: renderEmpty() }}
                        renderItem={(item) => (
                            <div
                                style={{
                                    padding: '16px',
                                    borderBottom: '1px solid #f0f0f0',
                                    borderLeft:
                                        selectedRequestId === item.id ||
                                        (!selectedRequestId && queue[0]?.id === item.id)
                                            ? '4px solid #136dec'
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
                                        style={{ background: '#f0f2f4', color: '#6b7280' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#111418' }}>{item.name}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.title}</div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '12px',
                                        color: '#6b7280'
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
                                                color: item.priority === 'High' ? '#d97706' : '#6b7280',
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
                                padding: '24px 32px',
                                background: '#fff',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#6b7280',
                                        fontSize: '12px',
                                        marginBottom: '8px'
                                    }}
                                >
                                    <span>Requests</span>
                                    <span style={{ fontSize: '10px' }}>▶</span>
                                    <span>#{selectedRequest.id}</span>
                                </div>
                                <Title level={2} style={{ margin: '0 0 8px 0' }}>
                                    {selectedRequest.type} Proposal: {selectedRequest.name}
                                </Title>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        fontSize: '14px',
                                        color: '#6b7280'
                                    }}
                                >
                                    <Tag bordered={false} style={{ background: '#f3f4f6' }}>
                                        {selectedRequest.department || 'General Dept'}
                                    </Tag>
                                    <span>|</span>
                                    <span>Submitted on {dayjs(selectedRequest.createdAt).format('MMM DD, YYYY')}</span>
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
                                {selectedRequest.status} Review
                            </Tag>
                        </div>

                        <div style={{ padding: '32px', paddingBottom: '150px', maxWidth: '1000px', margin: '0 auto' }}>
                            <Row gutter={24}>
                                <Col span={16}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            marginBottom: '24px',
                                            borderRadius: '12px',
                                            border: '1px solid #e5e7eb'
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
                                            <AuditOutlined style={{ color: '#136dec' }} /> Candidate Summary
                                        </Title>
                                        <div style={{ display: 'flex', gap: '24px' }}>
                                            <Avatar size={96} shape='square' icon={<UserOutlined />} />
                                            <Row gutter={[32, 16]} style={{ flex: 1 }}>
                                                <Col span={12}>
                                                    <Text
                                                        type='secondary'
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {selectedRequest.type === 'Conversion'
                                                            ? 'Current Role'
                                                            : 'Role Name'}
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {selectedRequest.currentRole || selectedRequest.name}
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <Text
                                                        type='secondary'
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {selectedRequest.type === 'Conversion'
                                                            ? 'Proposed Role'
                                                            : 'Department'}
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {selectedRequest.proposedRole || selectedRequest.department}
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <Text
                                                        type='secondary'
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {selectedRequest.mentor ? 'Mentor' : 'HR Owner'}
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {selectedRequest.mentor || selectedRequest.hr || 'N/A'}
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <Text
                                                        type='secondary'
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Submission Date
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {dayjs(selectedRequest.createdAt).format('MMM DD, YYYY')}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            marginBottom: '24px',
                                            borderRadius: '12px',
                                            border: '1px solid #e5e7eb'
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
                                            <LineChartOutlined style={{ color: '#136dec' }} /> Performance
                                        </Title>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                gap: '8px',
                                                marginBottom: '16px'
                                            }}
                                        >
                                            <span style={{ fontSize: '36px', fontWeight: 700 }}>
                                                {selectedRequest.score || 'N/A'}
                                            </span>
                                            {selectedRequest.score && (
                                                <Text type='secondary' style={{ marginBottom: '8px' }}>
                                                    / 5.0 Overall
                                                </Text>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        fontSize: '12px',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    <Text type='secondary'>Technical Skills</Text>
                                                    <Text strong>90%</Text>
                                                </div>
                                                <Progress
                                                    percent={90}
                                                    showInfo={false}
                                                    size='small'
                                                    strokeColor='#136dec'
                                                />
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        fontSize: '12px',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    <Text type='secondary'>Teamwork</Text>
                                                    <Text strong>85%</Text>
                                                </div>
                                                <Progress
                                                    percent={85}
                                                    showInfo={false}
                                                    size='small'
                                                    strokeColor='#136dec'
                                                />
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        fontSize: '12px',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    <Text type='secondary'>Project Delivery</Text>
                                                    <Text strong>95%</Text>
                                                </div>
                                                <Progress
                                                    percent={95}
                                                    showInfo={false}
                                                    size='small'
                                                    strokeColor='#10b981'
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={12}>
                                    <Card
                                        bordered={false}
                                        style={{ borderRadius: '12px', border: '1px solid #e5e7eb', height: '100%' }}
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
                                            <DollarOutlined style={{ color: '#136dec' }} /> Financial Impact
                                        </Title>
                                        <div
                                            style={{
                                                padding: '16px',
                                                background: '#f8f9fa',
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
                                                    borderBottom: '1px solid #e5e7eb',
                                                    paddingBottom: '12px'
                                                }}
                                            >
                                                <Text type='secondary'>Allocated Budget (FY23)</Text>
                                                <Text strong>${selectedRequest.budget?.toLocaleString() || '0'}</Text>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text type='secondary'>Proposed Salary</Text>
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
                                <Col span={12}>
                                    <Card
                                        bordered={false}
                                        style={{ borderRadius: '12px', border: '1px solid #e5e7eb', height: '100%' }}
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
                                            <MessageOutlined style={{ color: '#136dec' }} /> Stakeholder Justification
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
                                                    color: '#e5e7eb',
                                                    fontFamily: 'serif'
                                                }}
                                            >
                                                "
                                            </span>
                                            <Paragraph
                                                style={{ fontStyle: 'italic', color: '#4b5563', lineHeight: 1.6 }}
                                            >
                                                The candidate has consistently exceeded expectations in their current
                                                role. Performance metrics indicate a high technical aptitude and strong
                                                team integration. Justifies the proposed terms based on market standards
                                                and internal parity.
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
                                    borderTop: '1px solid #e5e7eb',
                                    padding: '24px 32px',
                                    boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    zIndex: 10
                                }}
                            >
                                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Text strong>Director's Notes (Optional)</Text>
                                        <Input.TextArea
                                            rows={2}
                                            placeholder='Add a comment regarding your decision...'
                                            style={{ marginTop: '8px' }}
                                            value={directorNote}
                                            onChange={(e) => setDirectorNote(e.target.value)}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#6b7280',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <InfoCircleOutlined /> Only visible to HR & Mentor
                                        </div>
                                        <Space>
                                            <Button
                                                danger
                                                icon={<CloseCircleOutlined />}
                                                loading={updateApproval.isPending}
                                                onClick={() =>
                                                    Modal.confirm({
                                                        title: 'Confirm Rejection',
                                                        content: `Are you sure you want to reject the proposal for ${selectedRequest.name}?`,
                                                        onOk: () => handleAction('reject')
                                                    })
                                                }
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                icon={<HistoryOutlined />}
                                                loading={updateApproval.isPending}
                                                onClick={() => handleAction('adjust')}
                                            >
                                                Request Adjustment
                                            </Button>
                                            <Button
                                                type='primary'
                                                icon={<CheckCircleOutlined />}
                                                style={{ background: '#136dec' }}
                                                loading={updateApproval.isPending}
                                                onClick={() =>
                                                    Modal.confirm({
                                                        title: 'Confirm Approval',
                                                        content: `Are you sure you want to approve the proposal for ${selectedRequest.name}?`,
                                                        onOk: () => handleAction('approve')
                                                    })
                                                }
                                            >
                                                Approve Request
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
                        <Empty description='Select a request to view details' />
                    </div>
                )}
            </Content>
        </Layout>
    );
};
