import { SaveOutlined, RocketOutlined, StarOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Form,
    Input,
    Rate,
    Row,
    Space,
    Typography,
    message,
    Breadcrumb,
    Divider,
    Tag,
    Select
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
import { getProfile } from '../../../services/auth/profile';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const MentorEvalPhase2 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();

    const [internData, setInternData] = useState<any>(null);
    const [isInternLoading, setIsInternLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mentorProfile, setMentorProfile] = useState<any>(null);

    useEffect(() => {
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
        fetchIntern();
    }, [id]);

    useEffect(() => {
        getProfile().then((res) => setMentorProfile(res)).catch(() => {});
    }, []);

    const onFinish = async (values: any) => {
        if (!id || !internData) return;

        setIsProcessing(true);
        try {
            await http.post('/evaluations', {
                internId: id,
                internName: internData.user?.fullName || internData.name,
                mentorId: mentorProfile?.id,
                mentorName: mentorProfile?.fullName,
                type: 'Mid-term', // Phase 2
                technicalScore: Math.round(((values.techContribution + values.problemSolving) / 2) * 2),
                attitudeScore: Math.round(values.reliability * 2),
                teamworkScore: Math.round(values.teamwork * 2),
                feedback: values.accomplishments ? `${values.accomplishments}\n\nFeedback: ${values.feedback || ''}` : (values.feedback || ''),
                date: new Date().toISOString()
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
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Typography.Text>{t('common.loading')}</Typography.Text>
            </div>
        );
    }

    const intern = internData;

    return (
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[
                        { title: t('menu.mentor_portal') },
                        { title: t('menu.evaluations') },
                        { title: 'Phase 2: Project Collaboration' }
                    ]}
                />
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}
            >
                <Title level={3} style={{ margin: 0 }}>
                    Step 2: Project Collaboration Review
                </Title>
                <Space>
                    <Button icon={<SaveOutlined />}>Save Progress</Button>
                    <Button type='primary' onClick={() => form.submit()} loading={isProcessing}>
                        Submit Review
                    </Button>
                </Space>
            </div>

            <Card
                bordered={false}
                style={{
                    borderRadius: '12px',
                    marginBottom: '24px',
                    background: '#f9f0ff',
                    border: '1px solid #d3adf7'
                }}
            >
                <Row align='middle' gutter={24}>
                    <Col>
                        <Avatar size={64} src={intern?.user?.avatarUrl || intern?.avatar} />
                    </Col>
                    <Col flex='1'>
                        <Title level={4} style={{ margin: 0 }}>
                            {intern?.user?.fullName || intern?.name}
                        </Title>
                        <Text type='secondary'>
                            {intern?.track} • {intern?.id}
                        </Text>
                        <div style={{ marginTop: '4px' }}>
                            <Tag color='purple'>Month 3-5 Review</Tag>
                            <Tag color='geekblue'>Project Phase</Tag>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Form form={form} layout='vertical' onFinish={onFinish}>
                <Card
                    title='Project Performance'
                    bordered={false}
                    style={{ borderRadius: '12px', marginBottom: '24px' }}
                >
                    <Row gutter={48}>
                        <Col span={12}>
                            <Form.Item
                                label='Technical Contribution'
                                name='techContribution'
                                rules={[{ required: true }]}
                            >
                                <Rate character={<StarOutlined />} />
                            </Form.Item>
                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                Impact of their code/work on the project.
                            </Text>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Problem Solving' name='problemSolving' rules={[{ required: true }]}>
                                <Rate character={<StarOutlined />} />
                            </Form.Item>
                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                Independence in identifying and fixing issues.
                            </Text>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={48}>
                        <Col span={12}>
                            <Form.Item label='Reliability' name='reliability' rules={[{ required: true }]}>
                                <Rate character={<StarOutlined />} />
                            </Form.Item>
                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                Meeting deadlines and consistent quality.
                            </Text>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Team Integration' name='teamwork' rules={[{ required: true }]}>
                                <Rate character={<StarOutlined />} />
                            </Form.Item>
                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                Collaboration with developers and designers.
                            </Text>
                        </Col>
                    </Row>
                </Card>

                <Card
                    title='Task/Milestone Summary'
                    bordered={false}
                    style={{ borderRadius: '12px', marginBottom: '24px' }}
                >
                    <Form.Item label='Major Accomplishments' name='accomplishments' rules={[{ required: true }]}>
                        <TextArea rows={4} placeholder='Key tasks or milestones reached during this project phase...' />
                    </Form.Item>

                    <Form.Item label='Project Mentor Feedback' name='feedback'>
                        <TextArea rows={3} placeholder='Additional comments on performance...' />
                    </Form.Item>
                </Card>

                <Card title='Final Step Readiness' bordered={false} style={{ borderRadius: '12px' }}>
                    <Form.Item
                        label='Readiness for Final Evaluation?'
                        name='readyForFinal'
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: 'ready', label: 'Ready - Begin graduation process' },
                                { value: 'not_ready', label: 'Not Ready - Extended project work needed' }
                            ]}
                        />
                    </Form.Item>
                    <div
                        style={{
                            background: '#f9f0ff',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid #d3adf7'
                        }}
                    >
                        <Space>
                            <RocketOutlined style={{ color: '#722ed1' }} />
                            <Text>Final evaluation determines hireability and program graduation.</Text>
                        </Space>
                    </div>
                </Card>
            </Form>
        </div>
    );
};
