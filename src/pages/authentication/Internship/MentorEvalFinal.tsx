import {
    CheckCircleOutlined,
    HistoryOutlined,
    IdcardOutlined,
    LineChartOutlined,
    RightOutlined,
    SaveOutlined,
    SendOutlined,
    TeamOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Collapse,
    Input,
    Layout,
    Progress,
    Radio,
    Row,
    Select,
    Space,
    Tag,
    Typography,
    Form,
    message,
    Spin
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
import { RouteConfig } from '../../../constants';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

export const MentorEvalFinal = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();

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

    const onFinish = async (values: any) => {
        if (!id || !internData) return;

        setIsProcessing(true);
        try {
            // Calculate an average score from the radio groups
            const technicalScores = [values.codeQuality, values.architecture, values.tooling];
            const softSkillScores = [values.attitude, values.communication, values.teamwork];
            const allScores = [...technicalScores, ...softSkillScores].filter((s) => s !== undefined);

            const avgScore =
                allScores.length > 0
                    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) * 2 // Map 5 stars to 10 points
                    : 0;

            await http.post('/evaluations', {
                internId: id,
                internName: internData.name,
                mentorId: 'mentor-1', // Mock for now
                mentorName: 'Harvey Specter', // Mock for now
                type: 'Final',
                score: parseFloat(avgScore.toFixed(1)),
                feedback: `Recommendation: ${values.recommendation}\n\nHR Note: ${values.hrNote}`,
                date: new Date().toISOString()
            });

            // Update intern progress to 100% and set status if hired
            await http.patch(`/interns/${id}`, {
                progress: 100,
                status: values.recommendation === 'hire' ? 'Completed' : 'Active'
            });

            message.success(t('common.success'));
            navigate(RouteConfig.InternList.path);
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

    return (
        <Layout style={{ minHeight: '100vh', background: '#f6f7f8' }}>
            <Content style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}>
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
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate(RouteConfig.InternList.path)}>
                        Interns
                    </span>
                    <RightOutlined style={{ fontSize: '10px' }} />
                    <span style={{ cursor: 'pointer' }}>Evaluations</span>
                    <RightOutlined style={{ fontSize: '10px' }} />
                    <span style={{ color: '#1E40AF', fontWeight: 600 }}>Final Assessment</span>
                </div>

                <Card
                    bordered={false}
                    style={{ borderRadius: '12px', marginBottom: '24px', border: '1px solid #E2E8F0' }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '24px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ position: 'relative' }}>
                                <Avatar
                                    size={96}
                                    src={intern?.avatar || 'https://i.pravatar.cc/150'}
                                    shape='square'
                                    style={{ borderRadius: '12px' }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: -4,
                                        right: -4,
                                        width: 16,
                                        height: 16,
                                        background: intern?.status === 'Active' ? '#10B981' : '#E2E8F0',
                                        borderRadius: '50%',
                                        border: '2px solid #fff'
                                    }}
                                ></div>
                            </div>
                            <div>
                                <Title level={2} style={{ margin: 0, marginBottom: '4px' }}>
                                    {intern?.name}
                                </Title>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#64748B',
                                        fontSize: '14px',
                                        marginBottom: '8px'
                                    }}
                                >
                                    <span>
                                        <IdcardOutlined /> {intern?.track} Intern
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {intern?.startDate} - {intern?.endDate}
                                    </span>
                                </div>
                                <Tag color='blue' style={{ borderRadius: '12px' }}>
                                    Engineering Dept
                                </Tag>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', borderLeft: '1px solid #E2E8F0', paddingLeft: '24px' }}>
                            <Text
                                type='secondary'
                                style={{
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 600,
                                    display: 'block'
                                }}
                            >
                                Overall Progress
                            </Text>
                            <Text strong style={{ fontSize: '18px' }}>
                                {intern?.progress}% Completed
                            </Text>
                            <Progress percent={intern?.progress} size='small' status='active' />
                        </div>
                    </div>
                </Card>

                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col span={12}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <HistoryOutlined
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    fontSize: '64px',
                                    color: '#f3f4f6',
                                    zIndex: 0
                                }}
                            />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Text
                                        type='secondary'
                                        style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}
                                    >
                                        Mid-term Score
                                    </Text>
                                    <CheckCircleOutlined style={{ color: '#10B981' }} />
                                </div>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 700 }}>8.2</span>
                                    <span style={{ fontSize: '18px', color: '#9ca3af' }}>/10</span>
                                </div>
                                <Text type='success' style={{ fontWeight: 500 }}>
                                    <LineChartOutlined /> On Track
                                </Text>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <HistoryOutlined
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    fontSize: '64px',
                                    color: '#f3f4f6',
                                    zIndex: 0
                                }}
                            />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Text
                                        type='secondary'
                                        style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}
                                    >
                                        Project Phase
                                    </Text>
                                    <CheckCircleOutlined style={{ color: '#10B981' }} />
                                </div>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 700 }}>9.4</span>
                                    <span style={{ fontSize: '18px', color: '#9ca3af' }}>/10</span>
                                </div>
                                <Text type='success' style={{ fontWeight: 500 }}>
                                    <TrophyOutlined /> Exceeds Expectations
                                </Text>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}
                >
                    <Title level={3} style={{ margin: 0 }}>
                        Final Assessment Form
                    </Title>
                    <Tag style={{ borderRadius: '12px', padding: '4px 12px' }}>Draft saved recently</Tag>
                </div>

                <Form
                    form={form}
                    layout='vertical'
                    onFinish={onFinish}
                    initialValues={{
                        codeQuality: 4,
                        architecture: 3,
                        tooling: 5,
                        attitude: 5,
                        communication: 4,
                        teamwork: 4
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                        <Collapse
                            defaultActiveKey={['1', '2']}
                            expandIconPosition='end'
                            style={{ background: 'transparent', border: 'none' }}
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
                                                    color: '#1E40AF'
                                                }}
                                            >
                                                <TeamOutlined />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                                    Attitude & Soft Skills
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#64748B' }}>
                                                    Punctuality, proactiveness, and cultural fit.
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                    style: {
                                        background: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0',
                                        overflow: 'hidden',
                                        marginBottom: '16px'
                                    },
                                    children: (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            <Form.Item name='attitude' label='Attitude & Proactiveness'>
                                                <Radio.Group buttonStyle='solid'>
                                                    {[1, 2, 3, 4, 5].map((v) => (
                                                        <Radio.Button key={v} value={v}>
                                                            {v}
                                                        </Radio.Button>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item name='communication' label='Communication'>
                                                <Radio.Group buttonStyle='solid'>
                                                    {[1, 2, 3, 4, 5].map((v) => (
                                                        <Radio.Button key={v} value={v}>
                                                            {v}
                                                        </Radio.Button>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item name='teamwork' label='Teamwork & Collaboration'>
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
                                                    background: '#1E40AF',
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
                                                    Technical Proficiency
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#64748B' }}>
                                                    Code quality, tool mastery, and problem solving.
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                    style: {
                                        background: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0',
                                        overflow: 'hidden',
                                        marginBottom: '16px'
                                    },
                                    children: (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '32px',
                                                padding: '16px 0'
                                            }}
                                        >
                                            {[
                                                {
                                                    name: 'codeQuality',
                                                    title: 'Code Quality & Standards',
                                                    desc: 'Adherence to style guides, readability, and commenting practices.'
                                                },
                                                {
                                                    name: 'architecture',
                                                    title: 'Architecture & Design',
                                                    desc: 'Ability to understand system design and contribute to architectural decisions.'
                                                },
                                                {
                                                    name: 'tooling',
                                                    title: 'Tooling Proficiency',
                                                    desc: 'Comfort with Git, Docker, CI/CD pipelines and IDEs.'
                                                }
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        borderBottom: i < 2 ? '1px solid #E2E8F0' : 'none',
                                                        paddingBottom: i < 2 ? '24px' : 0
                                                    }}
                                                >
                                                    <div style={{ maxWidth: '300px' }}>
                                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                            {item.title}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#64748B' }}>
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Text
                                                            type='secondary'
                                                            style={{ fontSize: '12px', textTransform: 'uppercase' }}
                                                        >
                                                            Poor
                                                        </Text>
                                                        <Form.Item name={item.name} noStyle>
                                                            <Radio.Group buttonStyle='solid'>
                                                                {[1, 2, 3, 4, 5].map((val) => (
                                                                    <Radio.Button
                                                                        key={val}
                                                                        value={val}
                                                                        style={{
                                                                            width: 40,
                                                                            textAlign: 'center',
                                                                            borderRadius: '8px',
                                                                            margin: '0 4px',
                                                                            border: '1px solid #E2E8F0'
                                                                        }}
                                                                    >
                                                                        {val}
                                                                    </Radio.Button>
                                                                ))}
                                                            </Radio.Group>
                                                        </Form.Item>
                                                        <Text
                                                            type='secondary'
                                                            style={{ fontSize: '12px', textTransform: 'uppercase' }}
                                                        >
                                                            Excellent
                                                        </Text>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </div>

                    <Card bordered={false} style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '24px' }}>
                            <TrophyOutlined style={{ fontSize: '32px', color: '#1E40AF' }} />
                            <div>
                                <Title level={4} style={{ margin: 0 }}>
                                    Final Recommendation
                                </Title>
                                <Text type='secondary'>
                                    This decision will be forwarded to the HR department for final processing.
                                </Text>
                            </div>
                        </div>

                        <Row gutter={32}>
                            <Col span={12}>
                                <Form.Item
                                    label={<Text strong>Recommendation Action</Text>}
                                    name='recommendation'
                                    rules={[{ required: true }]}
                                >
                                    <Select placeholder='Select an outcome...' style={{ width: '100%' }} size='large'>
                                        <Select.Option value='hire'>Hire Full-time</Select.Option>
                                        <Select.Option value='extend'>Extend Internship (3 Months)</Select.Option>
                                        <Select.Option value='end'>End Program</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Text type='secondary' style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                    Please consult with the Department Head before selecting "Hire Full-time".
                                </Text>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<Text strong>Confidential Note for HR</Text>}
                                    name='hrNote'
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={4} placeholder='Add context for your decision...' />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <div
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
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
                                maxWidth: '1000px',
                                margin: '0 auto',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Text
                                    type='secondary'
                                    style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600 }}
                                >
                                    Form Status
                                </Text>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Text strong style={{ fontSize: '14px', color: '#1E40AF' }}>
                                        Ready to Submit
                                    </Text>
                                </div>
                            </div>
                            <Space>
                                <Button icon={<SaveOutlined />} onClick={() => message.success('Draft saved!')}>
                                    Save Draft
                                </Button>
                                <Button
                                    type='primary'
                                    icon={<SendOutlined />}
                                    size='large'
                                    onClick={() => form.submit()}
                                    loading={isProcessing}
                                >
                                    Submit Evaluation
                                </Button>
                            </Space>
                        </div>
                    </div>
                </Form>
            </Content>
        </Layout>
    );
};
