import {
    ArrowRightOutlined,
    CalendarOutlined,
    CheckCircleFilled,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DownloadOutlined,
    FileTextOutlined,
    FireOutlined,
    InfoCircleOutlined,
    LockOutlined,
    MessageOutlined,
    PlayCircleFilled,
    PlayCircleOutlined,
    QuestionCircleOutlined,
    RightOutlined,
    TrophyOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Layout, Progress, Row, Tag, Timeline, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

export const InternDashboard = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        message.info(`Navigating to: ${path}`);
    };

    const handleDownload = (file: string) => {
        message.success(`Downloading ${file}...`);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
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
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    Home
                </span>
                <RightOutlined style={{ fontSize: '10px' }} />
                <span style={{ cursor: 'pointer' }}>Internship Program</span>
                <RightOutlined style={{ fontSize: '10px' }} />
                <span style={{ color: '#136dec', fontWeight: 600 }}>Phase 1: Foundations</span>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                    gap: '24px'
                }}
            >
                <div>
                    <Tag
                        color='blue'
                        style={{
                            marginBottom: '12px',
                            border: 0,
                            background: 'rgba(19, 109, 236, 0.1)',
                            color: '#136dec',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                        }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                background: '#136dec',
                                borderRadius: '50%',
                                marginRight: '8px'
                            }}
                        ></span>
                        Current Track
                    </Tag>
                    <Title level={1} style={{ margin: '0 0 8px 0' }}>
                        Software Development Track
                    </Title>
                    <Text type='secondary' style={{ fontSize: '16px', maxWidth: '600px', display: 'block' }}>
                        Master the core principles of software engineering. Phase 1 focuses on database design, backend
                        logic, and system architecture.
                    </Text>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                        icon={<DownloadOutlined />}
                        size='large'
                        onClick={() => handleDownload('Syllabus_Q3_2024.pdf')}
                    >
                        Syllabus
                    </Button>
                    <Button
                        icon={<CalendarOutlined />}
                        size='large'
                        type='primary'
                        style={{ background: '#101822' }}
                        onClick={() => message.info('Opening Calendar...')}
                    >
                        Schedule
                    </Button>
                </div>
            </div>

            <Row gutter={[48, 48]}>
                <Col xs={24} lg={16}>
                    <Timeline
                        items={[
                            {
                                color: 'green',
                                dot: (
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background: '#52c41a',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff'
                                        }}
                                    >
                                        <CheckCircleFilled style={{ fontSize: '24px' }} />
                                    </div>
                                ),
                                children: (
                                    <Card
                                        bordered={false}
                                        style={{ borderRadius: '12px', border: '1px solid #f0f0f0', opacity: 0.8 }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            <Text
                                                type='success'
                                                strong
                                                style={{ textTransform: 'uppercase', fontSize: '12px' }}
                                            >
                                                Completed
                                            </Text>
                                            <Tag color='success'>100%</Tag>
                                        </div>
                                        <Title level={4} style={{ margin: '0 0 8px 0' }}>
                                            Module 1: Company Onboarding & Culture
                                        </Title>
                                        <Text type='secondary' style={{ display: 'block', marginBottom: '16px' }}>
                                            Introduction to company values, tools setup, and team introductions.
                                        </Text>
                                        <Button
                                            type='link'
                                            style={{ padding: 0 }}
                                            onClick={() => handleNavigation('Module 1 Review')}
                                        >
                                            Review Materials
                                        </Button>
                                    </Card>
                                )
                            },
                            {
                                color: 'blue',
                                dot: (
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background: '#136dec',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            boxShadow: '0 0 0 4px #e6f7ff'
                                        }}
                                    >
                                        <PlayCircleFilled style={{ fontSize: '24px' }} />
                                    </div>
                                ),
                                children: (
                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid rgba(19, 109, 236, 0.3)',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            overflow: 'hidden'
                                        }}
                                        bodyStyle={{ padding: 0 }}
                                    >
                                        <div style={{ height: '4px', background: '#f0f0f0', width: '100%' }}>
                                            <div style={{ height: '100%', background: '#136dec', width: '45%' }}></div>
                                        </div>
                                        <div style={{ padding: '24px' }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'start',
                                                    marginBottom: '24px'
                                                }}
                                            >
                                                <div>
                                                    <Tag
                                                        color='blue'
                                                        style={{
                                                            border: 0,
                                                            background: '#e6f7ff',
                                                            color: '#136dec',
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            marginBottom: '8px'
                                                        }}
                                                    >
                                                        In Progress
                                                    </Tag>
                                                    <Title level={3} style={{ margin: '0 0 8px 0' }}>
                                                        Module 2: Database Architecture
                                                    </Title>
                                                    <Text type='secondary'>
                                                        Learn to design scalable schemas, write complex queries, and
                                                        understand normalization.
                                                    </Text>
                                                </div>
                                                <Button
                                                    type='primary'
                                                    icon={<ArrowRightOutlined />}
                                                    style={{ background: '#136dec' }}
                                                    onClick={() => handleNavigation('Module 2')}
                                                >
                                                    Continue Learning
                                                </Button>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '16px',
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #f0f0f0',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => handleNavigation('Video: SQL Intro')}
                                                >
                                                    <div
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            background: '#f6ffed',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#52c41a'
                                                        }}
                                                    >
                                                        <CheckCircleFilled />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div
                                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                                        >
                                                            <Text strong>Intro to SQL & Relational Models</Text>
                                                            <Text type='success' style={{ fontSize: '12px' }}>
                                                                Completed
                                                            </Text>
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '12px',
                                                                fontSize: '12px',
                                                                color: '#8c8c8c'
                                                            }}
                                                        >
                                                            <span>
                                                                <VideoCameraOutlined /> Video
                                                            </span>
                                                            <span>•</span>
                                                            <span>15 mins</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '16px',
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        background: '#e6f7ff',
                                                        border: '1px solid #bae7ff',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => handleNavigation('Article: Normalization')}
                                                >
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
                                                        <FileTextOutlined />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div
                                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                                        >
                                                            <Text strong style={{ color: '#136dec' }}>
                                                                Normalization Standards (1NF - 3NF)
                                                            </Text>
                                                            <Tag color='blue'>Current</Tag>
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '12px',
                                                                fontSize: '12px',
                                                                color: '#595959'
                                                            }}
                                                        >
                                                            <span>
                                                                <FileTextOutlined /> Article
                                                            </span>
                                                            <span>•</span>
                                                            <span>10 min read</span>
                                                        </div>
                                                    </div>
                                                    <PlayCircleOutlined
                                                        style={{ fontSize: '24px', color: '#136dec' }}
                                                    />
                                                </div>

                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '16px',
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #f0f0f0',
                                                        opacity: 0.6,
                                                        cursor: 'not-allowed'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            background: '#f5f5f5',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#bfbfbf'
                                                        }}
                                                    >
                                                        <LockOutlined />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div
                                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                                        >
                                                            <Text strong>Checkpoint Quiz: Basic Queries</Text>
                                                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                                                Locked
                                                            </Text>
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '12px',
                                                                fontSize: '12px',
                                                                color: '#8c8c8c'
                                                            }}
                                                        >
                                                            <span>
                                                                <QuestionCircleOutlined /> Quiz
                                                            </span>
                                                            <span>•</span>
                                                            <span>10 Questions</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            },
                            {
                                color: 'gray',
                                dot: (
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background: '#f0f0f0',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#bfbfbf',
                                            border: '2px solid #d9d9d9'
                                        }}
                                    >
                                        <LockOutlined style={{ fontSize: '20px' }} />
                                    </div>
                                ),
                                children: (
                                    <Card
                                        bordered={false}
                                        style={{ borderRadius: '12px', border: '1px solid #f0f0f0', opacity: 0.5 }}
                                    >
                                        <Text
                                            type='secondary'
                                            strong
                                            style={{
                                                textTransform: 'uppercase',
                                                fontSize: '12px',
                                                marginBottom: '4px',
                                                display: 'block'
                                            }}
                                        >
                                            Locked
                                        </Text>
                                        <Title level={4} style={{ margin: '0 0 8px 0' }}>
                                            Module 3: Advanced Query Optimization
                                        </Title>
                                        <Text type='secondary' style={{ display: 'block', marginBottom: '16px' }}>
                                            Deep dive into indexing strategies, execution plans, and performance tuning.
                                        </Text>
                                        <Text type='secondary' style={{ fontSize: '12px' }}>
                                            <InfoCircleOutlined /> Complete Module 2 to unlock
                                        </Text>
                                    </Card>
                                )
                            },
                            {
                                color: 'gray',
                                dot: (
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background: '#f0f0f0',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#bfbfbf',
                                            border: '2px solid #d9d9d9'
                                        }}
                                    >
                                        <TrophyOutlined style={{ fontSize: '20px' }} />
                                    </div>
                                ),
                                children: (
                                    <Card
                                        bordered={false}
                                        style={{ borderRadius: '12px', border: '1px dashed #d9d9d9', opacity: 0.5 }}
                                    >
                                        <Title level={4} style={{ margin: '0 0 4px 0' }}>
                                            Phase 1 Capstone Exam
                                        </Title>
                                        <Text type='secondary'>Final assessment covering all modules in Phase 1.</Text>
                                    </Card>
                                )
                            }
                        ]}
                    />
                </Col>

                <Col xs={24} lg={8}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            position: 'sticky',
                            top: '24px'
                        }}
                    >
                        <Card bordered={false} style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <Title
                                level={4}
                                style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <CheckCircleOutlined style={{ color: '#136dec' }} /> Phase Progress
                            </Title>
                            <div style={{ marginBottom: '16px' }}>
                                <span style={{ fontSize: '36px', fontWeight: 900, color: '#1f2937' }}>45%</span>
                                <Text type='secondary' style={{ marginLeft: '8px', fontWeight: 500 }}>
                                    completed
                                </Text>
                            </div>
                            <Progress
                                percent={45}
                                showInfo={false}
                                strokeColor='#136dec'
                                trailColor='#f0f0f0'
                                strokeWidth={12}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '16px',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #f0f0f0'
                                }}
                            >
                                <div>
                                    <Text type='secondary' style={{ fontSize: '12px', display: 'block' }}>
                                        Remaining
                                    </Text>
                                    <Text strong>12 Days</Text>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <Text type='secondary' style={{ fontSize: '12px', display: 'block' }}>
                                        Total Modules
                                    </Text>
                                    <Text strong>2 / 5 Done</Text>
                                </div>
                            </div>
                        </Card>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Card
                                    bordered={false}
                                    style={{ borderRadius: '12px', border: '1px solid #f0f0f0', textAlign: 'center' }}
                                >
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background: '#fff7e6',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fa8c16',
                                            margin: '0 auto 8px auto'
                                        }}
                                    >
                                        <FireOutlined style={{ fontSize: '20px' }} />
                                    </div>
                                    <Title level={3} style={{ margin: 0 }}>
                                        4
                                    </Title>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        Day Streak
                                    </Text>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    bordered={false}
                                    style={{ borderRadius: '12px', border: '1px solid #f0f0f0', textAlign: 'center' }}
                                >
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background: '#f9f0ff',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#722ed1',
                                            margin: '0 auto 8px auto'
                                        }}
                                    >
                                        <TrophyOutlined style={{ fontSize: '20px' }} />
                                    </div>
                                    <Title level={3} style={{ margin: 0 }}>
                                        Top 10%
                                    </Title>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        Cohort Rank
                                    </Text>
                                </Card>
                            </Col>
                        </Row>

                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #101822 0%, #1a222d 100%)',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '8px',
                                        color: '#d1d5db',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    <ClockCircleOutlined /> Upcoming Deadline
                                </div>
                                <Title level={4} style={{ color: 'white', margin: '0 0 4px 0' }}>
                                    Module 2 Quiz
                                </Title>
                                <Text style={{ color: '#9ca3af', display: 'block', marginBottom: '16px' }}>
                                    Complete the database basics assessment.
                                </Text>

                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px'
                                    }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>Fri</div>
                                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#d1d5db' }}>
                                            Day
                                        </div>
                                    </div>
                                    <div
                                        style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.2)' }}
                                    ></div>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>5:00 PM</div>
                                        <div style={{ fontSize: '12px', color: '#fca5a5' }}>Due in 2 days</div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card bordered={false} style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Avatar size={48} src='https://i.pravatar.cc/150?u=1' />
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block' }}>
                                        Sarah Jenkins
                                    </Text>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        Senior DB Architect • Mentor
                                    </Text>
                                </div>
                                <Button
                                    shape='circle'
                                    icon={<MessageOutlined />}
                                    onClick={() => message.info('Opening chat with Sarah Jenkins...')}
                                />
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
