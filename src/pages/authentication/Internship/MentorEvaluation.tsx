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
    Rate,
    Row,
    Select,
    Space,
    Typography,
    message,
    Divider,
    Tag,
    Steps,
    Radio,
    Collapse,
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

const ScoreBar = ({ label, score }: { label: string; score?: number }) => (
    <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <Text style={{ fontSize: '13px' }}>{label}</Text>
            <Text strong style={{ fontSize: '13px' }}>{score ?? '--'}/10</Text>
        </div>
        <Progress
            percent={score ? (score / 10) * 100 : 0}
            showInfo={false}
            strokeColor={score && score >= 7 ? '#10B981' : score && score >= 5 ? '#F59E0B' : '#EF4444'}
            size='small'
        />
    </div>
);

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
        if (internData) {
            const progress = internData.overallProgress || 0;
            if (progress >= 66) setCurrentStep(2);
            else if (progress >= 33) setCurrentStep(1);
            else setCurrentStep(0);
        }
    }, [internData]);

    const getEvalByPhase = (phase: string) => evaluations.find((e) => e.type === phase);

    const onFinish = async (values: any) => {
        if (!id || !internData) return;
        setIsProcessing(true);
        try {
            let evalType = 'Probation';
            let feedback = '';
            let technicalScore: number | undefined;
            let attitudeScore: number | undefined;
            let teamworkScore: number | undefined;

            if (currentStep === 0) {
                evalType = 'Probation';
                technicalScore = Math.round(values.codeQuality * 2);
                attitudeScore = Math.round(((values.learningSpeed + values.punctuality) / 2) * 2);
                teamworkScore = Math.round(values.communication * 2);
                feedback = `${values.strengths || ''}\n\nImprovements: ${values.improvements || ''}`;
            } else if (currentStep === 1) {
                evalType = 'Mid-term';
                technicalScore = Math.round(((values.techContribution + values.problemSolving) / 2) * 2);
                attitudeScore = Math.round(values.reliability * 2);
                teamworkScore = Math.round(values.teamwork * 2);
                feedback = `${values.accomplishments || ''}\n\nFeedback: ${values.feedback || ''}`;
            } else {
                evalType = 'Final';
                const technicalScores = [values.codeQualityFinal, values.architectureFinal, values.toolingFinal];
                const softSkillScores = [values.attitudeFinal, values.communicationFinal, values.teamworkFinal];
                technicalScore = Math.round(
                    (technicalScores.filter(Boolean).reduce((a, b) => a + b, 0) / (technicalScores.filter(Boolean).length || 1)) * 2
                );
                attitudeScore = Math.round(
                    (softSkillScores.filter(Boolean).reduce((a, b) => a + b, 0) / (softSkillScores.filter(Boolean).length || 1)) * 2
                );
                feedback = `Recommendation: ${values.recommendation}${values.hrNote ? '\n\nHR Note: ' + values.hrNote : ''}`;
            }

            await http.post('/evaluations', {
                internId: id,
                internName: internData.user?.fullName || internData.name,
                mentorId: mentorProfile?.id,
                mentorName: mentorProfile?.fullName,
                type: evalType as any,
                decision: currentStep === 2 ? values.recommendation : undefined,
                technicalScore,
                attitudeScore,
                teamworkScore,
                feedback,
                date: new Date().toISOString()
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
                                            <ScoreBar label='Kỹ thuật' score={eval_.technicalScore} />
                                            <ScoreBar label='Thái độ' score={eval_.attitudeScore} />
                                            <ScoreBar label='Làm việc nhóm' score={eval_.teamworkScore} />
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
                                            {eval_.decision && (
                                                <Tag
                                                    color={eval_.decision === 'hire' ? 'success' : eval_.decision === 'extend' ? 'warning' : 'error'}
                                                    style={{ marginTop: '8px', fontSize: '12px' }}
                                                >
                                                    {eval_.decision === 'hire' ? '✓ Đề xuất tuyển dụng'
                                                        : eval_.decision === 'extend' ? '↻ Gia hạn thực tập'
                                                            : '✕ Kết thúc chương trình'}
                                                </Tag>
                                            )}
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
        switch (currentStep) {
            case 0:
                return (
                    <>
                        <Card
                            title={t('eval.core_perf')}
                            bordered={false}
                            style={{ borderRadius: '12px', marginBottom: '24px' }}
                        >
                            <Row gutter={48}>
                                <Col span={12}>
                                    <Form.Item
                                        label={t('eval.learning_speed')}
                                        name='learningSpeed'
                                        rules={[{ required: true }]}
                                    >
                                        <Rate allowHalf />
                                    </Form.Item>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        {t('eval.learning_speed_desc')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={t('eval.communication')}
                                        name='communication'
                                        rules={[{ required: true }]}
                                    >
                                        <Rate allowHalf />
                                    </Form.Item>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        {t('eval.communication_desc')}
                                    </Text>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={48}>
                                <Col span={12}>
                                    <Form.Item
                                        label={t('eval.punctuality')}
                                        name='punctuality'
                                        rules={[{ required: true }]}
                                    >
                                        <Rate allowHalf />
                                    </Form.Item>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        {t('eval.punctuality_desc')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={t('eval.code_quality')}
                                        name='codeQuality'
                                        rules={[{ required: true }]}
                                    >
                                        <Rate allowHalf />
                                    </Form.Item>
                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                        {t('eval.code_quality_desc')}
                                    </Text>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title={t('eval.detailed_assessment')}
                            bordered={false}
                            style={{ borderRadius: '12px', marginBottom: '24px' }}
                        >
                            <Form.Item
                                label={t('eval.strengths')}
                                name='strengths'
                                rules={[{ required: true, message: t('common.required_field') }]}
                            >
                                <TextArea rows={3} placeholder={t('eval.strengths_placeholder')} />
                            </Form.Item>
                            <Form.Item
                                label={t('eval.improvements')}
                                name='improvements'
                                rules={[{ required: true, message: t('common.required_field') }]}
                            >
                                <TextArea rows={3} placeholder={t('eval.improvements_placeholder')} />
                            </Form.Item>
                        </Card>
                        <Card title={t('eval.recommendation')} bordered={false} style={{ borderRadius: '12px' }}>
                            <Form.Item label={t('eval.proceed_q')} name='proceedToPhase2' rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { value: 'yes', label: t('eval.ready_projects') },
                                        { value: 'extended_training', label: t('eval.extended_training') },
                                        { value: 'no', label: t('eval.not_meeting') }
                                    ]}
                                />
                            </Form.Item>
                        </Card>
                    </>
                );
            case 1:
                return (
                    <>
                        <Card
                            title={t('eval.project_perf')}
                            bordered={false}
                            style={{ borderRadius: '12px', marginBottom: '24px' }}
                        >
                            <Row gutter={48}>
                                <Col span={12}>
                                    <Form.Item
                                        label={t('eval.tech_contribution')}
                                        name='techContribution'
                                        rules={[{ required: true }]}
                                    >
                                        <Rate character={<StarOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={t('eval.problem_solving')}
                                        name='problemSolving'
                                        rules={[{ required: true }]}
                                    >
                                        <Rate character={<StarOutlined />} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={48}>
                                <Col span={12}>
                                    <Form.Item
                                        label={t('eval.reliability')}
                                        name='reliability'
                                        rules={[{ required: true }]}
                                    >
                                        <Rate character={<StarOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={t('eval.team_integration')}
                                        name='teamwork'
                                        rules={[{ required: true }]}
                                    >
                                        <Rate character={<StarOutlined />} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title={t('eval.accomplishments')}
                            bordered={false}
                            style={{ borderRadius: '12px', marginBottom: '24px' }}
                        >
                            <Form.Item
                                label={t('eval.accomplishments')}
                                name='accomplishments'
                                rules={[{ required: true }]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item label={t('common.description')} name='feedback'>
                                <TextArea rows={3} placeholder={t('eval.mentor_feedback_placeholder')} />
                            </Form.Item>
                        </Card>
                    </>
                );
            case 2:
                return (
                    <>
                        <Collapse
                            defaultActiveKey={['1', '2']}
                            expandIconPosition='end'
                            style={{ background: 'transparent', border: 'none', marginBottom: '24px' }}
                            items={[
                                {
                                    key: '1',
                                    label: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div
                                                style={{
                                                    width: 40, height: 40,
                                                    background: '#e6f7ff',
                                                    borderRadius: '8px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#1E40AF'
                                                }}
                                            >
                                                <TeamOutlined />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                                    {t('eval.attitude_soft_skills')}
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#64748B' }}>
                                                    Đúng giờ, chủ động và hòa nhập văn hóa.
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                    style: {
                                        background: '#fff', borderRadius: '12px',
                                        border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: '16px'
                                    },
                                    children: (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            <Form.Item name='attitudeFinal' label={t('eval.punctuality')} initialValue={5}>
                                                <Radio.Group buttonStyle='solid'>
                                                    {[1, 2, 3, 4, 5].map((v) => (
                                                        <Radio.Button key={v} value={v}>{v}</Radio.Button>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item name='communicationFinal' label={t('eval.communication')} initialValue={4}>
                                                <Radio.Group buttonStyle='solid'>
                                                    {[1, 2, 3, 4, 5].map((v) => (
                                                        <Radio.Button key={v} value={v}>{v}</Radio.Button>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item name='teamworkFinal' label={t('eval.team_integration')} initialValue={4}>
                                                <Radio.Group buttonStyle='solid'>
                                                    {[1, 2, 3, 4, 5].map((v) => (
                                                        <Radio.Button key={v} value={v}>{v}</Radio.Button>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                        </div>
                                    )
                                },
                                {
                                    key: '2',
                                    label: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div
                                                style={{
                                                    width: 40, height: 40,
                                                    background: '#1E40AF',
                                                    borderRadius: '8px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#fff'
                                                }}
                                            >
                                                <CheckCircleOutlined />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                                    {t('eval.technical_proficiency')}
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#64748B' }}>
                                                    Chất lượng code, thành thạo công cụ và giải quyết vấn đề.
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                    style: {
                                        background: '#fff', borderRadius: '12px',
                                        border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: '16px'
                                    },
                                    children: (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                            {[
                                                { name: 'codeQualityFinal', title: t('eval.code_quality'), desc: t('eval.code_quality_desc') },
                                                { name: 'architectureFinal', title: 'Kiến trúc & Thiết kế', desc: 'Khả năng hiểu thiết kế hệ thống.' },
                                                { name: 'toolingFinal', title: 'Thành thạo công cụ', desc: 'Git, Docker, CI/CD, v.v.' }
                                            ].map((item, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ maxWidth: '300px' }}>
                                                        <div style={{ fontWeight: 600 }}>{item.title}</div>
                                                        <div style={{ fontSize: '12px', color: '#64748B' }}>{item.desc}</div>
                                                    </div>
                                                    <Form.Item name={item.name} noStyle initialValue={4}>
                                                        <Radio.Group buttonStyle='solid'>
                                                            {[1, 2, 3, 4, 5].map((v) => (
                                                                <Radio.Button key={v} value={v}>{v}</Radio.Button>
                                                            ))}
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            ]}
                        />
                        <Card
                            title={t('eval.final_recommendation')}
                            bordered={false}
                            style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}
                        >
                            <Row gutter={32}>
                                <Col span={12}>
                                    <Form.Item
                                        label={<Text strong>{t('eval.final_recommendation')}</Text>}
                                        name='recommendation'
                                        rules={[{ required: true }]}
                                    >
                                        <Select placeholder='Chọn kết quả...'>
                                            <Select.Option value='hire'>{t('eval.ready_projects')}</Select.Option>
                                            <Select.Option value='extend'>{t('eval.extended_training')}</Select.Option>
                                            <Select.Option value='end'>{t('eval.not_meeting')}</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<Text strong>{t('eval.hr_note')}</Text>}
                                        name='hrNote'
                                        rules={[{ required: true }]}
                                    >
                                        <TextArea rows={4} placeholder='Thêm ghi chú cho quyết định của bạn...' />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </>
                );
            default:
                return null;
        }
    };

    const completedPhases = evaluations.length;
    const allDone = completedPhases === 3;

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
