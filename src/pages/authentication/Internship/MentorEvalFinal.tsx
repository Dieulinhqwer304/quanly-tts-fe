import {
    CheckCircleOutlined,
    HistoryOutlined,
    IdcardOutlined,
    LineChartOutlined,
    RightOutlined,
    SaveOutlined,
    SendOutlined,
    TeamOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Collapse,
    Input,
    Layout,
    Progress,
    Radio,
    Row,
    Select,
    Space,
    Tag,
    Typography
} from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

export const MentorEvalFinal = () => {
    return (
        <Layout style={{ minHeight: '100vh', background: '#f6f7f8' }}>
            <Content style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}>
                <div
                    style={{
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#6b7280',
                        fontSize: '14px'
                    }}
                >
                    <span style={{ cursor: 'pointer' }}>Interns</span>
                    <RightOutlined style={{ fontSize: '10px' }} />
                    <span style={{ cursor: 'pointer' }}>Evaluations</span>
                    <RightOutlined style={{ fontSize: '10px' }} />
                    <span style={{ color: '#136dec', fontWeight: 600 }}>Final Assessment</span>
                </div>

                <Card
                    bordered={false}
                    style={{ borderRadius: '12px', marginBottom: '24px', border: '1px solid #e5e7eb' }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '24px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ position: 'relative' }}>
                                <Avatar
                                    size={96}
                                    src='https://i.pravatar.cc/150?u=1'
                                    shape='square'
                                    style={{ borderRadius: '12px' }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: -4,
                                        right: -4,
                                        width: 16,
                                        height: 16,
                                        background: '#52c41a',
                                        borderRadius: '50%',
                                        border: '2px solid #fff'
                                    }}
                                ></div>
                            </div>
                            <div>
                                <Title level={2} style={{ margin: 0, marginBottom: '4px' }}>
                                    Alex Johnson
                                </Title>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        marginBottom: '8px'
                                    }}
                                >
                                    <span>
                                        <IdcardOutlined /> Software Engineering Intern
                                    </span>
                                    <span>•</span>
                                    <span>6 Months Duration</span>
                                </div>
                                <Tag color='blue' style={{ borderRadius: '12px' }}>
                                    Engineering Dept
                                </Tag>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', borderLeft: '1px solid #f0f0f0', paddingLeft: '24px' }}>
                            <Text
                                type='secondary'
                                style={{
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 600,
                                    display: 'block'
                                }}
                            >
                                Current Status
                            </Text>
                            <Text strong style={{ fontSize: '18px' }}>
                                Week 23 of 24
                            </Text>
                        </div>
                    </div>
                </Card>

                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col span={12}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <HistoryOutlined
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    fontSize: '64px',
                                    color: '#f3f4f6',
                                    zIndex: 0
                                }}
                            />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Text
                                        type='secondary'
                                        style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}
                                    >
                                        Phase 1 Score
                                    </Text>
                                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                </div>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 700 }}>82</span>
                                    <span style={{ fontSize: '18px', color: '#9ca3af' }}>/100</span>
                                </div>
                                <Text type='success' style={{ fontWeight: 500 }}>
                                    <LineChartOutlined /> On Track
                                </Text>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <HistoryOutlined
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    fontSize: '64px',
                                    color: '#f3f4f6',
                                    zIndex: 0
                                }}
                            />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Text
                                        type='secondary'
                                        style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}
                                    >
                                        Phase 2 Score
                                    </Text>
                                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                </div>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 700 }}>94</span>
                                    <span style={{ fontSize: '18px', color: '#9ca3af' }}>/100</span>
                                </div>
                                <Text type='success' style={{ fontWeight: 500 }}>
                                    <TrophyOutlined /> Exceeds Expectations
                                </Text>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}
                >
                    <Title level={3} style={{ margin: 0 }}>
                        Final Assessment Form
                    </Title>
                    <Tag style={{ borderRadius: '12px', padding: '4px 12px' }}>Draft saved 2m ago</Tag>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <Collapse
                        defaultActiveKey={['2']}
                        expandIconPosition='end'
                        style={{ background: 'transparent', border: 'none' }}
                        items={[
                            {
                                key: '1',
                                label: (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                background: '#e6f7ff',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#1890ff'
                                            }}
                                        >
                                            <TeamOutlined />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                                Attitude & Soft Skills
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                                Punctuality, proactiveness, and cultural fit.
                                            </div>
                                        </div>
                                    </div>
                                ),
                                extra: <Tag>0/3 Rated</Tag>,
                                style: {
                                    background: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb',
                                    overflow: 'hidden',
                                    marginBottom: '16px'
                                },
                                children: <p>Form content here...</p>
                            },
                            {
                                key: '2',
                                label: (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                background: '#136dec',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff'
                                            }}
                                        >
                                            <CheckCircleOutlined />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                                Technical Proficiency
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                                Code quality, tool mastery, and problem solving.
                                            </div>
                                        </div>
                                    </div>
                                ),
                                extra: <Tag color='green'>In Progress</Tag>,
                                style: {
                                    background: '#fff',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(19, 109, 236, 0.2)',
                                    overflow: 'hidden',
                                    marginBottom: '16px'
                                },
                                children: (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '32px',
                                            padding: '16px 0'
                                        }}
                                    >
                                        {[
                                            {
                                                title: 'Code Quality & Standards',
                                                desc: 'Adherence to style guides, readability, and commenting practices.',
                                                value: 4
                                            },
                                            {
                                                title: 'Architecture & Design',
                                                desc: 'Ability to understand system design and contribute to architectural decisions.',
                                                value: 3
                                            },
                                            {
                                                title: 'Tooling Proficiency',
                                                desc: 'Comfort with Git, Docker, CI/CD pipelines and IDEs.',
                                                value: 5
                                            }
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none',
                                                    paddingBottom: i < 2 ? '24px' : 0
                                                }}
                                            >
                                                <div style={{ maxWidth: '300px' }}>
                                                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                        {item.title}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        {item.desc}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Text
                                                        type='secondary'
                                                        style={{ fontSize: '12px', textTransform: 'uppercase' }}
                                                    >
                                                        Poor
                                                    </Text>
                                                    <Radio.Group value={item.value} buttonStyle='solid'>
                                                        {[1, 2, 3, 4, 5].map((val) => (
                                                            <Radio.Button
                                                                key={val}
                                                                value={val}
                                                                style={{
                                                                    width: 40,
                                                                    textAlign: 'center',
                                                                    borderRadius: '8px',
                                                                    margin: '0 4px',
                                                                    border: '1px solid #d9d9d9'
                                                                }}
                                                            >
                                                                {val}
                                                            </Radio.Button>
                                                        ))}
                                                    </Radio.Group>
                                                    <Text
                                                        type='secondary'
                                                        style={{ fontSize: '12px', textTransform: 'uppercase' }}
                                                    >
                                                        Excellent
                                                    </Text>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>

                <Card bordered={false} style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '24px' }}>
                        <TrophyOutlined style={{ fontSize: '32px', color: '#136dec' }} />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>
                                Final Recommendation
                            </Title>
                            <Text type='secondary'>
                                This decision will be forwarded to the HR department for final processing.
                            </Text>
                        </div>
                    </div>

                    <Row gutter={32}>
                        <Col span={12}>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                Recommendation Action
                            </Text>
                            <Select placeholder='Select an outcome...' style={{ width: '100%' }} size='large'>
                                <Select.Option value='hire'>Hire Full-time</Select.Option>
                                <Select.Option value='extend'>Extend Internship (3 Months)</Select.Option>
                                <Select.Option value='end'>End Program</Select.Option>
                            </Select>
                            <Text type='secondary' style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                Please consult with the Department Head before selecting "Hire Full-time".
                            </Text>
                        </Col>
                        <Col span={12}>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                Confidential Note for HR
                            </Text>
                            <TextArea rows={4} placeholder='Add context for your decision...' />
                        </Col>
                    </Row>
                </Card>
            </Content>

            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '16px 24px',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid #e5e7eb',
                    zIndex: 100,
                    paddingLeft: 280
                }}
            >
                <div
                    style={{
                        maxWidth: '1000px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text
                            type='secondary'
                            style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600 }}
                        >
                            Progress
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Progress
                                percent={35}
                                showInfo={false}
                                size='small'
                                style={{ width: 150 }}
                                strokeColor='#136dec'
                            />
                            <Text strong style={{ fontSize: '12px' }}>
                                35%
                            </Text>
                        </div>
                    </div>
                    <Space>
                        <Button icon={<SaveOutlined />}>Save Draft</Button>
                        <Button type='primary' icon={<SendOutlined />} size='large'>
                            Submit Evaluation
                        </Button>
                    </Space>
                </div>
            </div>
        </Layout>
    );
};
