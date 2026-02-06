import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloudUploadOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    FieldTimeOutlined,
    GlobalOutlined,
    HourglassOutlined,
    LaptopOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Layout, Row, Tag, Typography, Upload, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export const JobDetailPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);

        console.log('Received values of form: ', values);

        Modal.success({
            title: 'Application Submitted!',
            content: 'Thank you for applying. We have received your application and will review it shortly.',
            okText: 'Back to Jobs',
            onOk: () => navigate('/jobs')
        });

        form.resetFields();
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f6f7f8' }}>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '0 24px'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            background: 'rgba(19, 109, 236, 0.1)',
                            color: '#136dec',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px'
                        }}
                    >
                        <GlobalOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
                        InternFlow
                    </Title>
                </div>
                <Button
                    type='text'
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/jobs')}
                    style={{ fontWeight: 600, color: '#617289' }}
                >
                    Back to Careers
                </Button>
            </Header>

            <Content style={{ padding: '40px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Row gutter={[48, 48]}>
                        <Col xs={24} lg={16}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        <Tag
                                            color='blue'
                                            style={{
                                                margin: 0,
                                                padding: '4px 12px',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            Marketing
                                        </Tag>
                                        <Text
                                            type='secondary'
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <EnvironmentOutlined /> San Francisco, CA
                                        </Text>
                                    </div>
                                    <Title level={1} style={{ margin: 0, fontSize: '36px', fontWeight: 900 }}>
                                        Social Media Marketing Intern
                                    </Title>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {[
                                        { icon: <LaptopOutlined />, text: 'Remote Friendly' },
                                        { icon: <DollarOutlined />, text: 'Paid Internship' },
                                        { icon: <FieldTimeOutlined />, text: 'Full-time' }
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '8px 16px',
                                                background: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: '#374151'
                                            }}
                                        >
                                            <span style={{ color: '#617289' }}>{item.icon}</span>
                                            {item.text}
                                        </div>
                                    ))}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '8px 16px',
                                            background: '#fef2f2',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            color: '#dc2626'
                                        }}
                                    >
                                        <HourglassOutlined /> Apply by Oct 30
                                    </div>
                                </div>

                                <Card bordered={false} style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                    <Row gutter={16}>
                                        <Col span={6}>
                                            <Text
                                                type='secondary'
                                                style={{
                                                    fontSize: '12px',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Duration
                                            </Text>
                                            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                                                6 Months
                                            </div>
                                        </Col>
                                        <Col span={6}>
                                            <Text
                                                type='secondary'
                                                style={{
                                                    fontSize: '12px',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Stipend
                                            </Text>
                                            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                                                $2,500/mo
                                            </div>
                                        </Col>
                                        <Col span={6}>
                                            <Text
                                                type='secondary'
                                                style={{
                                                    fontSize: '12px',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Level
                                            </Text>
                                            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                                                Entry Level
                                            </div>
                                        </Col>
                                        <Col span={6}>
                                            <Text
                                                type='secondary'
                                                style={{
                                                    fontSize: '12px',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Start Date
                                            </Text>
                                            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                                                Nov 15, 2023
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>

                                <div style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151' }}>
                                    <Title level={3}>About the Role</Title>
                                    <Paragraph>
                                        We are looking for a creative and driven Social Media Marketing Intern to join
                                        our dynamic Marketing Department in San Francisco. This is a unique opportunity
                                        to gain hands-on experience in building brand awareness and engaging communities
                                        across various social platforms for a fast-growing enterprise software company.
                                    </Paragraph>
                                    <Paragraph>
                                        You will work closely with our Content Manager and Design team to brainstorm
                                        ideas, create engaging content, and analyze performance metrics. If you live on
                                        TikTok, understand the nuances of LinkedIn B2B marketing, and have a knack for
                                        storytelling, we want to hear from you.
                                    </Paragraph>

                                    <Title level={3}>Key Responsibilities</Title>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {[
                                            'Assist in managing and creating content for our social media channels (LinkedIn, Twitter, Instagram).',
                                            'Engage with our community by responding to comments and messages in a timely manner.',
                                            'Conduct research on industry trends and competitor activities to inform content strategy.',
                                            'Help coordinate webinars and live events, including promotional activities.'
                                        ].map((item, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                                <CheckCircleOutlined style={{ color: '#136dec', marginTop: '4px' }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <Title level={3}>Requirements</Title>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {[
                                            'Currently enrolled in or recently graduated with a degree in Marketing, Communications, or related field.',
                                            'Strong written and verbal communication skills with an eye for detail.',
                                            'Familiarity with design tools like Canva or Adobe Creative Suite is a plus.',
                                            'Self-starter with the ability to manage multiple tasks and deadlines.'
                                        ].map((item, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                                <div
                                                    style={{
                                                        width: 6,
                                                        height: 6,
                                                        background: '#617289',
                                                        borderRadius: '50%',
                                                        marginTop: '10px'
                                                    }}
                                                ></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <Title level={3}>Benefits</Title>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '12px',
                                                    padding: '16px',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    background: '#fff'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        background: 'rgba(19, 109, 236, 0.1)',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#136dec'
                                                    }}
                                                >
                                                    <GlobalOutlined />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#111418' }}>Mentorship</div>
                                                    <div style={{ fontSize: '14px', color: '#617289' }}>
                                                        Weekly 1:1s with senior leaders
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '12px',
                                                    padding: '16px',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    background: '#fff'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        background: 'rgba(19, 109, 236, 0.1)',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#136dec'
                                                    }}
                                                >
                                                    <DollarOutlined />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#111418' }}>
                                                        Competitive Pay
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#617289' }}>
                                                        Monthly stipend + bonuses
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} lg={8}>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                <Card
                                    bordered={false}
                                    style={{ borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    bodyStyle={{ padding: '24px' }}
                                >
                                    <div style={{ marginBottom: '24px' }}>
                                        <Title level={3} style={{ margin: 0 }}>
                                            Ready to apply?
                                        </Title>
                                        <Text type='secondary'>Complete the form below to start your journey.</Text>
                                    </div>

                                    <Form form={form} layout='vertical' onFinish={onFinish}>
                                        <Row gutter={12}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name='firstName'
                                                    label='First Name'
                                                    rules={[
                                                        { required: true, message: 'Please input your first name!' }
                                                    ]}
                                                >
                                                    <Input placeholder='Jane' size='large' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name='lastName'
                                                    label='Last Name'
                                                    rules={[
                                                        { required: true, message: 'Please input your last name!' }
                                                    ]}
                                                >
                                                    <Input placeholder='Doe' size='large' />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            name='email'
                                            label='Email Address'
                                            rules={[
                                                {
                                                    required: true,
                                                    type: 'email',
                                                    message: 'Please enter a valid email!'
                                                }
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                                                placeholder='jane@example.com'
                                                size='large'
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name='phone'
                                            label='Phone Number'
                                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                                        >
                                            <Input
                                                prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />}
                                                placeholder='+1 (555) 000-0000'
                                                size='large'
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label='Resume/CV'
                                            name='resume'
                                            rules={[{ required: true, message: 'Please upload your resume!' }]}
                                        >
                                            <Upload.Dragger
                                                style={{
                                                    padding: '24px',
                                                    background: '#f8f9fa',
                                                    border: '2px dashed #dbe0e6'
                                                }}
                                                maxCount={1}
                                            >
                                                <p className='ant-upload-drag-icon'>
                                                    <CloudUploadOutlined
                                                        style={{ fontSize: '32px', color: '#136dec' }}
                                                    />
                                                </p>
                                                <p
                                                    className='ant-upload-text'
                                                    style={{ fontSize: '14px', fontWeight: 500 }}
                                                >
                                                    Click to upload or drag and drop
                                                </p>
                                                <p
                                                    className='ant-upload-hint'
                                                    style={{ fontSize: '12px', color: '#617289' }}
                                                >
                                                    PDF, DOCX up to 5MB
                                                </p>
                                            </Upload.Dragger>
                                        </Form.Item>

                                        <Button
                                            type='primary'
                                            htmlType='submit'
                                            size='large'
                                            block
                                            loading={loading}
                                            style={{
                                                height: '48px',
                                                fontWeight: 700,
                                                fontSize: '16px',
                                                background: '#136dec'
                                            }}
                                        >
                                            Submit Application
                                        </Button>

                                        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px' }}>
                                            <Text type='secondary'>
                                                By applying, you agree to our <a href='#'>Privacy Policy</a>.
                                            </Text>
                                        </div>
                                    </Form>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );
};
