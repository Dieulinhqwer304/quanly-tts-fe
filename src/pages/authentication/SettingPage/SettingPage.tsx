import {
    BoldOutlined,
    ClockCircleOutlined,
    CodeOutlined,
    FileTextOutlined,
    ItalicOutlined,
    OrderedListOutlined,
    PlusOutlined,
    SaveOutlined,
    SearchOutlined,
    SettingOutlined,
    TeamOutlined,
    UnderlineOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Input, Layout, List, Row, Space, Tabs, Tag, Typography } from 'antd';
import { useState } from 'react';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Paragraph } = Typography;

export default function SettingPage() {
    const [activeTab, setActiveTab] = useState('1');

    return (
        <Layout style={{ minHeight: '100vh', background: '#f6f7f8' }}>
            <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <div style={{ marginBottom: '24px' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        System Configuration
                    </Title>
                    <Text type='secondary'>
                        Manage global settings, communication templates, and organizational structure.
                    </Text>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: '1',
                            label: (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileTextOutlined /> Email Templates
                                </span>
                            ),
                            children: (
                                <Row gutter={24} style={{ height: '600px' }}>
                                    <Col xs={24} md={8} lg={6}>
                                        <Card
                                            bordered={false}
                                            style={{
                                                height: '100%',
                                                borderRadius: '12px',
                                                border: '1px solid #e5e7eb',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                            bodyStyle={{
                                                padding: 0,
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                                                <Input prefix={<SearchOutlined />} placeholder='Search templates...' />
                                            </div>
                                            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                                                <List
                                                    dataSource={[
                                                        {
                                                            id: 1,
                                                            title: 'Interview Invite',
                                                            subject:
                                                                'Subject: Invitation to Interview with [Company Name]',
                                                            color: 'green',
                                                            active: true
                                                        },
                                                        {
                                                            id: 2,
                                                            title: 'Offer Letter',
                                                            subject: 'Subject: Internship Offer - Welcome Aboard!',
                                                            color: 'green',
                                                            active: false
                                                        },
                                                        {
                                                            id: 3,
                                                            title: 'Rejection Email',
                                                            subject: 'Subject: Update on your application',
                                                            color: 'default',
                                                            active: false
                                                        },
                                                        {
                                                            id: 4,
                                                            title: 'Onboarding Welcome',
                                                            subject: 'Subject: First day instructions and access',
                                                            color: 'default',
                                                            active: false
                                                        }
                                                    ]}
                                                    renderItem={(item) => (
                                                        <div
                                                            style={{
                                                                padding: '12px',
                                                                marginBottom: '8px',
                                                                borderRadius: '8px',
                                                                background: item.active ? '#e6f7ff' : 'transparent',
                                                                border: item.active
                                                                    ? '1px solid #1890ff'
                                                                    : '1px solid transparent',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    marginBottom: '4px'
                                                                }}
                                                            >
                                                                <Text
                                                                    strong
                                                                    style={{
                                                                        color: item.active ? '#1890ff' : '#1f2937'
                                                                    }}
                                                                >
                                                                    {item.title}
                                                                </Text>
                                                                <div
                                                                    style={{
                                                                        width: 8,
                                                                        height: 8,
                                                                        borderRadius: '50%',
                                                                        background:
                                                                            item.color === 'green'
                                                                                ? '#52c41a'
                                                                                : '#d9d9d9'
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <Text
                                                                type='secondary'
                                                                style={{
                                                                    fontSize: '12px',
                                                                    display: 'block',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}
                                                            >
                                                                {item.subject}
                                                            </Text>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            <div style={{ padding: '12px', borderTop: '1px solid #f0f0f0' }}>
                                                <Button type='dashed' block icon={<PlusOutlined />}>
                                                    New Template
                                                </Button>
                                            </div>
                                        </Card>
                                    </Col>

                                    <Col xs={24} md={16} lg={18}>
                                        <Card
                                            bordered={false}
                                            style={{
                                                height: '100%',
                                                borderRadius: '12px',
                                                border: '1px solid #e5e7eb',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                            bodyStyle={{
                                                padding: 0,
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0' }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '16px'
                                                    }}
                                                >
                                                    <Title level={4} style={{ margin: 0 }}>
                                                        Edit Template
                                                    </Title>
                                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                                        <ClockCircleOutlined /> Last edited: Today, 10:23 AM
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Text
                                                        strong
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            color: '#6b7280'
                                                        }}
                                                    >
                                                        Subject Line
                                                    </Text>
                                                    <Input
                                                        defaultValue='Invitation to Interview - {{position_name}}'
                                                        style={{ marginTop: '8px' }}
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#fafafa',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    display: 'flex',
                                                    gap: '8px',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Button type='text' icon={<BoldOutlined />} size='small' />
                                                <Button type='text' icon={<ItalicOutlined />} size='small' />
                                                <Button type='text' icon={<UnderlineOutlined />} size='small' />
                                                <Divider type='vertical' />
                                                <Button type='text' icon={<UnorderedListOutlined />} size='small' />
                                                <Button type='text' icon={<OrderedListOutlined />} size='small' />
                                                <Divider type='vertical' />
                                                <Button size='small' icon={<CodeOutlined />}>
                                                    Insert Variable
                                                </Button>
                                            </div>

                                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                                                <Paragraph>
                                                    Dear <Tag>{'{candidate_name}'}</Tag>,
                                                </Paragraph>
                                                <Paragraph>
                                                    Thank you for applying to the <Tag>{'{position_name}'}</Tag>{' '}
                                                    position at InternshipOS. We were impressed by your background and
                                                    would like to invite you to an interview.
                                                </Paragraph>
                                                <Paragraph>
                                                    The interview will be conducted by <Tag>{'{interviewer_name}'}</Tag>{' '}
                                                    and is scheduled to last approximately 45 minutes.
                                                </Paragraph>
                                                <Paragraph>
                                                    Please use the following link to select a time that works best for
                                                    you: <a href='#'>Schedule Interview</a>
                                                </Paragraph>
                                                <Paragraph>
                                                    Best regards,
                                                    <br />
                                                    Recruitment Team
                                                </Paragraph>
                                            </div>

                                            <div
                                                style={{
                                                    padding: '16px 24px',
                                                    background: '#fcfcfd',
                                                    borderTop: '1px solid #f0f0f0',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Button>Send Test Email</Button>
                                                <Space>
                                                    <Button>Discard Changes</Button>
                                                    <Button type='primary' icon={<SaveOutlined />}>
                                                        Save Template
                                                    </Button>
                                                </Space>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            )
                        },
                        {
                            key: '2',
                            label: (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <SettingOutlined /> Departments
                                </span>
                            ),
                            children: (
                                <div style={{ padding: '24px', textAlign: 'center', color: '#8c8c8c' }}>
                                    Department settings content placeholder
                                </div>
                            )
                        },
                        {
                            key: '3',
                            label: (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TeamOutlined /> User Roles
                                </span>
                            ),
                            children: (
                                <div style={{ padding: '24px', textAlign: 'center', color: '#8c8c8c' }}>
                                    User role management content placeholder
                                </div>
                            )
                        }
                    ]}
                />
            </Content>
        </Layout>
    );
}
