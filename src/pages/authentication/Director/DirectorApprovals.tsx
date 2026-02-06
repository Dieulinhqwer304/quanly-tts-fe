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
    WarningOutlined
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
    Rate,
    Row,
    Space,
    Tag,
    Typography,
    message,
    Modal
} from 'antd';
import { useState } from 'react';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const initialQueue = [
    {
        id: 1,
        type: 'Conversion',
        time: 'Today, 10:30 AM',
        name: 'Alex Doe',
        title: 'Intern to Junior Analyst Proposal',
        mentor: 'Mike Ross',
        score: 4.8,
        avatar: 'https://i.pravatar.cc/150?u=1'
    },
    {
        id: 2,
        type: 'Recruitment',
        time: 'Yesterday',
        name: 'Sr. Java Developer',
        title: 'New Position • Backend Team',
        hr: 'Sarah Jenkins',
        priority: 'High',
        avatar: null
    },
    {
        id: 3,
        type: 'Recruitment',
        time: '2 days ago',
        name: 'UX Researcher Intern',
        title: 'Summer cohort replacement',
        hr: 'Tom Hiddleston',
        priority: 'Normal',
        avatar: null
    }
];

export const DirectorApprovals = () => {
    const [selectedRequest, setSelectedRequest] = useState<number | null>(1);
    const [queue, setQueue] = useState(initialQueue);
    const [directorNote, setDirectorNote] = useState('');

    const handleAction = (action: 'approve' | 'reject' | 'adjust') => {
        if (!selectedRequest) return;

        const request = queue.find((r) => r.id === selectedRequest);

        if (action === 'approve') {
            message.success(`Approved request for ${request?.name}`);
        } else if (action === 'reject') {
            message.error(`Rejected request for ${request?.name}`);
        } else {
            message.info(`Requested adjustment for ${request?.name}`);
        }

        const newQueue = queue.filter((r) => r.id !== selectedRequest);
        setQueue(newQueue);
        if (newQueue.length > 0) {
            setSelectedRequest(newQueue[0].id);
        } else {
            setSelectedRequest(null);
        }
        setDirectorNote('');
    };

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
                                type='text'
                                style={{ background: '#f0f2f4' }}
                                onClick={() => message.info('Filter: Pending')}
                            >
                                Pending
                            </Button>
                            <Button size='small' type='text' onClick={() => message.info('Filter: History')}>
                                History
                            </Button>
                        </Space>
                    </div>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder='Search requests...'
                        onChange={(e) => console.log(e.target.value)}
                    />
                </div>
                <List
                    dataSource={queue}
                    renderItem={(item) => (
                        <div
                            style={{
                                padding: '16px',
                                borderBottom: '1px solid #f0f0f0',
                                borderLeft: selectedRequest === item.id ? '4px solid #136dec' : '4px solid transparent',
                                background: selectedRequest === item.id ? 'rgba(19, 109, 236, 0.05)' : '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onClick={() => setSelectedRequest(item.id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag color={item.type === 'Conversion' ? 'purple' : 'blue'}>{item.type}</Tag>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        {item.time}
                                    </Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                {item.avatar ? (
                                    <Avatar src={item.avatar} size={40} />
                                ) : (
                                    <Avatar
                                        icon={item.type === 'Recruitment' ? <FileTextOutlined /> : <UserOutlined />}
                                        size={40}
                                        style={{ background: '#f0f2f4', color: '#6b7280' }}
                                    />
                                )}
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
                                        <UserOutlined /> HR: {item.hr}
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
                                        {item.priority === 'High' && <WarningOutlined />} {item.priority} Priority
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                />
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
                                    <span>#REQ-2023-8492</span>
                                </div>
                                <Title level={2} style={{ margin: '0 0 8px 0' }}>
                                    Intern Conversion Proposal: Alex Doe
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
                                        Engineering Dept
                                    </Tag>
                                    <span>|</span>
                                    <span>Submitted on Oct 24, 2023</span>
                                </div>
                            </div>
                            <Tag
                                color='warning'
                                style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '16px' }}
                            >
                                Pending Review
                            </Tag>
                        </div>

                        <div style={{ padding: '32px', paddingBottom: '120px', maxWidth: '1000px', margin: '0 auto' }}>
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
                                            <Avatar size={96} shape='square' src='https://i.pravatar.cc/150?u=1' />
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
                                                        Current Role
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>Software Engineering Intern</div>
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
                                                        Proposed Role
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>Junior Analyst</div>
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
                                                        Mentor
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>Mike Ross</div>
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
                                                        Start Date
                                                    </Text>
                                                    <div style={{ fontWeight: 500 }}>Nov 15, 2023</div>
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
                                            <span style={{ fontSize: '36px', fontWeight: 700 }}>4.8</span>
                                            <Text type='secondary' style={{ marginBottom: '8px' }}>
                                                / 5.0 Overall
                                            </Text>
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
                                                <Text strong>$60,000</Text>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text type='secondary'>Proposed Salary</Text>
                                                <Text strong style={{ fontSize: '18px' }}>
                                                    $65,000
                                                </Text>
                                            </div>
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
                                                <WarningOutlined /> Exceeds budget by $5,000 (8.3%)
                                            </div>
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
                                            <MessageOutlined style={{ color: '#136dec' }} /> Mentor's Justification
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
                                                Alex has consistently exceeded expectations in the Q3 migration project.
                                                He not only handled his assigned tickets but also proactively fixed
                                                legacy bugs in the payment gateway. His technical aptitude matches that
                                                of a Junior II level, justifying the slightly higher starting salary.
                                                Losing him would be a setback for the team velocity.
                                            </Paragraph>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Avatar size='small' src='https://i.pravatar.cc/150?u=10' />
                                            <Text strong style={{ fontSize: '12px' }}>
                                                Mike Ross, Senior Lead
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                            <Card
                                bordered={false}
                                style={{ marginTop: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}
                            >
                                <Title level={5} style={{ marginBottom: '16px' }}>
                                    Detailed Evaluation
                                </Title>
                                <List
                                    itemLayout='horizontal'
                                    dataSource={[
                                        {
                                            criteria: 'Code Quality',
                                            rating: 5,
                                            notes: 'Clean, well-documented, follows patterns.'
                                        },
                                        {
                                            criteria: 'Communication',
                                            rating: 4,
                                            notes: 'Good proactive updates, needs confidence in presentations.'
                                        }
                                    ]}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Row style={{ width: '100%' }} align='middle'>
                                                <Col span={6}>
                                                    <Text strong>{item.criteria}</Text>
                                                </Col>
                                                <Col span={6}>
                                                    <Rate
                                                        disabled
                                                        defaultValue={item.rating}
                                                        style={{ fontSize: '14px', color: '#fbbf24' }}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Text type='secondary'>{item.notes}</Text>
                                                </Col>
                                            </Row>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                background: '#fff',
                                borderTop: '1px solid #e5e7eb',
                                padding: '24px 32px',
                                boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)'
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                            onClick={() => handleAction('reject')}
                                        >
                                            Reject
                                        </Button>
                                        <Button icon={<HistoryOutlined />} onClick={() => handleAction('adjust')}>
                                            Request Adjustment
                                        </Button>
                                        <Button
                                            type='primary'
                                            icon={<CheckCircleOutlined />}
                                            style={{ background: '#136dec' }}
                                            onClick={() => handleAction('approve')}
                                        >
                                            Approve Request
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                        </div>
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
                        Select a request to view details
                    </div>
                )}
            </Content>
        </Layout>
    );
};
