import {
    CalendarOutlined,
    EditOutlined,
    MailOutlined,
    SaveOutlined,
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
    Input,
    Layout,
    List,
    Row,
    Space,
    Tag,
    TimePicker,
    Typography,
    message,
    Skeleton,
    Tabs,
    Select,
    Badge,
    InputNumber
} from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { Content } = Layout;

interface StatusSummary {
    total: number;
    pending_review: number;
    cv_dat: number;
    interview_scheduled: number;
    offer: number;
    rejected_cv: number;
    rejected_interview: number;
    [key: string]: number;
}

interface ICandidate {
    id: string;
    fullName?: string;
    name?: string;
    email: string;
    avatarUrl?: string;
    avatar?: string;
    job?: { id?: string; title?: string };
    jobId?: string;
    appliedForTitle?: string;
    matchScore?: number;
    status?: string;
    [key: string]: unknown;
}

interface CandidateListResponse {
    hits?: ICandidate[];
    data?: ICandidate[];
}

interface DirectMailSendResult {
    total: number;
    success: number;
    failed: number;
    details?: Array<{
        email: string;
        status: 'sent' | 'failed';
        error?: string;
    }>;
}

const TABS = [
    { key: 'all', labelKey: 'candidate.tab_all', summaryKey: 'total' },
    { key: 'pending_review', labelKey: 'candidate.tab_new_cv', summaryKey: 'pending_review' },
    { key: 'cv_dat', labelKey: 'candidate.tab_cv_dat', summaryKey: 'cv_dat' },
    { key: 'interview_scheduled', labelKey: 'candidate.tab_interview', summaryKey: 'interview_scheduled' },
    { key: 'offer', labelKey: 'candidate.tab_offer', summaryKey: 'offer' },
    { key: 'rejected_cv', labelKey: 'candidate.tab_reject_cv', summaryKey: 'rejected_cv' },
    { key: 'rejected_interview', labelKey: 'candidate.tab_reject_pv', summaryKey: 'rejected_interview' }
];

const TEMPLATES = {
    interview: {
        id: 'interview',
        label: 'interview.template_interview',
        subject: 'Thư mời Phỏng vấn - {Role}',
        body: `
<p>Kính gửi {Candidate_Name},</p>
<p>Cảm ơn bạn đã quan tâm đến vị trí <strong>{Role}</strong> tại <strong>SV Technologies JSC</strong>.</p>
<p>Chúng tôi xin trân trọng mời bạn tham dự buổi phỏng vấn với thông tin chi tiết như sau:</p>
<div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E2E8F0;">
    <p style="margin-bottom: 8px;">1. Vị trí: <strong>{Role}</strong></p>
    <p style="margin-bottom: 8px;">2. Phòng ban: <strong>{Department}</strong></p>
    <div style="margin-top: 16px;">
        <p>3. Thời gian phỏng vấn:</p>
        <p style="padding-left: 20px; margin-top: 8px;">Ngày: <strong>{Interview_Date}</strong></p>
        <p style="padding-left: 20px;">Giờ bắt đầu: <strong>{Interview_Time}</strong></p>
    </div>
</div>
<p>Vui lòng xem xét và xác nhận khả năng tham dự bằng cách phản hồi lại email này.</p>
<p>Trân trọng,<br/><strong>Nhóm Tuyển dụng</strong></p>
        `
    },
    rejection: {
        id: 'rejection',
        label: 'interview.template_rejection',
        subject: 'Kết quả ứng tuyển - {Role}',
        body: `
<p>Kính gửi {Candidate_Name},</p>
<p>Cảm ơn bạn đã quan tâm và dành thời gian ứng tuyển cho vị trí <strong>{Role}</strong> tại <strong>SV Technologies JSC</strong>.</p>
<p>Chúng tôi đánh giá cao những kỹ năng và kinh nghiệm của bạn. Tuy nhiên, sau quá trình xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng ở thời điểm hiện tại, chúng tôi đã quyết định chọn các ứng viên khác phù hợp hơn với yêu cầu đặc thù của công việc này.</p>
<p>Hồ sơ của bạn sẽ được lưu giữ trong hệ thống và chúng tôi có thể liên hệ lại nếu có vị trí phù hợp trong tương lai.</p>
<p>Chúc bạn nhiều thành công trong sự nghiệp!</p>
<p>Trân trọng,<br/><strong>Nhóm Tuyển dụng</strong></p>
        `
    },
    meeting: {
        id: 'meeting',
        label: 'interview.template_meeting',
        subject: 'Lịch họp trao đổi - {Role}',
        body: `
<p>Kính gửi {Candidate_Name},</p>
<p>Chúng tôi muốn sắp xếp một buổi trao đổi ngắn về cơ hội hợp tác tại vị trí <strong>{Role}</strong>.</p>
<div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E2E8F0;">
    <p style="margin-bottom: 8px;">1. Nội dung trao đổi: <strong>{Role}</strong></p>
    <p style="margin-bottom: 8px;">2. Phòng ban: <strong>{Department}</strong></p>
    <div style="margin-top: 16px;">
        <p>3. Thời gian họp:</p>
        <p style="padding-left: 20px; margin-top: 8px;">Ngày: <strong>{Interview_Date}</strong></p>
        <p style="padding-left: 20px;">Giờ bắt đầu: <strong>{Interview_Time}</strong></p>
    </div>
</div>
<p>Trân trọng,<br/><strong>Nhóm Tuyển dụng</strong></p>
        `
    }
};

export const InterviewSchedule = () => {
    const { t } = useTranslation();
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>('interview');
    const [emailSubject, setEmailSubject] = useState(TEMPLATES['interview'].subject);
    const [emailHtml, setEmailHtml] = useState(TEMPLATES['interview'].body);
    const [isEditing, setIsEditing] = useState(false);

    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
    const [date, setDate] = useState<Dayjs | null>(null);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [intervalMinutes, setIntervalMinutes] = useState<number>(30);
    const [format, setFormat] = useState('online');
    const [locationLink, setLocationLink] = useState('https://meet.google.com/abc-defg-hij');

    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const [candidatesData, setCandidatesData] = useState<CandidateListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [summary, setSummary] = useState<StatusSummary>({
        total: 0,
        pending_review: 0,
        cv_dat: 0,
        interview_scheduled: 0,
        offer: 0,
        rejected_cv: 0,
        rejected_interview: 0
    });

    const fetchSummary = async () => {
        try {
            const res = await http.get('/candidates/summary');
            setSummary(res as StatusSummary);
        } catch {
            // non-blocking
        }
    };

    const fetchCandidates = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string> = {};
            if (searchText.trim()) params.q = searchText.trim();
            if (activeTab !== 'all') {
                params.status = activeTab;
            }
            params.page = '1';
            params.pageSize = '200';
            const res = await http.get<CandidateListResponse>('/candidates', { params });
            setCandidatesData(res);
        } catch {
            message.error('Không thể tải danh sách ứng viên');
        } finally {
            setIsLoading(false);
        }
    }, [searchText, activeTab]);

    useEffect(() => {
        fetchSummary();
    }, []);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const handleTemplateChange = (val: keyof typeof TEMPLATES) => {
        setSelectedTemplate(val);
        setEmailSubject(TEMPLATES[val].subject);
        setEmailHtml(TEMPLATES[val].body);
        setIsEditing(false);
    };

    const handleResetTemplate = () => {
        setEmailSubject(TEMPLATES[selectedTemplate].subject);
        setEmailHtml(TEMPLATES[selectedTemplate].body);
        setIsEditing(false);
    };

    const candidates: ICandidate[] = candidatesData?.hits || candidatesData?.data || [];
    const selectedVisibleCount = candidates.filter((candidate) => selectedCandidates.includes(candidate.id)).length;
    const isAllVisibleSelected = candidates.length > 0 && selectedVisibleCount === candidates.length;
    const isPartiallyVisibleSelected = selectedVisibleCount > 0 && selectedVisibleCount < candidates.length;

    const toggleCandidate = (id: string) => {
        setSelectedCandidates((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
    };
    const toggleAllVisibleCandidates = (checked: boolean) => {
        setSelectedCandidates(checked ? candidates.map((candidate) => candidate.id) : []);
    };

    const calculateInterviewTime = (index: number): string => {
        if (!startTime) return '';
        return startTime.clone().add(index * intervalMinutes, 'minute').format('HH:mm');
    };

    const handleSendInvites = async () => {
        if (selectedCandidates.length === 0) {
            message.warning('Vui lòng chọn ít nhất một ứng viên.');
            return;
        }

        const selectedCandsInfo = candidates.filter((c) => selectedCandidates.includes(c.id));

        if (selectedCandsInfo.length === 0) {
            message.warning('Không tìm thấy ứng viên hợp lệ để gửi. Vui lòng chọn lại danh sách ứng viên.');
            return;
        }

        try {
            setIsProcessing(true);
            message.loading({ content: 'Đang xử lý...', key: 'inviting' });

            const interviewDate = date ? date.format('DD/MM/YYYY') : '';
            const mailPayload = {
                subject: emailSubject,
                recipients: selectedCandsInfo.map((candidate: ICandidate, index) => {
                    const candidateName = String(candidate.fullName || candidate.name || '');
                    const role = String(candidate.job?.title || candidate.appliedForTitle || 'Vị trí ứng tuyển');
                    const jobMeta = (candidate.job || {}) as Record<string, unknown>;
                    const department = String(jobMeta.department || 'N/A');
                    const interviewTime = calculateInterviewTime(index);

                    return {
                        email: candidate.email,
                        fullName: candidateName,
                        htmlBody: emailHtml,
                        candidateName,
                        role,
                        department,
                        interviewDate,
                        interviewTime,
                        locationLink
                    };
                })
            };

            const mailResult = await http.post<DirectMailSendResult>('/recruitment/mail/send', mailPayload);
            const sentEmailSet = new Set(
                (mailResult?.details || [])
                    .filter((item) => item.status === 'sent')
                    .map((item) => item.email.toLowerCase())
            );
            const sentCandidates = selectedCandsInfo.filter((candidate) =>
                sentEmailSet.has(String(candidate.email || '').toLowerCase())
            );

            if (sentCandidates.length === 0) {
                message.error({ content: 'Không có email nào gửi thành công.', key: 'inviting' });
                return;
            }

            await Promise.all(
                sentCandidates.map((c: ICandidate) =>
                    http.patch(`/candidates/${c.id}`, {
                        status: 'interview_scheduled'
                    })
                )
            );

            if ((mailResult?.failed || 0) > 0) {
                message.warning({
                    content: `Đã gửi thành công ${mailResult.success}/${mailResult.total} email.`,
                    key: 'inviting'
                });
            } else {
                message.success({
                    content: `Đã gửi thành công ${mailResult.success} email và cập nhật trạng thái ứng viên.`,
                    key: 'inviting'
                });
            }
            setSelectedCandidates([]);
            fetchCandidates();
            fetchSummary();
        } catch {
            fetchCandidates();
            fetchSummary();
            message.error({ content: t('interview.send_failed'), key: 'inviting' });
        } finally {
            setIsProcessing(false);
        }
    };

    const tabItems = TABS.map((tab) => {
        const count = summary[tab.summaryKey] ?? 0;
        return {
            key: tab.key,
            label: (
                <span>
                    {t(tab.labelKey)}
                    {count > 0 && (
                        <Badge
                            count={count}
                            size='small'
                            style={{
                                marginLeft: 6,
                                backgroundColor: activeTab === tab.key ? '#1677ff' : '#d9d9d9',
                                color: activeTab === tab.key ? '#fff' : '#666'
                            }}
                        />
                    )}
                </span>
            )
        };
    });

    return (
        <Layout style={{ minHeight: '100vh', background: '#f6f7f8' }}>
            <Content style={{ padding: '24px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        {t('interview.schedule_title')}
                    </Title>
                </div>

                <Row gutter={24}>
                    <Col xs={24} lg={9}>
                        <Card
                            style={{ height: '100%', borderRadius: '12px' }}
                            bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '650px' }}
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{t('interview.queue')}</span>
                                    <Tag color='blue'>
                                        {selectedCandidates.length} {t('interview.selected')}
                                    </Tag>
                                </div>
                            }
                        >
                            <Tabs
                                activeKey={activeTab}
                                onChange={(value) => {
                                    setActiveTab(value);
                                    setSelectedCandidates([]);
                                }}
                                items={tabItems}
                                size='small'
                                tabBarStyle={{ padding: '0 12px', margin: 0 }}
                            />

                            <div style={{ padding: '12px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <Space direction='vertical' size={8} style={{ width: '100%' }}>
                                    <Input
                                        prefix={<SearchOutlined />}
                                        placeholder={t('candidate.search_placeholder')}
                                        onChange={(e) => {
                                            setSearchText(e.target.value);
                                            setSelectedCandidates([]);
                                        }}
                                    />
                                    <Checkbox
                                        checked={isAllVisibleSelected}
                                        indeterminate={isPartiallyVisibleSelected}
                                        disabled={candidates.length === 0}
                                        onChange={(e) => toggleAllVisibleCandidates(e.target.checked)}
                                    >
                                        {t('interview.select_all')}
                                    </Checkbox>
                                </Space>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                {isLoading ? (
                                    <div style={{ padding: '16px' }}>
                                        <Skeleton active />
                                    </div>
                                ) : (
                                    <List
                                        dataSource={candidates}
                                        renderItem={(item: ICandidate) => (
                                            <List.Item
                                                style={{
                                                    padding: '12px 16px',
                                                    cursor: 'pointer',
                                                    background: selectedCandidates.includes(item.id)
                                                        ? '#e6f7ff'
                                                        : 'transparent',
                                                    borderBottom: '1px solid #f0f0f0'
                                                }}
                                                onClick={() => toggleCandidate(item.id)}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <span
                                                        style={{ marginRight: '12px' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <Checkbox
                                                            checked={selectedCandidates.includes(item.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={() => toggleCandidate(item.id)}
                                                        />
                                                    </span>
                                                    <Avatar
                                                        src={item.avatarUrl || item.avatar}
                                                        style={{ marginRight: '12px' }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <Text strong style={{ display: 'block' }}>
                                                            {item.fullName || item.name}
                                                        </Text>
                                                        <Text type='secondary' style={{ fontSize: '12px' }}>
                                                            {item.job?.title || item.appliedForTitle || 'No Title'}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={15}>
                        <Card
                            style={{
                                borderRadius: '12px',
                                minHeight: '650px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        {t('interview.configure_send')}
                                    </Title>
                                </div>
                                <Space>
                                    <Select
                                        value={selectedTemplate}
                                        onChange={handleTemplateChange}
                                        style={{ width: 180 }}
                                        options={[
                                            { value: 'interview', label: t('interview.template_interview') },
                                            { value: 'rejection', label: t('interview.template_rejection') },
                                            { value: 'meeting', label: t('interview.template_meeting') }
                                        ]}
                                    />
                                </Space>
                            </div>

                            {(selectedTemplate === 'interview' || selectedTemplate === 'meeting') && (
                                <div
                                    style={{
                                        marginBottom: '24px',
                                        background: '#F8FAFC',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #E2E8F0'
                                    }}
                                >
                                    <Title
                                        level={5}
                                        style={{
                                            textTransform: 'uppercase',
                                            fontSize: '12px',
                                            color: '#1E40AF',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        <CalendarOutlined style={{ marginRight: '8px' }} /> {t('interview.details')}
                                    </Title>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Text strong>{t('interview.date')}</Text>
                                            <DatePicker
                                                style={{ width: '100%', marginTop: '8px' }}
                                                onChange={setDate}
                                                value={date}
                                                format='DD/MM/YYYY'
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Text strong>{t('interview.start_time')}</Text>
                                            <TimePicker
                                                style={{ width: '100%', marginTop: '8px' }}
                                                format='HH:mm'
                                                onChange={setStartTime}
                                                value={startTime}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Text strong>{t('interview.interval_minutes')}</Text>
                                            <InputNumber
                                                style={{ width: '100%', marginTop: '8px' }}
                                                min={5}
                                                max={180}
                                                value={intervalMinutes}
                                                onChange={(v) => setIntervalMinutes(v as number)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={16} style={{ marginTop: '16px' }}>
                                        <Col span={8}>
                                            <Text strong>{t('interview.format')}</Text>
                                            <div
                                                style={{
                                                    marginTop: '8px',
                                                    display: 'flex',
                                                    background: '#ecedf0',
                                                    padding: '4px',
                                                    borderRadius: '6px'
                                                }}
                                            >
                                                <Button
                                                    type={format === 'online' ? 'primary' : 'text'}
                                                    style={{ flex: 1, borderRadius: '4px' }}
                                                    size='small'
                                                    onClick={() => setFormat('online')}
                                                >
                                                    {t('interview.online')}
                                                </Button>
                                                <Button
                                                    type={format === 'in_person' ? 'primary' : 'text'}
                                                    style={{ flex: 1, borderRadius: '4px' }}
                                                    size='small'
                                                    onClick={() => setFormat('in_person')}
                                                >
                                                    {t('interview.in_person')}
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col span={16}>
                                            <Text strong>{t('interview.location_link')}</Text>
                                            <Input
                                                prefix={<VideoCameraOutlined style={{ color: '#bfbfbf' }} />}
                                                style={{ marginTop: '8px' }}
                                                value={locationLink}
                                                onChange={(e) => setLocationLink(e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                    <Title
                                        level={5}
                                        style={{
                                            textTransform: 'uppercase',
                                            fontSize: '12px',
                                            color: '#1E40AF',
                                            margin: 0
                                        }}
                                    >
                                        <MailOutlined style={{ marginRight: '8px' }} /> {t('interview.email_comm')}
                                    </Title>
                                </div>

                                <Row gutter={16} style={{ marginBottom: '16px' }}>
                                    <Col span={24}>
                                        <Text strong>{t('interview.subject')}</Text>
                                        <Input
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            style={{ marginTop: '8px' }}
                                        />
                                    </Col>
                                </Row>

                                <div
                                    style={{
                                        background: '#fff',
                                        border: '1px solid #dbe0e6',
                                        borderRadius: '8px',
                                        padding: '24px',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <div
                                        style={{
                                            borderBottom: '1px solid #E2E8F0',
                                            paddingBottom: '12px',
                                            marginBottom: '20px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Space>
                                            <Text
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    color: '#8c8c8c',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                {t('interview.preview')}
                                            </Text>
                                            <Tag color='processing'>HTML Format</Tag>
                                        </Space>
                                        <Space>
                                            <Button size='small' onClick={handleResetTemplate}>
                                                Khôi phục bản gốc
                                            </Button>
                                            <Button
                                                type={isEditing ? 'primary' : 'default'}
                                                size='small'
                                                icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                                                onClick={() => setIsEditing(!isEditing)}
                                            >
                                                {isEditing ? 'Xong' : 'Sửa thủ công'}
                                            </Button>
                                        </Space>
                                    </div>
                                    <div
                                        contentEditable={isEditing}
                                        onBlur={(e) => setEmailHtml(e.currentTarget.innerHTML)}
                                        dangerouslySetInnerHTML={{
                                            __html: emailHtml
                                        }}
                                        style={{
                                            flex: 1,
                                            fontSize: '14px',
                                            lineHeight: '1.8',
                                            color: '#262626',
                                            padding: isEditing ? '12px' : 0,
                                            border: isEditing ? '1px solid #1E40AF' : 'none',
                                            borderRadius: '8px',
                                            overflowY: 'auto',
                                            maxHeight: '300px',
                                            outline: 'none',
                                            background: isEditing ? '#fff' : 'transparent',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '12px',
                                    borderTop: '1px solid #E2E8F0',
                                    paddingTop: '16px'
                                }}
                            >
                                <Button size='large' onClick={() => setSelectedCandidates([])}>
                                    Hủy bỏ
                                </Button>
                                <Button
                                    type='primary'
                                    size='large'
                                    icon={<SendOutlined />}
                                    onClick={handleSendInvites}
                                    disabled={selectedCandidates.length === 0}
                                    loading={isProcessing}
                                    style={{ background: '#10b981', borderColor: '#10b981' }}
                                >
                                    {t('interview.schedule_send')} ({selectedCandidates.length})
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};
