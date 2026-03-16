import {
    ArrowRightOutlined,
    CalendarOutlined,
    CheckCircleFilled,
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
import { Avatar, Button, Card, Col, Progress, Row, Tag, Timeline, Typography, Skeleton, App, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { RouteConfig } from '../../../constants';
import { Intern } from '../../../services/Internship/interns';
import { LearningPath } from '../../../services/Internship/learningPath';
import { StudentProgress } from '../../../services/Internship/studentProgress';
import { Task } from '../../../services/Internship/tasks';
import { http } from '../../../utils/http';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

type DashboardIntern = Intern & {
    mentorAvatar?: string;
    overallProgress?: number;
};

interface DashboardTask extends Task {
    dueDate: string;
}

type DashboardModule = {
    id: string;
    title: string;
    description: string;
    orderIndex: number;
    passingScore: number;
    isRequired: boolean;
    contents?: Array<{ contentUrl?: string; title?: string }>;
    quizzes?: Array<{ id: string; title?: string }>;
    sequence: number;
    status: 'Ready' | 'In Progress' | 'Locked';
    items: Array<Record<string, unknown>>;
    progress: number;
};

export const InternDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { message: messageApi } = App.useApp();

    const [internData, setInternData] = useState<DashboardIntern | null>(null);
    const [tasksData, setTasksData] = useState<{ hits?: DashboardTask[]; data?: DashboardTask[] } | null>(null);
    const [learningPathData, setLearningPathData] = useState<LearningPath | null>(null);
    const [progressData, setProgressData] = useState<StudentProgress | null>(null);
    const [isLoadingIntern, setIsLoadingIntern] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [isLoadingLP, setIsLoadingLP] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingIntern(true);
            try {
                const res = (await http.get('/interns/me')) as DashboardIntern;
                setInternData(res);
                const internObj = res;

                if (internObj) {
                    setIsLoadingTasks(true);
                    setIsLoadingLP(true);

                    const [tasksRes, progressRes] = await Promise.all([
                        http.get(`/tasks`, {
                            params: { internId: internObj.id }
                        }),
                        http.get(`/interns/me/progress`)
                    ]);
                    const typedTasksRes = tasksRes as { hits?: DashboardTask[]; data?: DashboardTask[] };
                    const typedProgressRes = progressRes as StudentProgress;

                    let lpRes: LearningPath | null = null;
                    if (typedProgressRes?.learningPathId) {
                        lpRes = (await http.get(`/learning-paths/${typedProgressRes.learningPathId}`)) as LearningPath;
                    } else if (internObj.track) {
                        lpRes = (await http.get(`/learning-paths/track/${internObj.track}`)) as LearningPath;
                    }

                    setTasksData(typedTasksRes);
                    setLearningPathData(lpRes);
                    setProgressData(typedProgressRes);
                }
            } catch (error) {
                console.error(error);
                messageApi.error(t('common.error'));
            } finally {
                setIsLoadingIntern(false);
                setIsLoadingTasks(false);
                setIsLoadingLP(false);
            }
        };

        void fetchInitialData();
    }, [messageApi, t]);

    const intern = internData;

    const tasks = useMemo(() => tasksData?.hits || tasksData?.data || [], [tasksData]);
    const learningPath = learningPathData;
    const modules = useMemo(() => {
        if (!learningPath?.modules) return [];
        const completedSet = new Set(progressData?.modulesCompleted || []);
        const currentModuleId = progressData?.currentModuleId;

        return learningPath.modules.map((module, index) => {
            const status: DashboardModule['status'] = completedSet.has(module.id)
                ? 'Ready'
                : currentModuleId === module.id
                    ? 'In Progress'
                    : 'Locked';
            const contents = Array.isArray(module.contents)
                ? (module.contents as Array<{ contentUrl?: string; title?: string }>)
                : [];
            const quizzes = Array.isArray(module.quizzes) ? (module.quizzes as Array<{ id: string; title?: string }>) : [];

            return {
                id: module.id,
                title: module.title,
                description: module.description,
                orderIndex: module.orderIndex,
                passingScore: module.passingScore,
                isRequired: module.isRequired,
                contents,
                quizzes,
                sequence: index + 1,
                status,
                items: [...contents, ...quizzes],
                progress: status === 'In Progress' ? progressData?.overallProgress || 0 : status === 'Ready' ? 100 : 0
            };
        }) as DashboardModule[];
    }, [learningPath, progressData]);

    const activeModule = useMemo(() => {
        const progressModuleId = progressData?.currentModuleId;

        if (progressModuleId) {
            const matchedModule = modules.find((module) => String(module.id) === String(progressModuleId));

            if (matchedModule) {
                return matchedModule;
            }
        }

        return modules.find((module) => module.status === 'In Progress') || modules[0] || null;
    }, [modules, progressData?.currentModuleId]);

    const currentDocument = useMemo<{ contentUrl?: string; title?: string } | null>(() => {
        const contents = Array.isArray(activeModule?.contents)
            ? (activeModule.contents as Array<{ contentUrl?: string; title?: string }>)
            : [];

        if (!contents.length) {
            return null;
        }

        return contents.find((content) => Boolean(content.contentUrl)) || null;
    }, [activeModule]);

    const activeProgramLabel = activeModule?.title || learningPath?.title || intern?.track || t('menu.dashboard');
    const activeProgramDescription =
        activeModule?.description ||
        learningPath?.description ||
        'Theo doi lo trinh hoc, tien do va bai kiem tra hien tai cua ban.';

    // Find the nearest upcoming deadline
    const upcomingTask = useMemo(() => {
        return tasks
            .filter((task) => task.status?.toLowerCase() !== 'completed' && dayjs(task.dueDate).isAfter(dayjs()))
            .sort((firstTask, secondTask) => dayjs(firstTask.dueDate).diff(dayjs(secondTask.dueDate)))[0];
    }, [tasks]);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleDownload = () => {
        if (currentDocument?.contentUrl) {
            window.open(currentDocument.contentUrl, '_blank', 'noopener,noreferrer');
            return;
        }

        messageApi.info(t('intern_dashboard.download_msg', { file: currentDocument?.title || activeProgramLabel }));
    };

    const handleOpenQuiz = (moduleId?: string, quizId?: string) => {
        if (!moduleId || !quizId) {
            messageApi.info('Hoc phan hien tai chua co bai kiem tra.');
            return;
        }

        navigate(RouteConfig.InternTest.getPath(String(quizId), String(moduleId)));
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
                    color: '#64748B',
                    fontSize: '14px'
                }}
            >
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    {t('menu.dashboard')}
                </span>
                <RightOutlined style={{ fontSize: '10px' }} />
                <span style={{ cursor: 'pointer' }}>{t('intern_dashboard.breadcrumb_program')}</span>
                <RightOutlined style={{ fontSize: '10px' }} />
                <span style={{ color: '#1E40AF', fontWeight: 600 }}>{activeProgramLabel}</span>
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
                            color: '#1E40AF',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                        }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                background: '#1E40AF',
                                borderRadius: '50%',
                                marginRight: '8px'
                            }}
                        ></span>
                        {t('intern_dashboard.current_track')}
                    </Tag>
                    <Title level={1} style={{ margin: '0 0 8px 0' }}>
                        {learningPath?.title || intern?.track || '-'}
                    </Title>
                    <Text type='secondary' style={{ fontSize: '16px', maxWidth: '600px', display: 'block' }}>
                        {activeProgramDescription}
                    </Text>
                    <div style={{ marginTop: '24px', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text strong>{t('intern_dashboard.overall_progress')}</Text>
                            <Text strong color='#1E40AF'>
                                {progressData?.overallProgress ?? intern?.overallProgress ?? 0}%
                            </Text>
                        </div>
                        <Progress
                            percent={progressData?.overallProgress ?? intern?.overallProgress ?? 0}
                            showInfo={false}
                            strokeColor={{
                                '0%': '#1E40AF',
                                '100%': '#0D9488'
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Button
                        icon={<DownloadOutlined />}
                        size='large'
                        onClick={handleDownload}
                    >
                        {currentDocument?.title || t('intern_dashboard.syllabus')}
                    </Button>
                    <Button
                        icon={<CalendarOutlined />}
                        size='large'
                        type='primary'
                        style={{ background: '#1E293B' }}
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
                                                    ? '#10B981'
                                                    : module.status === 'In Progress'
                                                        ? '#1E40AF'
                                                        : '#E2E8F0',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: module.status === 'Locked' ? '#bfbfbf' : '#fff',
                                            boxShadow: module.status === 'In Progress' ? '0 0 0 4px #e6f7ff' : 'none',
                                            border: module.status === 'Locked' ? '2px solid #E2E8F0' : 'none'
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
                                                    : '1px solid #E2E8F0',
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
                                            <div style={{ height: '4px', background: '#E2E8F0', width: '100%' }}>
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        background: '#1E40AF',
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
                                                                    ? '#10B981'
                                                                    : module.status === 'In Progress'
                                                                        ? '#1E40AF'
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
                                                        Module {module.sequence}: {module.title}
                                                     </Title>
                                                    <Text type='secondary'>{module.description}</Text>
                                                </div>
                                                {module.status === 'In Progress' && (
                                                    <Button
                                                        type='primary'
                                                        icon={<ArrowRightOutlined />}
                                                        style={{ background: '#1E40AF' }}
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
                                                                border: '1px solid #E2E8F0',
                                                                background:
                                                                    task.status?.toLowerCase() === 'in_progress'
                                                                        ? '#e6f7ff'
                                                                        : '#fff',
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
                                                                            ? '#10B981'
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
                                                                                task.status?.toLowerCase() ===
                                                                                'in_progress'
                                                                                    ? '#1E40AF'
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
                                                <Button type='link' style={{ padding: 0 }} onClick={() => handleNavigation(module.title)}>
                                                    {t('intern_dashboard.review_materials')}
                                                </Button>
                                            )}

                                            {(module.status === 'Ready' || module.status === 'In Progress') && (
                                                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                                        <div>
                                                            <Text strong style={{ display: 'block' }}><FireOutlined style={{ color: '#F59E0B', marginRight: '8px' }} />Bài tập & Kiểm tra</Text>
                                                            <Text type='secondary' style={{ fontSize: '13px' }}>Hoàn thành bài tập/quiz để kết thúc bài học</Text>
                                                        </div>
                                                        <Space>
                                                            <Button icon={<DownloadOutlined style={{ transform: 'rotate(180deg)' }} />} onClick={() => messageApi.success('Nộp bài tập thành công!')}>
                                                                Nộp bài tập
                                                            </Button>
                                                            <Button
                                                                type='primary'
                                                                onClick={() => handleOpenQuiz(module.id, module.quizzes?.[0]?.id)}
                                                                disabled={!module.quizzes?.length}
                                                            >
                                                                Làm bài kiểm tra
                                                            </Button>
                                                        </Space>
                                                    </div>
                                                </div>
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
                                            background: '#E2E8F0',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#bfbfbf',
                                            border: '2px solid #E2E8F0'
                                        }}
                                    >
                                        <TrophyOutlined style={{ fontSize: '20px' }} />
                                    </div>
                                ),
                                children: (
                                    <Card
                                        variant='borderless'
                                        style={{ borderRadius: '12px', border: '1px dashed #E2E8F0', opacity: 0.5 }}
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
                                    background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
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

                        <Card variant='borderless' style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Avatar
                                    size={48}
                                    src={intern?.mentorAvatar || `https://i.pravatar.cc/150?u=${intern?.mentorId}`}
                                />
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block' }}>
                                        {intern?.mentor?.fullName || t('internship.mentor')}
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
