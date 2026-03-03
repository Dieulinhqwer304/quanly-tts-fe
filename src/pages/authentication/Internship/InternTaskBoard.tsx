import {
    CalendarOutlined,
    CheckSquareOutlined,
    CloseOutlined,
    CloudUploadOutlined,
    FilterOutlined,
    FlagOutlined,
    LinkOutlined,
    MessageOutlined,
    MoreOutlined,
    UploadOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Divider,
    Input,
    Layout,
    Select,
    Space,
    Tag,
    Typography,
    Upload,
    message,
    Spin,
    Empty
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
import { Task } from '../../../services/Internship/tasks';
import { useResponsive } from '../../../hooks/useResponsive';
import dayjs from 'dayjs';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

export const InternTaskBoard = () => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [comment, setComment] = useState('');

    const [internData, setInternData] = useState<any>(null);
    const [tasksData, setTasksData] = useState<any>(null);
    const [isLoadingIntern, setIsLoadingIntern] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [isMutating, setIsMutating] = useState(false);

    const fetchTasks = async (id: string) => {
        setIsLoadingTasks(true);
        try {
            const res = await http.get('/tasks', { params: { internId: id } });
            setTasksData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingTasks(false);
        }
    };

    useEffect(() => {
        const fetchIntern = async () => {
            setIsLoadingIntern(true);
            try {
                const res = await http.get('/interns/me');
                setInternData(res);
                if (res?.data?.id) {
                    fetchTasks(res.data.id);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingIntern(false);
            }
        };
        fetchIntern();
    }, []);

    const intern = internData?.data;
    const internId = intern?.id;
    const tasks = tasksData?.data?.hits || [];

    const moveTask = async (task: Task, newStatus: Task['status']) => {
        setIsMutating(true);
        try {
            await http.patch(`/tasks/${task.id}`, { status: newStatus });
            message.success(t('common.success'));
            if (internId) fetchTasks(internId);
            if (selectedTask?.id === task.id) {
                setSelectedTask({ ...selectedTask, status: newStatus });
            }
        } catch {
            message.error(t('common.error'));
        } finally {
            setIsMutating(false);
        }
    };

    const renderTaskCard = (task: Task) => (
        <Card
            key={task.id}
            hoverable
            style={{
                marginBottom: '12px',
                borderRadius: '12px',
                border: selectedTask?.id === task.id ? '2px solid #136dec' : '1px solid #f0f0f0',
                cursor: 'pointer'
            }}
            bodyStyle={{ padding: '16px' }}
            onClick={() => setSelectedTask(task)}
            actions={[
                <Button
                    type='text'
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task, 'to_do');
                    }}
                    disabled={task.status?.toLowerCase() === 'to_do'}
                >
                    {t('task_mgmt.to_do')}
                </Button>,
                <Button
                    type='text'
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task, 'in_progress');
                    }}
                    disabled={task.status?.toLowerCase() === 'in_progress'}
                >
                    {t('task_mgmt.in_progress')}
                </Button>,
                <Button
                    type='text'
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task, 'completed');
                    }}
                    disabled={task.status?.toLowerCase() === 'completed'}
                >
                    {t('task_mgmt.completed')}
                </Button>
            ]}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Tag
                    color={
                        task.priority?.toLowerCase() === 'high'
                            ? 'volcano'
                            : task.priority?.toLowerCase() === 'medium'
                              ? 'gold'
                              : 'blue'
                    }
                >
                    {t(`task_mgmt.${task.priority?.toLowerCase()}`)}
                </Tag>
                <MoreOutlined style={{ color: '#8c8c8c' }} />
            </div>
            <div style={{ fontWeight: 600, marginBottom: '8px', color: '#1f2937' }}>{task.title}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                    <CalendarOutlined /> {task.dueDate}
                </div>
                <Avatar size='small' src={task.internAvatar} />
            </div>
        </Card>
    );

    if (isLoadingTasks || isLoadingIntern) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <Spin size='large' />
            </div>
        );
    }

    return (
        <Layout style={{ height: 'calc(100vh - 64px)', background: '#f6f7f8' }}>
            <Content
                style={{
                    padding: isMobile ? '12px' : isLaptop ? '18px' : '24px',
                    overflowY: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ marginBottom: '24px' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '8px'
                        }}
                    >
                        <span>{t('intern_task_board.breadcrumb_phase')}</span>{' '}
                        <span style={{ fontSize: '10px' }}>▶</span>{' '}
                        <span>{t('intern_task_board.breadcrumb_project')}</span>{' '}
                        <span style={{ fontSize: '10px' }}>▶</span>{' '}
                        <span style={{ color: '#111827', fontWeight: 500 }}>{t('menu.task_board')}</span>
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
                        <div>
                            <Title level={2} style={{ margin: 0 }}>
                                {t('intern_task_board.title')}
                            </Title>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#6b7280',
                                    marginTop: '4px'
                                }}
                            >
                                <UserOutlined /> {t('intern_task_board.mentor_label')}:{' '}
                                {intern?.mentor?.fullName || 'N/A'}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '24px',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? '10px' : 0
                        }}
                    >
                        <Space wrap>
                            <Button
                                type='text'
                                style={{ background: '#fff', fontWeight: 500 }}
                                icon={<CheckSquareOutlined />}
                            >
                                {t('intern_task_board.kanban_board')}
                            </Button>
                        </Space>
                        <Space wrap>
                            <Select
                                defaultValue={t('intern_task_board.all_priorities')}
                                style={{ width: 140 }}
                                bordered={false}
                                className='bg-white rounded-lg border border-gray-200'
                            />
                            <Button icon={<FilterOutlined />}>{t('common.more_filters')}</Button>
                        </Space>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', height: '100%', paddingBottom: '12px' }}>
                    <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                padding: '0 4px'
                            }}
                        >
                            <div style={{ fontWeight: 600, color: '#374151' }}>
                                {t('task_mgmt.to_do')}{' '}
                                <Tag style={{ marginLeft: '8px', borderRadius: '12px' }}>
                                    {tasks.filter((t) => t.status?.toLowerCase() === 'to_do').length}
                                </Tag>
                            </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                            {tasks.filter((t) => t.status?.toLowerCase() === 'to_do').map(renderTaskCard)}
                            {tasks.filter((t) => t.status?.toLowerCase() === 'to_do').length === 0 && (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={t('intern_task_board.no_tasks')}
                                />
                            )}
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                padding: '0 4px'
                            }}
                        >
                            <div style={{ fontWeight: 600, color: '#374151' }}>
                                {t('task_mgmt.in_progress')}{' '}
                                <Tag color='blue' style={{ marginLeft: '8px', borderRadius: '12px' }}>
                                    {
                                        tasks.filter(
                                            (t) =>
                                                t.status?.toLowerCase() === 'in_progress' ||
                                                t.status?.toLowerCase() === 'under_review'
                                        ).length
                                    }
                                </Tag>
                            </div>
                        </div>
                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                paddingRight: '8px',
                                background: 'rgba(243, 244, 246, 0.5)',
                                borderRadius: '12px',
                                padding: '12px',
                                border: '2px dashed #e5e7eb'
                            }}
                        >
                            {tasks
                                .filter(
                                    (t) =>
                                        t.status?.toLowerCase() === 'in_progress' ||
                                        t.status?.toLowerCase() === 'under_review'
                                )
                                .map(renderTaskCard)}
                            {tasks.filter(
                                (t) =>
                                    t.status?.toLowerCase() === 'in_progress' ||
                                    t.status?.toLowerCase() === 'under_review'
                            ).length === 0 && (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={t('intern_task_board.no_tasks_in_progress')}
                                />
                            )}
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                padding: '0 4px'
                            }}
                        >
                            <div style={{ fontWeight: 600, color: '#374151' }}>
                                {t('task_mgmt.completed')}{' '}
                                <Tag color='green' style={{ marginLeft: '8px', borderRadius: '12px' }}>
                                    {tasks.filter((t) => t.status?.toLowerCase() === 'completed').length}
                                </Tag>
                            </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', opacity: 0.7 }}>
                            {tasks.filter((t) => t.status?.toLowerCase() === 'completed').map(renderTaskCard)}
                            {tasks.filter((t) => t.status?.toLowerCase() === 'completed').length === 0 && (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={t('intern_task_board.no_completed_tasks')}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Content>

            {selectedTask && (
                <Sider
                    width={isMobile ? '100%' : 400}
                    theme='light'
                    style={{
                        borderLeft: isMobile ? 'none' : '1px solid #e5e7eb',
                        borderTop: isMobile ? '1px solid #e5e7eb' : 'none',
                        overflowY: 'auto'
                    }}
                >
                    <div
                        style={{
                            padding: '24px',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start'
                        }}
                    >
                        <div>
                            <Text
                                type='secondary'
                                style={{
                                    fontSize: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 700,
                                    display: 'block',
                                    marginBottom: '4px'
                                }}
                            >
                                {t('intern_task_board.selected_task')}
                            </Text>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div
                                    style={{ width: '8px', height: '8px', background: '#136dec', borderRadius: '50%' }}
                                ></div>
                                <span style={{ fontWeight: 500 }}>
                                    {t(
                                        `task_mgmt.${selectedTask.status
                                            .toLowerCase()
                                            .replace(' ', '_')
                                            .replace('completed', 'completed')}`
                                    )}
                                </span>
                            </div>
                        </div>
                        <Button type='text' icon={<CloseOutlined />} onClick={() => setSelectedTask(null)} />
                    </div>

                    <div style={{ padding: '24px' }}>
                        <Title level={3} style={{ marginTop: 0, marginBottom: '16px' }}>
                            {selectedTask.title}
                        </Title>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <Tag color='orange' icon={<FlagOutlined />}>
                                {t('task_mgmt.priority')}: {t(`task_mgmt.${selectedTask.priority.toLowerCase()}`)}
                            </Tag>
                            <Tag icon={<CalendarOutlined />}>
                                {t('intern_dashboard.due')}: {selectedTask.dueDate}
                            </Tag>
                        </div>

                        <Paragraph type='secondary' style={{ marginBottom: '24px' }}>
                            {selectedTask.description}
                        </Paragraph>

                        <Divider />

                        <div style={{ marginBottom: '24px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 700,
                                    marginBottom: '12px'
                                }}
                            >
                                <UploadOutlined style={{ color: '#136dec' }} />{' '}
                                {t('intern_task_board.submit_deliverable')}
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <Text
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: '#6b7280',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}
                                >
                                    {t('intern_task_board.repo_link')}
                                </Text>
                                <Input
                                    prefix={<LinkOutlined style={{ color: '#9ca3af' }} />}
                                    placeholder='https://github.com/company/repo/pull/123'
                                />
                            </div>

                            <Upload.Dragger
                                style={{
                                    padding: '16px',
                                    background: '#f9fafb',
                                    border: '2px dashed #e5e7eb',
                                    marginBottom: '12px'
                                }}
                            >
                                <p className='ant-upload-drag-icon' style={{ marginBottom: '8px' }}>
                                    <CloudUploadOutlined style={{ fontSize: '24px', color: '#9ca3af' }} />
                                </p>
                                <p className='ant-upload-text' style={{ fontSize: '12px' }}>
                                    {t('intern_task_board.upload_report')}
                                </p>
                            </Upload.Dragger>

                            <Button
                                type='primary'
                                block
                                onClick={async () => {
                                    await moveTask(selectedTask, 'under_review');
                                    if (internId) fetchTasks(internId);
                                }}
                                loading={isMutating}
                            >
                                {t('intern_task_board.submit_for_review')}
                            </Button>
                        </div>

                        <Divider />

                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 700,
                                    marginBottom: '16px'
                                }}
                            >
                                <MessageOutlined style={{ color: '#722ed1' }} />{' '}
                                {t('intern_task_board.mentor_feedback')}
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <Input.TextArea
                                    placeholder={t('common.write_a_reply')}
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    style={{ marginBottom: '8px' }}
                                />
                                <Button
                                    type='primary'
                                    size='small'
                                    disabled={!comment.trim()}
                                    onClick={async () => {
                                        setIsMutating(true);
                                        try {
                                            await http.post(`/tasks/${selectedTask.id}/comments`, { comment });
                                            message.success(t('common.success'));
                                            setComment('');
                                            if (internId) fetchTasks(internId);
                                        } catch {
                                            message.error(t('common.error'));
                                        } finally {
                                            setIsMutating(false);
                                        }
                                    }}
                                    loading={isMutating}
                                >
                                    {t('common.send')}
                                </Button>
                            </div>

                            {selectedTask.comments?.map((c) => (
                                <div key={c.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <Avatar src={c.user?.avatarUrl || `https://i.pravatar.cc/150?u=${c.userId}`} />
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                background: '#f3f4f6',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                borderTopLeftRadius: '0'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '4px'
                                                }}
                                            >
                                                <Text strong style={{ fontSize: '12px' }}>
                                                    {c.user?.fullName}
                                                </Text>
                                                <Text type='secondary' style={{ fontSize: '10px' }}>
                                                    {dayjs(c.createdAt).fromNow()}
                                                </Text>
                                            </div>
                                            <Text style={{ fontSize: '13px', color: '#4b5563' }}>{c.comment}</Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Sider>
            )}
        </Layout>
    );
};
