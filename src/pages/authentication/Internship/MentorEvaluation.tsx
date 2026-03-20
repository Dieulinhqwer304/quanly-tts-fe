import {
    SaveOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
    SendOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    StarOutlined,
    FileTextOutlined,
    LockOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Slider,
    Space,
    Typography,
    message,
    Divider,
    Tag,
    Steps,
    Spin,
    Progress,
    Timeline,
    Statistic,
    Empty
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { http } from '../../../utils/http';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getProfile } from '../../../services/auth/profile';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PHASE_CONFIG = [
    {
        key: 'Probation',
        label: 'Giai đoạn 1 – Thử việc',
        color: '#1E40AF',
        bg: '#EFF6FF',
        icon: <ClockCircleOutlined />
    },
    {
        key: 'Mid-term',
        label: 'Giai đoạn 2 – Dự án',
        color: '#059669',
        bg: '#ECFDF5',
        icon: <TeamOutlined />
    },
    {
        key: 'Final',
        label: 'Giai đoạn cuối – Tổng kết',
        color: '#D97706',
        bg: '#FFFBEB',
        icon: <TrophyOutlined />
    }
];

export const MentorEvaluation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);

    const [internData, setInternData] = useState<any>(null);
    const [isInternLoading, setIsInternLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mentorProfile, setMentorProfile] = useState<any>(null);
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [isEvalLoading, setIsEvalLoading] = useState(false);

    const fetchIntern = async () => {
        if (!id) return;
        setIsInternLoading(true);
        try {
            const res = await http.get(`/interns/${id}`);
            setInternData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsInternLoading(false);
        }
    };

    const fetchEvaluations = async () => {
        if (!id) return;
        setIsEvalLoading(true);
        try {
            const res = await http.get(`/evaluations/intern/${id}`);
            setEvaluations(Array.isArray(res) ? res : res?.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsEvalLoading(false);
        }
    };

    useEffect(() => {
        fetchIntern();
        fetchEvaluations();
    }, [id]);

    useEffect(() => {
        getProfile().then((res) => setMentorProfile(res)).catch(() => { });
    }, []);

    useEffect(() => {
        const completedPhaseCount = PHASE_CONFIG.filter((phase) => Boolean(getEvalByPhase(phase.key))).length;
        setCurrentStep(Math.min(completedPhaseCount, 2));
    }, [evaluations]);

    const getEvalByPhase = (phase: string) => evaluations.find((e) => e.type === phase);

    const onFinish = async (values: any) => {
        if (!id || !internData) return;
        setIsProcessing(true);
        try {
            let evalType = 'Probation';

            if (currentStep === 0) {
                evalType = 'Probation';
            } else if (currentStep === 1) {
                evalType = 'Mid-term';
            } else {
                evalType = 'Final';
            }

            await http.post('/evaluations', {
                internId: id,
                mentorId: mentorProfile?.id,
                type: evalType as any,
                overallScore: values.overallScore,
                strengths: values.strengths,
                weaknesses: values.improvements,
                feedback: values.notes,
            });

            message.success(t('common.success'));
            await fetchEvaluations();
            form.resetFields();
            if (currentStep < 2) {
                setCurrentStep(currentStep + 1);
            } else {
                navigate(RouteConfig.MentorInternList.path);
            }
        } catch {
            message.error(t('common.error'));
        } finally {
            setIsProcessing(false);
        }
    };

    if (isInternLoading) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <Spin size='large' />
            </div>
        );
    }

    const intern = internData;

    // ── Phần tổng hợp tất cả giai đoạn ──
    const renderPhaseSummary = () => (
        <Card
            bordered={false}
            style={{ borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}
            title={
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileTextOutlined style={{ color: '#1E40AF' }} />
                    Tổng hợp đánh giá theo giai đoạn
                </span>
            }
        >
            {isEvalLoading ? (
                <div style={{ textAlign: 'center', padding: '24px' }}><Spin /></div>
            ) : (
                <Row gutter={16}>
                    {PHASE_CONFIG.map((phase, idx) => {
                        const eval_ = getEvalByPhase(phase.key);
                        const isDone = !!eval_;
                        const isNext = !isDone && idx === currentStep;
                        return (
                            <Col xs={24} md={8} key={phase.key}>
                                <div
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: `2px solid ${isDone ? phase.color : isNext ? '#E2E8F0' : '#F1F5F9'}`,
                                        background: isDone ? phase.bg : '#FAFAFA',
                                        position: 'relative',
                                        height: '100%'
                                    }}
                                >
                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <div
                                                style={{
                                                    width: 32, height: 32,
                                                    borderRadius: '8px',
                                                    background: isDone ? phase.color : '#E2E8F0',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: isDone ? '#fff' : '#94A3B8',
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                {isDone ? <CheckCircleOutlined /> : isNext ? phase.icon : <LockOutlined />}
                                            </div>
                                            <Text strong style={{ fontSize: '13px', color: isDone ? phase.color : '#64748B' }}>
                                                {phase.label}
                                            </Text>
                                        </div>
                                        <Tag color={isDone ? 'success' : isNext ? 'processing' : 'default'}>
                                            {isDone ? 'Hoàn thành' : isNext ? 'Đang thực hiện' : 'Chưa đến'}
                                        </Tag>
                                    </div>

                                    {isDone ? (
                                        <>
                                            <Divider style={{ margin: '8px 0' }} />
                                            {eval_.overallScore != null && (
                                                <div style={{
                                                    marginTop: '12px', padding: '8px 12px',
                                                    background: '#fff', borderRadius: '8px',
                                                    border: `1px solid ${phase.color}`,
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                }}>
                                                    <Text style={{ fontSize: '12px', color: '#64748B' }}>Điểm tổng</Text>
                                                    <Text strong style={{ fontSize: '18px', color: phase.color }}>
                                                        {eval_.overallScore}/10
                                                    </Text>
                                                </div>
                                            )}
                                            {eval_.strengths ? <Text type='secondary' style={{ display: 'block', marginTop: '8px' }}>Điểm mạnh: {eval_.strengths}</Text> : null}
                                            {eval_.weaknesses ? <Text type='secondary' style={{ display: 'block', marginTop: '4px' }}>Cần cải thiện: {eval_.weaknesses}</Text> : null}
                                            {eval_.feedback ? <Text type='secondary' style={{ display: 'block', marginTop: '4px' }}>Ghi chú: {eval_.feedback}</Text> : null}
                                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#94A3B8' }}>
                                                <ClockCircleOutlined /> {eval_.evaluationDate ? new Date(eval_.evaluationDate).toLocaleDateString('vi-VN') : '--'}
                                                {eval_.mentor?.fullName && ` • ${eval_.mentor.fullName}`}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '8px' }}>
                                            {isNext ? 'Sẵn sàng đánh giá bên dưới' : 'Chưa đến giai đoạn này'}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* Timeline tổng quan */}
            {evaluations.length > 0 && (
                <>
                    <Divider orientation='left' style={{ marginTop: '24px' }}>
                        <Text type='secondary' style={{ fontSize: '12px' }}>Lịch sử đánh giá</Text>
                    </Divider>
                    <Timeline
                        items={evaluations.map((e) => {
                            const cfg = PHASE_CONFIG.find((p) => p.key === e.type);
                            return {
                                color: cfg?.color || 'blue',
                                children: (
                                    <div>
                                        <Tag color='blue' style={{ fontSize: '11px' }}>{cfg?.label || e.type}</Tag>
                                        <Text style={{ fontSize: '12px', marginLeft: '8px', color: '#64748B' }}>
                                            {e.evaluationDate ? new Date(e.evaluationDate).toLocaleDateString('vi-VN') : '--'}
                                        </Text>
                                        {e.overallScore != null && (
                                            <Text strong style={{ marginLeft: '8px', color: cfg?.color }}>
                                                {e.overallScore}/10
                                            </Text>
                                        )}
                                    </div>
                                )
                            };
                        })}
                    />
                </>
            )}

            {evaluations.length === 0 && !isEvalLoading && (
                <Empty description='Chưa có đánh giá nào' style={{ marginTop: '16px' }} />
            )}
        </Card>
    );

    const renderStepContent = () => {
        return (
            <Card bordered={false} style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24}>
                        <Form.Item
                            label={t('eval.strengths')}
                            name='strengths'
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <TextArea rows={4} placeholder={t('eval.strengths_placeholder')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            label={t('eval.improvements')}
                            name='improvements'
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <TextArea rows={4} placeholder={t('eval.improvements_placeholder')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            label={t('common.description')}
                            name='notes'
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <TextArea rows={4} placeholder={t('eval.mentor_feedback_placeholder')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            label='Điểm đánh giá tổng'
                            name='overallScore'
                            rules={[{ required: true, message: t('common.required_field') }]}
                            initialValue={7}
                        >
                            <Slider min={0} max={10} step={1} marks={{ 0: '0', 5: '5', 10: '10' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        );
    };

    const completedPhases = PHASE_CONFIG.filter((phase) => Boolean(getEvalByPhase(phase.key))).length;
    const allDone = completedPhases >= PHASE_CONFIG.length;

    return (
        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', paddingBottom: '100px' }}>
            {/* Header card intern */}
            <Card
                bordered={false}
                style={{ borderRadius: '12px', marginBottom: '24px', background: '#fff', border: '1px solid #E2E8F0' }}
            >
                <Row align='middle' gutter={24}>
                    <Col>
                        <Avatar size={80} src={intern?.user?.avatarUrl || intern?.avatar} />
                    </Col>
                    <Col flex='1'>
                        <Title level={3} style={{ margin: 0 }}>
                            {intern?.user?.fullName || intern?.name}
                        </Title>
                        <Text type='secondary'>
                            {intern?.track} • {intern?.id}
                        </Text>
                        <div style={{ marginTop: '8px' }}>
                            <Tag color='blue'>{intern?.status}</Tag>
                            <Tag color='purple'>{intern?.mentor?.fullName}</Tag>
                        </div>
                    </Col>
                    <Col>
                        <Row gutter={24}>
                            <Col>
                                <Statistic
                                    title='Tiến độ'
                                    value={intern?.overallProgress ?? 0}
                                    suffix='%'
                                    valueStyle={{ color: '#1E40AF', fontSize: '24px' }}
                                />
                                <Progress percent={intern?.overallProgress ?? 0} size='small' status='active' style={{ width: '120px' }} />
                            </Col>
                            <Col>
                                <Statistic
                                    title='Giai đoạn đã đánh giá'
                                    value={completedPhases}
                                    suffix='/ 3'
                                    valueStyle={{ color: completedPhases === 3 ? '#10B981' : '#F59E0B', fontSize: '24px' }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>

            {/* Tổng hợp đánh giá theo giai đoạn */}
            {renderPhaseSummary()}

            {/* Form đánh giá mới nếu chưa hoàn tất */}
            {!allDone ? (
                <>
                    <div
                        style={{
                            marginBottom: '32px',
                            background: '#fff',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0'
                        }}
                    >
                        <Title level={5} style={{ marginBottom: '16px' }}>
                            Nhập đánh giá – Giai đoạn {currentStep + 1}
                        </Title>
                        <Steps
                            current={currentStep}
                            onChange={(step) => {
                                const evalDone = getEvalByPhase(PHASE_CONFIG[step].key);
                                if (evalDone || step <= completedPhases) setCurrentStep(step);
                                else message.warning('Vui lòng hoàn thành đánh giá giai đoạn trước.');
                            }}
                            items={[
                                { title: t('eval.phase1_title'), description: t('task_mgmt.training'), icon: completedPhases > 0 ? <CheckCircleOutlined /> : undefined },
                                { title: t('eval.phase2_title'), description: t('task_mgmt.project'), icon: completedPhases > 1 ? <CheckCircleOutlined /> : undefined },
                                { title: t('eval.final_title'), description: t('task_mgmt.completed'), icon: completedPhases > 2 ? <TrophyOutlined /> : undefined }
                            ]}
                        />
                    </div>

                    <Form form={form} layout='vertical' onFinish={onFinish}>
                        {renderStepContent()}

                        <div
                            style={{
                                position: 'fixed',
                                bottom: 0, left: 0,
                                width: '100%',
                                padding: '16px 24px',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                borderTop: '1px solid #E2E8F0',
                                zIndex: 100,
                                paddingLeft: 280
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: '1100px',
                                    margin: '0 auto',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Button size='large' onClick={() => navigate(RouteConfig.MentorInternList.path)}>
                                    {t('common.back')}
                                </Button>
                                <Space>
                                    <Button icon={<SaveOutlined />} onClick={() => message.success(t('eval.draft_saved'))}>
                                        {t('eval.save_draft')}
                                    </Button>
                                    <Button
                                        type='primary'
                                        icon={<SendOutlined />}
                                        size='large'
                                        onClick={() => form.submit()}
                                        loading={isProcessing}
                                    >
                                        {currentStep === 2 ? t('eval.submit_eval') : t('common.save')}
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    </Form>
                </>
            ) : (
                <Card bordered={false} style={{ borderRadius: '12px', border: '1px solid #10B981', background: '#F0FDF4', textAlign: 'center', padding: '32px' }}>
                    <TrophyOutlined style={{ fontSize: '48px', color: '#10B981', marginBottom: '16px' }} />
                    <Title level={4} style={{ color: '#059669' }}>Đã hoàn thành toàn bộ 3 giai đoạn đánh giá</Title>
                    <Text type='secondary'>Tất cả các phiếu đánh giá đã được ghi nhận. Xem tổng hợp bên trên.</Text>
                    <div style={{ marginTop: '24px' }}>
                        <Button type='primary' onClick={() => navigate(RouteConfig.MentorInternList.path)}>
                            Quay lại danh sách thực tập sinh
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};
