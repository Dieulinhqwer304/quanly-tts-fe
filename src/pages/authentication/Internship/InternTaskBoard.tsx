import {
    CalendarOutlined,
    CheckSquareOutlined,
    CloseOutlined,
    CloudUploadOutlined,
    FlagOutlined,
    LinkOutlined,
    MoreOutlined,
    PaperClipOutlined,
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
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
import { Task } from '../../../services/Internship/tasks';
import { useResponsive } from '../../../hooks/useResponsive';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const attachmentButtonStyle = {
    width: '100%',
    height: 'auto',
    padding: 0,
    justifyContent: 'flex-start',
    whiteSpace: 'normal' as const,
    wordBreak: 'break-all' as const,
    textAlign: 'left' as const,
};
const getAttachmentLabel = (attachment: string) => {
    try {
        const parsedUrl = new URL(attachment);
        const normalizedPath = decodeURIComponent(parsedUrl.pathname || '');
        const lastSegment = normalizedPath.split('/').filter(Boolean).pop();

        if (lastSegment) {
            return lastSegment;
        }

        return parsedUrl.hostname.replace(/^www\./, '') || attachment;
    } catch {
        return attachment;
    }
};

export const InternTaskBoard = () => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [repoLink, setRepoLink] = useState('');
    const [submissionFileList, setSubmissionFileList] = useState<UploadFile[]>([]);

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
                const res = await http.get<{ id?: string; mentor?: { fullName?: string } }>('/interns/me');
                setInternData(res);
                if (res?.id) {
                    fetchTasks(res.id);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingIntern(false);
            }
        };
        fetchIntern();
    }, []);

    const intern = internData;
    const internId = intern?.id;
    const tasks = tasksData?.data || [];
    const submittedComments = (selectedTask?.comments || []).filter(
        (commentItem) =>
            Boolean(commentItem.attachments?.length) ||
            /^https?:\/\//i.test(String(commentItem.comment || '').trim()) ||
            String(commentItem.comment || '').trim() === 'Nộp tài liệu công việc',
    );
    const activeTasks = tasks.filter(
        (task) =>
            task.status?.toLowerCase() === 'in_progress' ||
            task.status?.toLowerCase() === 'under_review' ||
            task.status?.toLowerCase() === 'need_rework',
    );

    const uploadTaskFile = async (file: File): Promise<string> => {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const uploadResult = await http.post<{ fileName?: string; data?: { fileName?: string } }>(
            '/storage/upload',
            uploadFormData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
        );
        const fileName = uploadResult?.fileName || uploadResult?.data?.fileName;
        if (!fileName) {
            throw new Error('Upload tài liệu thất bại');
        }

        const urlResult = await http.get<{ url?: string; data?: { url?: string } }>(
            `/storage/url/${encodeURIComponent(fileName)}`,
        );
        return urlResult?.url || urlResult?.data?.url || fileName;
    };

    const loadTaskDetail = async (task: Task) => {
        setSelectedTask(task);
        setIsMutating(true);
        try {
            const detail = await http.get<Task>(`/tasks/${task.id}`);
            setSelectedTask(detail);
        } catch {
            message.error(t('common.error'));
        } finally {
            setIsMutating(false);
        }
    };

    const moveTask = async (task: Task, newStatus: Task['status']) => {
        setIsMutating(true);
        try {
            await http.patch(`/tasks/${task.id}/status`, { status: newStatus });
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

    useEffect(() => {
        setRepoLink('');
        setSubmissionFileList([]);
    }, [selectedTask?.id]);

    const renderTaskCard = (task: Task) => (
        <Card
            key={task.id}
            hoverable
            style={{
                marginBottom: '12px',
                borderRadius: '12px',
                border: selectedTask?.id === task.id ? '2px solid #1E40AF' : '1px solid #E2E8F0',
                cursor: 'pointer'
            }}
            bodyStyle={{ padding: '16px' }}
            onClick={() => loadTaskDetail(task)}
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
            <div style={{ fontWeight: 600, marginBottom: '8px', color: '#1E293B' }}>{task.title}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748B' }}>
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
                                    color: '#64748B',
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
                            <div style={{ fontWeight: 600, color: '#1E293B' }}>
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
                            <div style={{ fontWeight: 600, color: '#1E293B' }}>
                                {t('task_mgmt.in_progress')}{' '}
                                <Tag color='blue' style={{ marginLeft: '8px', borderRadius: '12px' }}>
                                    {
                                        activeTasks.length
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
                                border: '2px dashed #E2E8F0'
                            }}
                        >
                            {activeTasks.map(renderTaskCard)}
                            {activeTasks.length === 0 && (
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
                            <div style={{ fontWeight: 600, color: '#1E293B' }}>
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
                        borderLeft: isMobile ? 'none' : '1px solid #E2E8F0',
                        borderTop: isMobile ? '1px solid #E2E8F0' : 'none',
                        overflowY: 'auto'
                    }}
                >
                    <div
                        style={{
                            padding: '24px',
                            borderBottom: '1px solid #E2E8F0',
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
                                    style={{ width: '8px', height: '8px', background: '#1E40AF', borderRadius: '50%' }}
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

                        {selectedTask.revisionRequest ? (
                            <>
                                <Divider />
                                <Card size='small' style={{ marginBottom: '24px', borderColor: '#faad14', background: '#fffbe6' }}>
                                    <Space direction='vertical' style={{ width: '100%' }} size={6}>
                                        <Text strong>{t('task_mgmt.revision_request')}</Text>
                                        <Text style={{ whiteSpace: 'pre-wrap' }}>{selectedTask.revisionRequest}</Text>
                                    </Space>
                                </Card>
                            </>
                        ) : null}

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
                                <PaperClipOutlined style={{ color: '#1E40AF' }} /> Tài liệu được giao
                            </div>
                            {selectedTask.attachments?.length ? (
                                <Space direction='vertical' style={{ width: '100%' }}>
                                    {selectedTask.attachments.map((attachment, index) => (
                                        <Button
                                            key={`${attachment}-${index}`}
                                            type='link'
                                            style={attachmentButtonStyle}
                                            onClick={() => window.open(attachment, '_blank', 'noopener,noreferrer')}
                                        >
                                            {getAttachmentLabel(attachment)}
                                        </Button>
                                    ))}
                                </Space>
                            ) : (
                                <Text type='secondary'>Task này chưa có tài liệu đính kèm.</Text>
                            )}
                        </div>

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
                                <UploadOutlined style={{ color: '#1E40AF' }} />{' '}
                                {t('intern_task_board.submit_deliverable')}
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <Text
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: '#64748B',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}
                                >
                                    {t('intern_task_board.repo_link')}
                                </Text>
                                <Input
                                    prefix={<LinkOutlined style={{ color: '#9ca3af' }} />}
                                    placeholder='https://github.com/company/repo/pull/123'
                                    value={repoLink}
                                    onChange={(event) => setRepoLink(event.target.value)}
                                />
                            </div>

                            <Upload.Dragger
                                style={{
                                    padding: '16px',
                                    background: '#F8FAFC',
                                    border: '2px dashed #E2E8F0',
                                    marginBottom: '12px'
                                }}
                                beforeUpload={() => false}
                                multiple
                                fileList={submissionFileList}
                                onChange={({ fileList }) => setSubmissionFileList(fileList)}
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
                                    if (!repoLink.trim() && submissionFileList.length === 0) {
                                        message.warning('Vui lòng nhập link hoặc upload tài liệu trước khi nộp.');
                                        return;
                                    }

                                    setIsMutating(true);
                                    try {
                                        const currentTaskId = selectedTask.id;
                                        const uploadedAttachmentUrls = await Promise.all(
                                            submissionFileList
                                                .map((fileItem) => fileItem.originFileObj)
                                                .filter(Boolean)
                                                .map((file) => uploadTaskFile(file as File)),
                                        );
                                        const attachments = Array.from(new Set(uploadedAttachmentUrls));
                                        await http.post(`/tasks/${selectedTask.id}/comments`, {
                                            content: repoLink.trim() || 'Nộp tài liệu công việc',
                                            attachments,
                                        });
                                        await http.patch(`/tasks/${selectedTask.id}/status`, { status: 'under_review' });
                                        const refreshedTask = await http.get<Task>(`/tasks/${currentTaskId}`);
                                        message.success(t('common.success'));
                                        setRepoLink('');
                                        setSubmissionFileList([]);
                                        setSelectedTask(refreshedTask);
                                        if (internId) {
                                            await fetchTasks(internId);
                                        }
                                    } catch {
                                        message.error(t('common.error'));
                                    } finally {
                                        setIsMutating(false);
                                    }
                                }}
                                loading={isMutating}
                            >
                                {t('intern_task_board.submit_for_review')}
                            </Button>
                        </div>

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
                                <PaperClipOutlined style={{ color: '#1E40AF' }} /> Sản phẩm đã nộp
                            </div>
                            {submittedComments.length ? (
                                <Space direction='vertical' style={{ width: '100%' }} size={12}>
                                    {submittedComments.map((commentItem) => (
                                        <Card key={commentItem.id} size='small'>
                                            <Space direction='vertical' style={{ width: '100%' }} size={6}>
                                                <Text style={{ wordBreak: 'break-all' }}>{commentItem.comment}</Text>
                                                {commentItem.attachments?.length ? (
                                                    commentItem.attachments.map((attachment, index) => (
                                                        <Button
                                                            key={`${attachment}-${index}`}
                                                            type='link'
                                                            style={attachmentButtonStyle}
                                                            onClick={() =>
                                                                window.open(attachment, '_blank', 'noopener,noreferrer')
                                                            }
                                                        >
                                                            {getAttachmentLabel(attachment)}
                                                        </Button>
                                                    ))
                                                ) : null}
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            ) : (
                                <Text type='secondary'>Bạn chưa nộp sản phẩm cho task này.</Text>
                            )}
                        </div>
                    </div>
                </Sider>
            )}
        </Layout>
    );
};
