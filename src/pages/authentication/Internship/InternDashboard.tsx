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
    RightOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Progress, Row, Tag, Timeline, Typography, message, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useIntern } from '../../../hooks/Internship/useInterns';
import { useTasks } from '../../../hooks/Internship/useTasks';
import { useLearningPath } from '../../../hooks/Internship/useLearningPath';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export const InternDashboard = () => {
    const navigate = useNavigate();
    const internId = 'ITS-001'; // Default for now, ideally from auth context

    const { data: internData, isLoading: isLoadingIntern } = useIntern(internId);
    const { data: tasksData, isLoading: isLoadingTasks } = useTasks({ internId });

    const intern = internData?.data;
    const { data: learningPathData, isLoading: isLoadingLP } = useLearningPath(intern?.track || '');

    const tasks = tasksData?.data.hits || [];
    const learningPath = learningPathData?.data;
    const modules = learningPath?.modules || [];

    // Find the nearest upcoming deadline
    const upcomingTask = tasks
        .filter((t) => t.status !== 'Completed' && dayjs(t.dueDate).isAfter(dayjs()))
        .sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)))[0];

    const handleNavigation = (path: string) => {
        message.info(`Navigating to: ${path}`);
    };

    const handleDownload = (file: string) => {
        message.success(`Downloading ${file}...`);
    };

    if (isLoadingIntern || isLoadingTasks || isLoadingLP) {
        return (
            <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
                <Skeleton active paragraph={{ rows: 10 }} />
            </div>
        );
    }

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
                        {intern?.track || 'Software Development Track'}
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
                            ...modules.map((module) => ({
                                color:
                                    module.status === 'Ready'
                                        ? 'green'
                                        : module.status === 'In Progress'
                                          ? 'blue'
                                          : 'gray',
                                dot: (
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background:
                                                module.status === 'Ready'
                                                    ? '#52c41a'
                                                    : module.status === 'In Progress'
                                                      ? '#136dec'
                                                      : '#f0f0f0',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: module.status === 'Locked' ? '#bfbfbf' : '#fff',
                                            boxShadow: module.status === 'In Progress' ? '0 0 0 4px #e6f7ff' : 'none',
                                            border: module.status === 'Locked' ? '2px solid #d9d9d9' : 'none'
                                        }}
                                    >
                                        {module.status === 'Ready' ? (
                                            <CheckCircleFilled style={{ fontSize: '24px' }} />
                                        ) : module.status === 'In Progress' ? (
                                            <PlayCircleFilled style={{ fontSize: '24px' }} />
                                        ) : (
                                            <LockOutlined style={{ fontSize: '20px' }} />
                                        )}
                                    </div>
                                ),
                                children: (
                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: '12px',
                                            border:
                                                module.status === 'In Progress'
                                                    ? '1px solid rgba(19, 109, 236, 0.3)'
                                                    : '1px solid #f0f0f0',
                                            opacity:
                                                module.status === 'Locked' ? 0.5 : module.status === 'Ready' ? 0.8 : 1,
                                            boxShadow:
                                                module.status === 'In Progress'
                                                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                                    : 'none',
                                            overflow: 'hidden'
                                        }}
                                        bodyStyle={module.status === 'In Progress' ? { padding: 0 } : undefined}
                                    >
                                        {module.status === 'In Progress' && (
                                            <div style={{ height: '4px', background: '#f0f0f0', width: '100%' }}>
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        background: '#136dec',
                                                        width: `${module.progress}%`
                                                    }}
                                                ></div>
                                            </div>
                                        )}
                                        <div style={module.status === 'In Progress' ? { padding: '24px' } : {}}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'start',
                                                    marginBottom: module.status === 'In Progress' ? '24px' : '8px'
                                                }}
                                            >
                                                <div>
                                                    <Tag
                                                        color={
                                                            module.status === 'Ready'
                                                                ? 'success'
                                                                : module.status === 'In Progress'
                                                                  ? 'blue'
                                                                  : 'default'
                                                        }
                                                        style={{
                                                            border: 0,
                                                            background:
                                                                module.status === 'Ready'
                                                                    ? '#f6ffed'
                                                                    : module.status === 'In Progress'
                                                                      ? '#e6f7ff'
                                                                      : '#f5f5f5',
                                                            color:
                                                                module.status === 'Ready'
                                                                    ? '#52c41a'
                                                                    : module.status === 'In Progress'
                                                                      ? '#136dec'
                                                                      : '#8c8c8c',
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            marginBottom: '8px'
                                                        }}
                                                    >
                                                        {module.status === 'Ready' ? 'Completed' : module.status}
                                                    </Tag>
                                                    <Title
                                                        level={module.status === 'In Progress' ? 3 : 4}
                                                        style={{ margin: '0 0 8px 0' }}
                                                    >
                                                        Module {module.id}: {module.title}
                                                    </Title>
                                                    <Text type='secondary'>{module.description}</Text>
                                                </div>
                                                {module.status === 'In Progress' && (
                                                    <Button
                                                        type='primary'
                                                        icon={<ArrowRightOutlined />}
                                                        style={{ background: '#136dec' }}
                                                        onClick={() => navigate('/internship/tasks')}
                                                    >
                                                        Go to Tasks
                                                    </Button>
                                                )}
                                            </div>

                                            {module.status === 'In Progress' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {tasks.slice(0, 3).map((task) => (
                                                        <div
                                                            key={task.id}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '16px',
                                                                padding: '12px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #f0f0f0',
                                                                background:
                                                                    task.status === 'In Progress' ? '#e6f7ff' : '#fff',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => navigate('/internship/tasks')}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    background:
                                                                        task.status === 'Completed'
                                                                            ? '#f6ffed'
                                                                            : '#f5f5f5',
                                                                    borderRadius: '8px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color:
                                                                        task.status === 'Completed'
                                                                            ? '#52c41a'
                                                                            : '#bfbfbf'
                                                                }}
                                                            >
                                                                {task.status === 'Completed' ? (
                                                                    <CheckCircleFilled />
                                                                ) : (
                                                                    <FileTextOutlined />
                                                                )}
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between'
                                                                    }}
                                                                >
                                                                    <Text
                                                                        strong
                                                                        style={{
                                                                            color:
                                                                                task.status === 'In Progress'
                                                                                    ? '#136dec'
                                                                                    : 'inherit'
                                                                        }}
                                                                    >
                                                                        {task.title}
                                                                    </Text>
                                                                    <Tag
                                                                        color={
                                                                            task.status === 'Completed'
                                                                                ? 'success'
                                                                                : task.status === 'In Progress'
                                                                                  ? 'blue'
                                                                                  : 'default'
                                                                        }
                                                                    >
                                                                        {task.status}
                                                                    </Tag>
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
                                                                        <CalendarOutlined /> Due{' '}
                                                                        {dayjs(task.dueDate).format('MMM DD, YYYY')}
                                                                    </span>
                                                                    <span>•</span>
                                                                    <span>{task.priority} Priority</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {module.status === 'Ready' && (
                                                <Button
                                                    type='link'
                                                    style={{ padding: 0 }}
                                                    onClick={() => handleNavigation(`Module ${module.id} Review`)}
                                                >
                                                    Review Materials
                                                </Button>
                                            )}

                                            {module.status === 'Locked' && (
                                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                                    <InfoCircleOutlined /> Complete previous module to unlock
                                                </Text>
                                            )}
                                        </div>
                                    </Card>
                                )
                            })),
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
                        {upcomingTask && (
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
                                        {upcomingTask.title}
                                    </Title>
                                    <Text style={{ color: '#9ca3af', display: 'block', marginBottom: '16px' }}>
                                        {upcomingTask.description}
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
                                            <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
                                                {dayjs(upcomingTask.dueDate).format('ddd')}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '10px',
                                                    textTransform: 'uppercase',
                                                    color: '#d1d5db'
                                                }}
                                            >
                                                {dayjs(upcomingTask.dueDate).format('MMM')}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                width: '1px',
                                                height: '32px',
                                                background: 'rgba(255,255,255,0.2)'
                                            }}
                                        ></div>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>
                                                {dayjs(upcomingTask.dueDate).format('h:mm A')}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#fca5a5' }}>
                                                Due {dayjs(upcomingTask.dueDate).fromNow()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card bordered={false} style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Avatar size={48} src={`https://i.pravatar.cc/150?u=${intern?.mentor}`} />
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block' }}>
                                        {intern?.mentor || 'Assigned Mentor'}
                                    </Text>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        Senior Engineer • Mentor
                                    </Text>
                                </div>
                                <Button
                                    shape='circle'
                                    icon={<MessageOutlined />}
                                    onClick={() => message.info(`Opening chat with ${intern?.mentor}...`)}
                                />
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
