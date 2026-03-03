import {
    SaveOutlined,
    InfoCircleOutlined,
    RocketOutlined,
    StarOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
    SendOutlined,
    TeamOutlined
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
    Breadcrumb,
    Divider,
    Tag,
    Steps,
    Radio,
    Collapse,
    Spin,
    Progress
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { http } from '../../../utils/http';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const MentorEvaluation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);

    const [internData, setInternData] = useState<any>(null);
    const [isInternLoading, setIsInternLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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

    useEffect(() => {
        fetchIntern();
    }, [id]);

    // Logic to determine initial step based on intern progress
    useEffect(() => {
        if (internData) {
            const progress = internData.progress || 0;
            if (progress >= 66) setCurrentStep(2);
            else if (progress >= 33) setCurrentStep(1);
            else setCurrentStep(0);
        }
    }, [internData]);

    const onFinish = async (values: any) => {
        if (!id || !internData) return;

        setIsProcessing(true);
        try {
            let evalType = 'Probation';
            let score = 0;
            let feedback = '';
            let nextProgress = 33;
            let status = internData.status;

            if (currentStep === 0) {
                evalType = 'Probation';
                score =
                    ((values.learningSpeed + values.communication + values.punctuality + values.codeQuality) / 4) * 2;
                feedback = `${values.strengths}\n\nImprovements: ${values.improvements}`;
                nextProgress = 33;
            } else if (currentStep === 1) {
                evalType = 'Mid-term';
                score =
                    ((values.techContribution + values.problemSolving + values.reliability + values.teamwork) / 4) * 2;
                feedback = `${values.accomplishments}\n\nFeedback: ${values.feedback}`;
                nextProgress = 66;
            } else {
                evalType = 'Final';
                const technicalScores = [values.codeQualityFinal, values.architectureFinal, values.toolingFinal];
                const softSkillScores = [values.attitudeFinal, values.communicationFinal, values.teamworkFinal];
                const allScores = [...technicalScores, ...softSkillScores].filter((s) => s !== undefined);
                score = allScores.length > 0 ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) * 2 : 0;
                feedback = `Recommendation: ${values.recommendation}\n\nHR Note: ${values.hrNote}`;
                nextProgress = 100;
                if (values.recommendation === 'hire') status = 'Completed';
            }

            await http.post('/evaluations', {
                internId: id,
                internName: internData.name,
                mentorId: 'mentor-1',
                mentorName: 'Harvey Specter',
                type: evalType as any,
                score: parseFloat(score.toFixed(1)),
                feedback,
                date: new Date().toISOString()
            });

            await http.patch(`/interns/${id}`, {
                progress: nextProgress,
                status
            });

            message.success(t('common.success'));
            if (currentStep < 2) {
                setCurrentStep(currentStep + 1);
            } else {
                navigate(RouteConfig.InternList.path);
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
                                                    width: 40,
                                                    height: 40,
                                                    background: '#e6f7ff',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#1890ff'
                                                }}
                                            >
                                                <TeamOutlined />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                                    {t('eval.attitude_soft_skills')}
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                                    Punctuality, proactiveness, and cultural fit.
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                    style: {
                                        background: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb',
                                        overflow: 'hidden',
                                        marginBottom: '16px'
                                    },
                                    children: (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            <Form.Item
                                                name='attitudeFinal'
                                                label={t('eval.punctuality')}
                                                initialValue={5}
                                            >
                                                <Radio.Group buttonStyle='solid'>
                                                    {[1, 2, 3, 4, 5].map((v) => (
                                                        <Radio.Button key={v} value={v}>
                                                            {v}
                                                        </Radio.Button>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item
                                                name='communicationFinal'
                                                label={t('eval.communication')}
                                                initialValue={4}
                                            >
                                                <Radio.Group buttonStyle='solid'>
                                                    {[1, 2, 3, 4, 5].map((v) => (
                                                        <Radio.Button key={v} value={v}>
                                                            {v}
                                                        </Radio.Button>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item
                                                name='teamworkFinal'
                                                label={t('eval.team_integration')}
                                                initialValue={4}
                                            >
                                                <Radio.Group buttonStyle='solid'>
                                                    {[1, 2, 3, 4, 5].map((v) => (
                                                        <Radio.Button key={v} value={v}>
                                                            {v}
                                                        </Radio.Button>
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
                                                <CheckCircleOutlined />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                                    {t('eval.technical_proficiency')}
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                                    Code quality, tool mastery, and problem solving.
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                    style: {
                                        background: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb',
                                        overflow: 'hidden',
                                        marginBottom: '16px'
                                    },
                                    children: (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                            {[
                                                {
                                                    name: 'codeQualityFinal',
                                                    title: t('eval.code_quality'),
                                                    desc: t('eval.code_quality_desc')
                                                },
                                                {
                                                    name: 'architectureFinal',
                                                    title: 'Architecture & Design',
                                                    desc: 'Ability to understand system design.'
                                                },
                                                {
                                                    name: 'toolingFinal',
                                                    title: 'Tooling Proficiency',
                                                    desc: 'Comfort with Git, Docker, etc.'
                                                }
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start'
                                                    }}
                                                >
                                                    <div style={{ maxWidth: '300px' }}>
                                                        <div style={{ fontWeight: 600 }}>{item.title}</div>
                                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                    <Form.Item name={item.name} noStyle initialValue={4}>
                                                        <Radio.Group buttonStyle='solid'>
                                                            {[1, 2, 3, 4, 5].map((v) => (
                                                                <Radio.Button key={v} value={v}>
                                                                    {v}
                                                                </Radio.Button>
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
                            style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                        >
                            <Row gutter={32}>
                                <Col span={12}>
                                    <Form.Item
                                        label={<Text strong>{t('eval.final_recommendation')}</Text>}
                                        name='recommendation'
                                        rules={[{ required: true }]}
                                    >
                                        <Select placeholder='Select an outcome...'>
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
                                        <TextArea rows={4} placeholder='Add context for your decision...' />
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

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[
                        { title: t('menu.mentor_portal') },
                        { title: t('menu.evaluations') },
                        { title: intern?.name || 'Intern' }
                    ]}
                />
            </div>

            <Card
                bordered={false}
                style={{ borderRadius: '12px', marginBottom: '24px', background: '#fff', border: '1px solid #e5e7eb' }}
            >
                <Row align='middle' gutter={24}>
                    <Col>
                        <Avatar size={80} src={intern?.avatar} />
                    </Col>
                    <Col flex='1'>
                        <Title level={3} style={{ margin: 0 }}>
                            {intern?.name}
                        </Title>
                        <Text type='secondary'>
                            {intern?.track} • {intern?.id}
                        </Text>
                        <div style={{ marginTop: '8px' }}>
                            <Tag color='blue'>{intern?.status}</Tag>
                            <Tag color='purple'>{intern?.mentor}</Tag>
                        </div>
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
                        <Text type='secondary' style={{ fontSize: '12px', display: 'block' }}>
                            {t('internship.progress').toUpperCase()}
                        </Text>
                        <Text strong style={{ fontSize: '20px' }}>
                            {intern?.progress}%
                        </Text>
                        <Progress percent={intern?.progress} size='small' status='active' style={{ width: '120px' }} />
                    </Col>
                </Row>
            </Card>

            <div
                style={{
                    marginBottom: '32px',
                    background: '#fff',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                }}
            >
                <Steps
                    current={currentStep}
                    onChange={setCurrentStep}
                    items={[
                        { title: t('eval.phase1_title'), description: t('task_mgmt.training') },
                        { title: t('eval.phase2_title'), description: t('task_mgmt.project') },
                        { title: t('eval.final_title'), description: t('task_mgmt.completed') }
                    ]}
                />
            </div>

            <Form form={form} layout='vertical' onFinish={onFinish}>
                {renderStepContent()}

                <div
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        padding: '16px 24px',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        borderTop: '1px solid #e5e7eb',
                        zIndex: 100,
                        paddingLeft: 280
                    }}
                >
                    <div
                        style={{
                            maxWidth: '1000px',
                            margin: '0 auto',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Button size='large' onClick={() => navigate(RouteConfig.InternList.path)}>
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
        </div>
    );
};
