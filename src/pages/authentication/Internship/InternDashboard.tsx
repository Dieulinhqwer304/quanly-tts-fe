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
import { Avatar, Button, Card, Col, Progress, Row, Tag, Timeline, Typography, Skeleton, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { RouteConfig } from '../../../constants';
import { http } from '../../../utils/http';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export const InternDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { message: messageApi } = App.useApp();

    const [internData, setInternData] = useState<any>(null);
    const [tasksData, setTasksData] = useState<any>(null);
    const [learningPathData, setLearningPathData] = useState<any>(null);
    const [isLoadingIntern, setIsLoadingIntern] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [isLoadingLP, setIsLoadingLP] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingIntern(true);
            try {
                const res = await http.get('/interns/me');
                setInternData(res);
                const internObj = res?.data;

                if (internObj) {
                    setIsLoadingTasks(true);
                    setIsLoadingLP(true);

                    // Fetch tasks and learning path in parallel
                    const [tasksRes, lpRes] = await Promise.all([
                        http.get(`/tasks`, { params: { internId: internObj.id } }),
                        http.get(`/learning-paths/${internObj.track || ''}`)
                    ]);

                    setTasksData(tasksRes);
                    setLearningPathData(lpRes);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingIntern(false);
                setIsLoadingTasks(false);
                setIsLoadingLP(false);
            }
        };

        fetchInitialData();
    }, []);

    const intern = internData?.data;

    const tasks = tasksData?.data?.hits || [];
    const learningPath = learningPathData?.data;
    const modules = useMemo(() => {
        if (!learningPath?.modules) return [];
        return (learningPath.modules as any[]).map((m: any) => ({
            ...m,
            items: [...(m.contents || []), ...(m.quizzes || [])],
            progress: m.progress || 0
        }));
    }, [learningPath?.modules]);

    // Find the nearest upcoming deadline
    const upcomingTask = useMemo(() => {
        return tasks
            .filter((t) => t.status?.toLowerCase() !== 'completed' && dayjs(t.dueDate).isAfter(dayjs()))
            .sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)))[0];
    }, [tasks]);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleDownload = (file: string) => {
        messageApi.success(t('intern_dashboard.download_msg', { file }));
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
                    {t('menu.dashboard')}
                </span>
                <RightOutlined style={{ fontSize: '10px' }} />
                <span style={{ cursor: 'pointer' }}>{t('intern_dashboard.breadcrumb_program')}</span>
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
                        {t('intern_dashboard.current_track')}
                    </Tag>
                    <Title level={1} style={{ margin: '0 0 8px 0' }}>
                        {intern?.track || 'Software Development Track'}
                    </Title>
                    <Text type='secondary' style={{ fontSize: '16px', maxWidth: '600px', display: 'block' }}>
                        Master the core principles of software engineering. Phase 1 focuses on database design, backend
                        logic, and system architecture.
                    </Text>
                    <div style={{ marginTop: '24px', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text strong>{t('intern_dashboard.overall_progress')}</Text>
                            <Text strong color='#136dec'>
                                {intern?.progress || 0}%
                            </Text>
                        </div>
                        <Progress
                            percent={intern?.progress || 0}
                            showInfo={false}
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068'
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Button
                        icon={<DownloadOutlined />}
                        size='large'
                        onClick={() => handleDownload('Syllabus_Q3_2024.pdf')}
                    >
                        {t('intern_dashboard.syllabus')}
                    </Button>
                    <Button
                        icon={<CalendarOutlined />}
                        size='large'
                        type='primary'
                        style={{ background: '#101822' }}
                        onClick={() => messageApi.info(t('intern_dashboard.calendar_msg'))}
                    >
                        {t('intern_dashboard.schedule')}
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
                                        variant='borderless'
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
                                                        {module.status === 'Ready'
                                                            ? t('common.completed')
                                                            : module.status === 'In Progress'
                                                              ? t('task_mgmt.in_progress')
                                                              : t('common.locked')}
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
                                                        onClick={() => navigate(RouteConfig.InternTaskBoard.path)}
                                                    >
                                                        {t('intern_dashboard.go_to_tasks')}
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
                                                            onClick={() => navigate(RouteConfig.InternTaskBoard.path)}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    background:
                                                                        task.status?.toLowerCase() === 'completed'
                                                                            ? '#f6ffed'
                                                                            : '#f5f5f5',
                                                                    borderRadius: '8px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color:
                                                                        task.status?.toLowerCase() === 'completed'
                                                                            ? '#52c41a'
                                                                            : '#bfbfbf'
                                                                }}
                                                            >
                                                                {task.status?.toLowerCase() === 'completed' ? (
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
                                                                            task.status?.toLowerCase() === 'completed'
                                                                                ? 'success'
                                                                                : task.status?.toLowerCase() ===
                                                                                    'in_progress'
                                                                                  ? 'blue'
                                                                                  : 'default'
                                                                        }
                                                                    >
                                                                        {t(
                                                                            `task_mgmt.${task.status
                                                                                ?.toLowerCase()
                                                                                .replace(' ', '_')}`
                                                                        )}
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
                                                                        <CalendarOutlined /> {t('intern_dashboard.due')}{' '}
                                                                        {dayjs(task.dueDate).format('MMM DD, YYYY')}
                                                                    </span>
                                                                    <span>•</span>
                                                                    <span>
                                                                        {t(`task_mgmt.${task.priority.toLowerCase()}`)}{' '}
                                                                        {t('task_mgmt.priority')}
                                                                    </span>
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
                                                    {t('intern_dashboard.review_materials')}
                                                </Button>
                                            )}

                                            {module.status === 'Locked' && (
                                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                                    <InfoCircleOutlined /> {t('intern_dashboard.unlock_info')}
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
                                        variant='borderless'
                                        style={{ borderRadius: '12px', border: '1px dashed #d9d9d9', opacity: 0.5 }}
                                    >
                                        <Title level={4} style={{ margin: '0 0 4px 0' }}>
                                            {t('intern_dashboard.capstone_title')}
                                        </Title>
                                        <Text type='secondary'>{t('intern_dashboard.capstone_desc')}</Text>
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
                                variant='borderless'
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
                                        <ClockCircleOutlined /> {t('intern_dashboard.upcoming_deadline')}
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
                                                {t('intern_dashboard.due')} {dayjs(upcomingTask.dueDate).fromNow()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card variant='borderless' style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Avatar
                                    size={48}
                                    src={intern?.mentorAvatar || `https://i.pravatar.cc/150?u=${intern?.mentorId}`}
                                />
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block' }}>
                                        {intern?.mentor?.fullName || intern?.mentor || t('internship.mentor')}
                                    </Text>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        {intern?.track} Senior • {t('internship.mentor')}
                                    </Text>
                                </div>
                                <Button
                                    shape='circle'
                                    icon={<MessageOutlined />}
                                    onClick={() => messageApi.info(`Opening chat with ${intern?.mentor}...`)}
                                />
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
