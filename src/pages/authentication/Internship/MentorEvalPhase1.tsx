import {
    SaveOutlined,
    InfoCircleOutlined
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
    Tag
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const MentorEvalPhase1 = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        setLoading(true);
        console.log('Phase 1 Evaluation:', values);
        setTimeout(() => {
            setLoading(false);
            message.success('Phase 1 Evaluation submitted successfully!');
            navigate(RouteConfig.MentorRequestList.path);
        }, 1500);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[
                        { title: 'Mentor Portal' },
                        { title: 'Evaluations' },
                        { title: 'Phase 1: Training Period' },
                    ]}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Space align="center">
                    <Title level={3} style={{ margin: 0 }}>Step 1: Training Period Evaluation</Title>
                </Space>
                <Space>
                    <Button icon={<SaveOutlined />} onClick={() => message.info('Draft saved!')}>Save Draft</Button>
                    <Button type="primary" onClick={() => form.submit()} loading={loading}>Submit Evaluation</Button>
                </Space>
            </div>

            <Card bordered={false} style={{ borderRadius: '12px', marginBottom: '24px', background: '#e6f7ff' }}>
                <Row align="middle" gutter={24}>
                    <Col>
                        <Avatar size={64} src="https://i.pravatar.cc/150?u=1" />
                    </Col>
                    <Col flex="1">
                        <Title level={4} style={{ margin: 0 }}>Sarah Jenkins</Title>
                        <Text type="secondary">Frontend Developer Intern • Batch A</Text>
                        <div style={{ marginTop: '4px' }}>
                            <Tag color="blue">Month 1-2 Review</Tag>
                            <Tag color="cyan">Training Phase</Tag>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Card title="Core Performance" bordered={false} style={{ borderRadius: '12px', marginBottom: '24px' }}>
                    <Row gutter={48}>
                        <Col span={12}>
                            <Form.Item label="Learning Speed" name="learningSpeed" rules={[{ required: true }]}>
                                <Rate allowHalf />
                            </Form.Item>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Ability to grasp new concepts and technologies.</Text>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Communication" name="communication" rules={[{ required: true }]}>
                                <Rate allowHalf />
                            </Form.Item>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Effectiveness in team discussions and reporting.</Text>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={48}>
                        <Col span={12}>
                            <Form.Item label="Punctuality" name="punctuality" rules={[{ required: true }]}>
                                <Rate allowHalf />
                            </Form.Item>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Adherence to working hours and meeting schedules.</Text>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Code Quality" name="codeQuality" rules={[{ required: true }]}>
                                <Rate allowHalf />
                            </Form.Item>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Following established coding standards and cleanliness.</Text>
                        </Col>
                    </Row>
                </Card>

                <Card title="Detailed Assessment" bordered={false} style={{ borderRadius: '12px', marginBottom: '24px' }}>
                    <Form.Item
                        label="Strengths"
                        name="strengths"
                        rules={[{ required: true, message: 'Please list some strengths' }]}
                    >
                        <TextArea rows={3} placeholder="What has the intern done well so far?" />
                    </Form.Item>

                    <Form.Item
                        label="Areas for Improvement"
                        name="improvements"
                        rules={[{ required: true, message: 'Please list areas to improve' }]}
                    >
                        <TextArea rows={3} placeholder="What should the intern focus on for the next phase?" />
                    </Form.Item>
                </Card>

                <Card title="Phase 2 Recommendation" bordered={false} style={{ borderRadius: '12px' }}>
                    <Form.Item
                        label="Should this intern proceed to the Project Phase?"
                        name="proceedToPhase2"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: 'yes', label: 'Yes - Ready for real projects' },
                                { value: 'extended_training', label: 'Conditional - Needs 2 more weeks of training' },
                                { value: 'no', label: 'No - Not meeting requirements' }
                            ]}
                        />
                    </Form.Item>
                    <div style={{ background: '#f6ffed', padding: '16px', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
                        <Space>
                            <InfoCircleOutlined style={{ color: '#52c41a' }} />
                            <Text>Advancing to Phase 2 allows the intern to be assigned to client projects.</Text>
                        </Space>
                    </div>
                </Card>
            </Form>
        </div>
    );
};
