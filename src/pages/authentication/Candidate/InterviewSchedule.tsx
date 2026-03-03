import {
    CalendarOutlined,
    ClockCircleOutlined,
    CopyOutlined,
    EditOutlined,
    FilterOutlined,
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
    message,
    Modal,
    Skeleton
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';

const { Title, Text } = Typography;
const { Content } = Layout;

export const InterviewSchedule = () => {
    const { t } = useTranslation();
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
    const [date, setDate] = useState<any>(null);
    const [timeRange, setTimeRange] = useState<any>(null);
    const [searchText, setSearchText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [emailHtml, setEmailHtml] = useState<string>(`
        <p>Dear {Candidate_Name},</p>
        <p>Thank you so much for your interest in the <strong>{Role}</strong> position at <strong>SV Technologies JSC</strong> and welcome you to become members of our family!</p>
        <p>We would like to send you the <strong>Offer for Trainee Period</strong> in detail:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #f0f0f0;">
            <p style="margin-bottom: 8px;">1. Position: <strong>{Role}</strong></p>
            <p style="margin-bottom: 8px;">2. Department: <strong>DnA</strong></p>
            <p style="margin-bottom: 8px;">3. Report to: <strong>Ms. Duong Thi Thuy Hong</strong></p>
            <div style="margin-top: 16px;">
                <p>4. Apprenticeship period:</p>
                <p style="padding-left: 20px; margin-top: 8px;">Start date: <strong>{Start_Date}</strong></p>
                <p style="padding-left: 20px;">Working time: <strong>Part-time. From Monday to Friday, and the first Saturday of the month.</strong></p>
            </div>
        </div>
        <p>Please have a look and give us feedback as soon as possible.</p>
        <p>If you have any questions, please contact me via the information below.</p>
        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 24px 0 16px;">
        <p style="color: #8c8c8c;">Best regards,</p>
        <p><strong>SV Technologies Recruitment Team</strong></p>
    `);

    const defaultTemplate = `
        <p>Dear {Candidate_Name},</p>
        <p>Thank you so much for your interest in the <strong>{Role}</strong> position at <strong>SV Technologies JSC</strong> and welcome you to become members of our family!</p>
        <p>We would like to send you the <strong>Offer for Trainee Period</strong> in detail:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #f0f0f0;">
            <p style="margin-bottom: 8px;">1. Position: <strong>{Role}</strong></p>
            <p style="margin-bottom: 8px;">2. Department: <strong>DnA</strong></p>
            <p style="margin-bottom: 8px;">3. Report to: <strong>Ms. Duong Thi Thuy Hong</strong></p>
            <div style="margin-top: 16px;">
                <p>4. Apprenticeship period:</p>
                <p style="padding-left: 20px; margin-top: 8px;">Start date: <strong>{Start_Date}</strong></p>
                <p style="padding-left: 20px;">Working time: <strong>Part-time. From Monday to Friday, and the first Saturday of the month.</strong></p>
            </div>
        </div>
        <p>Please have a look and give us feedback as soon as possible.</p>
        <p>If you have any questions, please contact me via the information below.</p>
        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 24px 0 16px;">
        <p style="color: #8c8c8c;">Best regards,</p>
        <p><strong>SV Technologies Recruitment Team</strong></p>
    `;

    const formattedDate = date ? date.format('dddd, DD/MM/YYYY') : 'Monday, 03/11/2025';

    const [candidatesData, setCandidatesData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchCandidates = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                status: 'Shortlisted'
            };
            if (searchText) {
                params.searcher = JSON.stringify({ keyword: searchText, field: 'name' });
            }
            const res = await http.get('/candidates', { params });
            setCandidatesData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, [searchText]);

    const candidateNames =
        selectedCandidates
            .map((id) => candidatesData?.data?.hits?.find((c: any) => c.id === id)?.name)
            .filter(Boolean)
            .join(', ') || '{Candidate_Name}';

    const getProcessedHtml = () => {
        return emailHtml
            .replace(/{Candidate_Name}/g, candidateNames)
            .replace(/{Start_Date}/g, formattedDate)
            .replace(/{Role}/g, 'Business Analyst Trainee');
    };

    const handleResetTemplate = () => {
        setEmailHtml(defaultTemplate);
        setIsEditing(false);
    };

    const candidates = candidatesData?.data?.hits || [];

    const toggleCandidate = (id: string) => {
        setSelectedCandidates((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
    };

    const handleSendInvites = async () => {
        if (selectedCandidates.length === 0) {
            message.warning('Please select at least one candidate.');
            return;
        }
        if (!date || !timeRange) {
            message.warning('Please select a date and time range.');
            return;
        }

        const selectedCandsInfo = candidates.filter((c) => selectedCandidates.includes(c.id));

        try {
            setIsProcessing(true);
            message.loading({ content: 'Sending invites...', key: 'inviting' });

            await Promise.all(
                selectedCandsInfo.map((cand) =>
                    http.post('/interviews', {
                        candidateId: cand.id,
                        candidateName: cand.name,
                        jobId: cand.jobId || cand.job?.id,
                        jobTitle: cand.appliedForTitle,
                        date: date.format('YYYY-MM-DD'),
                        time: timeRange[0].format('HH:mm'),
                        duration: '60 min',
                        format: 'Online',
                        location: 'https://meet.google.com/abc-defg-hij',
                        interviewer: 'Michael Ross', // Should be selectable in real app
                        notes: 'Standard Technical Interview'
                    })
                )
            );

            message.success({
                content: `Sent interview invites to ${selectedCandidates.length} candidates!`,
                key: 'inviting'
            });
            setSelectedCandidates([]);
            setDate(null);
            setTimeRange(null);
            fetchCandidates();
        } catch (error) {
            message.error({ content: 'Failed to send some invites.', key: 'inviting' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = () => {
        if (selectedCandidates.length === 0) return;
        Modal.confirm({
            title: t('common.confirm'),
            content: `${t('common.delete')} ${selectedCandidates.length} ${t('menu.interviews')}?`,
            okText: t('common.delete'),
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await Promise.all(selectedCandidates.map((id) => http.delete(`/candidates/${id}`)));
                    message.success(t('common.success'));
                    setSelectedCandidates([]);
                    fetchCandidates();
                } catch (error) {
                    message.error('Failed to delete some candidates.');
                }
            }
        });
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f6f7f8' }}>
            <Content style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <Text type='secondary'>
                        {t('menu.recruitment_management')} / {t('menu.cv_management')} /{' '}
                    </Text>
                    <Text strong>{t('menu.interviews')}</Text>
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
                            {t('interview.schedule_title')}
                        </Title>
                        <Text type='secondary'>{t('interview.schedule_desc')}</Text>
                    </div>
                </div>

                <Row gutter={24}>
                    <Col xs={24} lg={8}>
                        <Card
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{t('interview.queue')}</span>
                                    <Tag color='blue'>
                                        {selectedCandidates.length} {t('interview.selected')}
                                    </Tag>
                                </div>
                            }
                            style={{ height: '100%', borderRadius: '12px' }}
                            bodyStyle={{ padding: 0, height: '600px', overflowY: 'auto' }}
                        >
                            <div style={{ padding: '12px', background: '#f8f9fa', borderBottom: '1px solid #f0f0f0' }}>
                                <Input
                                    prefix={<SearchOutlined />}
                                    placeholder={t('candidate.search_placeholder')}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                            {isLoading ? (
                                <div style={{ padding: '16px' }}>
                                    <Skeleton active />
                                </div>
                            ) : (
                                <List
                                    dataSource={candidates}
                                    renderItem={(item: any) => (
                                        <List.Item
                                            style={{
                                                padding: '12px 16px',
                                                cursor: 'pointer',
                                                background: selectedCandidates.includes(item.id)
                                                    ? '#e6f7ff'
                                                    : 'transparent'
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
                                                        {item.appliedForTitle}
                                                    </Text>
                                                </div>
                                                <Tag
                                                    color={
                                                        item.matchScore >= 90
                                                            ? 'success'
                                                            : item.matchScore >= 80
                                                              ? 'processing'
                                                              : 'warning'
                                                    }
                                                >
                                                    {item.matchScore}
                                                </Tag>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Card style={{ borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        {t('interview.configure_send')}
                                    </Title>
                                    <Text type='secondary'>{t('interview.setup_details')}</Text>
                                </div>
                                <Space>
                                    <Button danger onClick={handleReject} disabled={selectedCandidates.length === 0}>
                                        {t('common.delete')}
                                    </Button>
                                    <Button
                                        type='primary'
                                        onClick={handleSendInvites}
                                        disabled={selectedCandidates.length === 0}
                                        loading={isProcessing}
                                    >
                                        {t('interview.invite')}
                                    </Button>
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
                                    <CalendarOutlined style={{ marginRight: '8px' }} /> {t('interview.details')}
                                </Title>
                                <Row gutter={16} style={{ marginBottom: '16px' }}>
                                    <Col span={12}>
                                        <Text strong>{t('interview.date')}</Text>
                                        <DatePicker
                                            style={{ width: '100%', marginTop: '8px' }}
                                            onChange={setDate}
                                            value={date}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>{t('interview.time_slot')}</Text>
                                        <TimePicker.RangePicker
                                            style={{ width: '100%', marginTop: '8px' }}
                                            format='HH:mm'
                                            onChange={setTimeRange}
                                            value={timeRange}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Text strong>{t('interview.format')}</Text>
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
                                                {t('interview.online')}
                                            </Button>
                                            <Button type='text' style={{ flex: 1 }}>
                                                {t('interview.in_person')}
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col span={16}>
                                        <Text strong>{t('interview.location_link')}</Text>
                                        <Input
                                            prefix={<VideoCameraOutlined style={{ color: '#bfbfbf' }} />}
                                            suffix={
                                                <Button
                                                    icon={<CopyOutlined />}
                                                    type='text'
                                                    size='small'
                                                    onClick={() => message.success('Copied link')}
                                                />
                                            }
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
                                        <MailOutlined style={{ marginRight: '8px' }} /> {t('interview.email_comm')}
                                    </Title>
                                </div>

                                <Row gutter={16} style={{ marginBottom: '16px' }}>
                                    <Col span={24}>
                                        <Text strong>{t('interview.subject')}</Text>
                                        <Input
                                            defaultValue='Offer for Trainee Period - {Role}'
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
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <div
                                        style={{
                                            borderBottom: '1px solid #f0f0f0',
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
                                                {t('common.reset')}
                                            </Button>
                                            <Button
                                                type={isEditing ? 'primary' : 'default'}
                                                size='small'
                                                icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                                                onClick={() => setIsEditing(!isEditing)}
                                            >
                                                {isEditing ? t('common.save') : t('common.edit')}
                                            </Button>
                                        </Space>
                                    </div>
                                    <div
                                        contentEditable={isEditing}
                                        onBlur={(e) => setEmailHtml(e.currentTarget.innerHTML)}
                                        dangerouslySetInnerHTML={{ __html: isEditing ? emailHtml : getProcessedHtml() }}
                                        style={{
                                            fontSize: '14px',
                                            lineHeight: '1.8',
                                            color: '#262626',
                                            padding: isEditing ? '12px' : 0,
                                            border: isEditing ? '1px solid #136dec' : 'none',
                                            borderRadius: '8px',
                                            minHeight: '200px',
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
                                    borderTop: '1px solid #f0f0f0',
                                    paddingTop: '24px'
                                }}
                            >
                                <Button size='large' onClick={() => setSelectedCandidates([])}>
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    type='primary'
                                    size='large'
                                    icon={<SendOutlined />}
                                    onClick={handleSendInvites}
                                    disabled={selectedCandidates.length === 0}
                                    loading={isProcessing}
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
