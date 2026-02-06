import {
    CalendarOutlined,
    ClockCircleOutlined,
    CopyOutlined,
    EditOutlined,
    FilterOutlined,
    MailOutlined,
    SearchOutlined,
    SendOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Input,
    Layout,
    List,
    Row,
    Select,
    Space,
    Tag,
    TimePicker,
    Typography,
    message
} from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Content } = Layout;

const candidates = [
    { id: 1, name: 'Alice Smith', role: 'UX Intern', score: 92, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Bob Jones', role: 'Frontend Dev', score: 88, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Charlie Day', role: 'Product Mgmt', score: 85, avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'Dana Lee', role: 'Marketing', score: 82, avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, name: 'Evan Wright', role: 'Sales', score: 80, avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: 6, name: 'Fiona Green', role: 'DevOps', score: 79, avatar: 'https://i.pravatar.cc/150?u=6' }
];

export const InterviewSchedule = () => {
    const [selectedCandidates, setSelectedCandidates] = useState<number[]>([1, 2, 3]);

    const toggleCandidate = (id: number) => {
        setSelectedCandidates((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f6f7f8' }}>
            <Content style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <Text type='secondary'>Recruitment / Candidates / </Text>
                    <Text strong>Scheduling</Text>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '32px'
                    }}
                >
                    <div>
                        <Title level={2} style={{ margin: 0 }}>
                            Schedule Interviews
                        </Title>
                        <Text type='secondary'>Select candidates and configure interview invites.</Text>
                    </div>
                    <Button icon={<FilterOutlined />}>Filter</Button>
                </div>

                <Row gutter={24}>
                    <Col xs={24} lg={8}>
                        <Card
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Candidates Queue</span>
                                    <Tag color='blue'>{selectedCandidates.length} Selected</Tag>
                                </div>
                            }
                            style={{ height: '100%', borderRadius: '12px' }}
                            bodyStyle={{ padding: 0, height: '600px', overflowY: 'auto' }}
                        >
                            <div style={{ padding: '12px', background: '#f8f9fa', borderBottom: '1px solid #f0f0f0' }}>
                                <Input prefix={<SearchOutlined />} placeholder='Search candidates...' />
                            </div>
                            <List
                                dataSource={candidates}
                                renderItem={(item) => (
                                    <List.Item
                                        style={{
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            background: selectedCandidates.includes(item.id) ? '#e6f7ff' : 'transparent'
                                        }}
                                        onClick={() => toggleCandidate(item.id)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Checkbox
                                                checked={selectedCandidates.includes(item.id)}
                                                style={{ marginRight: '12px' }}
                                            />
                                            <Avatar src={item.avatar} style={{ marginRight: '12px' }} />
                                            <div style={{ flex: 1 }}>
                                                <Text strong style={{ display: 'block' }}>
                                                    {item.name}
                                                </Text>
                                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                                    {item.role}
                                                </Text>
                                            </div>
                                            <Tag
                                                color={
                                                    item.score >= 90
                                                        ? 'success'
                                                        : item.score >= 80
                                                          ? 'processing'
                                                          : 'warning'
                                                }
                                            >
                                                {item.score}
                                            </Tag>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Card style={{ borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Configure & Send
                                    </Title>
                                    <Text type='secondary'>Setup details for the selected candidates.</Text>
                                </div>
                                <Space>
                                    <Button>Reject</Button>
                                    <Button type='primary'>Invite</Button>
                                </Space>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <Title
                                    level={5}
                                    style={{
                                        textTransform: 'uppercase',
                                        fontSize: '12px',
                                        letterSpacing: '1px',
                                        color: '#136dec',
                                        marginBottom: '16px'
                                    }}
                                >
                                    <CalendarOutlined style={{ marginRight: '8px' }} /> Interview Details
                                </Title>
                                <Row gutter={16} style={{ marginBottom: '16px' }}>
                                    <Col span={12}>
                                        <Text strong>Date</Text>
                                        <DatePicker style={{ width: '100%', marginTop: '8px' }} />
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>Time Slot</Text>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginTop: '8px'
                                            }}
                                        >
                                            <TimePicker style={{ flex: 1 }} format='HH:mm' />
                                            <span>-</span>
                                            <TimePicker style={{ flex: 1 }} format='HH:mm' />
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Text strong>Format</Text>
                                        <div
                                            style={{
                                                marginTop: '8px',
                                                display: 'flex',
                                                background: '#f0f2f4',
                                                padding: '4px',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            <Button
                                                type='text'
                                                style={{
                                                    flex: 1,
                                                    background: '#fff',
                                                    borderRadius: '4px',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                Online
                                            </Button>
                                            <Button type='text' style={{ flex: 1 }}>
                                                In-Person
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col span={16}>
                                        <Text strong>Meeting Link / Location</Text>
                                        <Input
                                            prefix={<VideoCameraOutlined style={{ color: '#bfbfbf' }} />}
                                            suffix={<Button icon={<CopyOutlined />} type='text' size='small' />}
                                            defaultValue='https://meet.google.com/abc-defg-hij'
                                            style={{ marginTop: '8px' }}
                                        />
                                    </Col>
                                </Row>
                            </div>

                            <Divider />

                            <div style={{ marginBottom: '32px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px'
                                    }}
                                >
                                    <Title
                                        level={5}
                                        style={{
                                            textTransform: 'uppercase',
                                            fontSize: '12px',
                                            letterSpacing: '1px',
                                            color: '#136dec',
                                            margin: 0
                                        }}
                                    >
                                        <MailOutlined style={{ marginRight: '8px' }} /> Email Communication
                                    </Title>
                                    <Button type='link' size='small'>
                                        Manage Templates
                                    </Button>
                                </div>

                                <Row gutter={16} style={{ marginBottom: '16px' }}>
                                    <Col span={8}>
                                        <Text strong>Template</Text>
                                        <Select
                                            defaultValue='Standard Interview Invite'
                                            style={{ width: '100%', marginTop: '8px' }}
                                        >
                                            <Select.Option value='Standard Interview Invite'>
                                                Standard Interview Invite
                                            </Select.Option>
                                            <Select.Option value='Technical Round Invite'>
                                                Technical Round Invite
                                            </Select.Option>
                                            <Select.Option value='Rejection Email'>Rejection Email</Select.Option>
                                        </Select>
                                    </Col>
                                    <Col span={16}>
                                        <Text strong>Subject Line</Text>
                                        <Input
                                            defaultValue='Invitation to Interview at InternOS - {Role}'
                                            style={{ marginTop: '8px' }}
                                        />
                                    </Col>
                                </Row>

                                <div
                                    style={{
                                        background: '#f8f9fa',
                                        border: '1px solid #dbe0e6',
                                        borderRadius: '8px',
                                        padding: '20px'
                                    }}
                                >
                                    <div
                                        style={{
                                            borderBottom: '1px solid #dbe0e6',
                                            paddingBottom: '12px',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            gap: '8px'
                                        }}
                                    >
                                        <Text
                                            type='secondary'
                                            style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}
                                        >
                                            Preview
                                        </Text>
                                        <Text type='secondary' style={{ fontSize: '12px' }}>
                                            •
                                        </Text>
                                        <Text type='secondary' style={{ fontSize: '12px' }}>
                                            HTML Format
                                        </Text>
                                    </div>
                                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                                        <p>
                                            Dear <Tag color='blue'>{`{Candidate_Name}`}</Tag>,
                                        </p>
                                        <p>
                                            We reviewed your application for the <Tag color='blue'>{`{Role}`}</Tag>{' '}
                                            position and were impressed by your background. We would like to invite you
                                            to an interview to discuss your experience and how you can contribute to the
                                            InternOS team.
                                        </p>

                                        <div
                                            style={{
                                                background: '#fff',
                                                padding: '16px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                margin: '16px 0',
                                                display: 'inline-block'
                                            }}
                                        >
                                            <div style={{ marginBottom: '8px' }}>
                                                <CalendarOutlined style={{ color: '#136dec', marginRight: '8px' }} />{' '}
                                                <Text strong>
                                                    <Tag color='blue'>{`{Date}`}</Tag>
                                                </Text>
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                <ClockCircleOutlined style={{ color: '#136dec', marginRight: '8px' }} />{' '}
                                                <Text strong>
                                                    <Tag color='blue'>{`{Time}`}</Tag>
                                                </Text>
                                            </div>
                                            <div>
                                                <VideoCameraOutlined style={{ color: '#136dec', marginRight: '8px' }} />{' '}
                                                <a href='#'>
                                                    <Tag color='blue'>{`{Meeting_Link}`}</Tag>
                                                </a>
                                            </div>
                                        </div>

                                        <p>
                                            Please let us know if this time works for you. We look forward to speaking
                                            with you soon.
                                        </p>
                                        <p>
                                            Best regards,
                                            <br />
                                            <strong>InternOS HR Team</strong>
                                        </p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                                    <Button type='link' icon={<EditOutlined />} size='small'>
                                        Edit Template Body
                                    </Button>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '12px',
                                    borderTop: '1px solid #f0f0f0',
                                    paddingTop: '24px'
                                }}
                            >
                                <Button size='large'>Cancel</Button>
                                <Button
                                    type='primary'
                                    size='large'
                                    icon={<SendOutlined />}
                                    onClick={() => message.success('Invites sent successfully!')}
                                >
                                    Schedule & Send ({selectedCandidates.length})
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};
