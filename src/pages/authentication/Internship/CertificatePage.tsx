import { Badge, Button, Card, Col, Descriptions, Row, Space, Steps, Switch, Typography, message } from 'antd';
import {
    CheckCircleOutlined,
    DownloadOutlined,
    FileTextOutlined,
    ShareAltOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

export const CertificatePage = () => {
    const [isCertified, setIsCertified] = useState(true);

    const handleDownload = () => {
        message.success('Certificate download started');
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        style={{
                            borderRadius: '16px',
                            border: '1px solid rgba(19, 109, 236, 0.15)',
                            background: 'linear-gradient(135deg, #f5f7ff 0%, #fdfbff 100%)'
                        }}
                        bodyStyle={{ padding: '28px' }}
                    >
                        <Space direction='vertical' size={16} style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Badge
                                        count={isCertified ? 'Certified' : 'In Progress'}
                                        color={isCertified ? 'green' : 'gold'}
                                    />
                                    <Title level={2} style={{ margin: '12px 0 0 0' }}>
                                        Internship Certificate
                                    </Title>
                                    <Text type='secondary'>Track your journey and unlock the final certificate.</Text>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <Text type='secondary' style={{ display: 'block', marginBottom: '8px' }}>
                                        Demo status
                                    </Text>
                                    <Switch
                                        checkedChildren='Certified'
                                        unCheckedChildren='In Progress'
                                        checked={isCertified}
                                        onChange={setIsCertified}
                                    />
                                </div>
                            </div>

                            <Steps
                                current={isCertified ? 4 : 3}
                                items={[
                                    { title: 'Onboarding' },
                                    { title: 'Phase 1' },
                                    { title: 'Phase 2' },
                                    { title: 'Final Evaluation' },
                                    { title: 'Certified' }
                                ]}
                            />

                            <Card
                                style={{
                                    borderRadius: '14px',
                                    border: '1px dashed #d9d9d9',
                                    background: '#fff'
                                }}
                                bodyStyle={{ padding: '24px' }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '16px'
                                    }}
                                >
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>
                                            Certificate Preview
                                        </Title>
                                        <Text type='secondary'>A preview of your completion certificate.</Text>
                                    </div>
                                    <Space>
                                        <Button
                                            type='primary'
                                            icon={<DownloadOutlined />}
                                            disabled={!isCertified}
                                            onClick={handleDownload}
                                        >
                                            Download PDF
                                        </Button>
                                        <Button icon={<ShareAltOutlined />} disabled={!isCertified}>
                                            Share to LinkedIn
                                        </Button>
                                    </Space>
                                </div>

                                <div
                                    style={{
                                        marginTop: '20px',
                                        padding: '32px',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(19, 109, 236, 0.2)',
                                        background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            margin: '0 auto 16px auto',
                                            borderRadius: '50%',
                                            background: 'rgba(19, 109, 236, 0.12)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <TrophyOutlined style={{ fontSize: '28px', color: '#136dec' }} />
                                    </div>
                                    <Title level={3} style={{ marginBottom: '4px' }}>
                                        Certificate of Completion
                                    </Title>
                                    <Text type='secondary'>This certificate is awarded to</Text>
                                    <Title level={4} style={{ margin: '8px 0' }}>
                                        Nguyen Van A
                                    </Title>
                                    <Text type='secondary'>for successfully completing the internship program</Text>
                                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#8c8c8c' }}>
                                        Issue Date: 2025-09-02 • Certificate ID: INT-2025-0932
                                    </div>
                                </div>
                            </Card>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Space direction='vertical' size={24} style={{ width: '100%' }}>
                        <Card style={{ borderRadius: '14px' }}>
                            <Title level={4} style={{ marginTop: 0 }}>
                                Internship Details
                            </Title>
                            <Descriptions column={1} size='small' bordered>
                                <Descriptions.Item label='Department'>Product Engineering</Descriptions.Item>
                                <Descriptions.Item label='Mentor'>Sarah Jenkins</Descriptions.Item>
                                <Descriptions.Item label='Duration'>Jun 2025 - Sep 2025</Descriptions.Item>
                                <Descriptions.Item label='Final Grade'>A-</Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card style={{ borderRadius: '14px' }}>
                            <Space align='start'>
                                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                                <div>
                                    <Title level={5} style={{ marginTop: 0 }}>
                                        Next step
                                    </Title>
                                    <Text type='secondary'>
                                        Keep your LinkedIn profile updated and include the certificate link once it is
                                        issued.
                                    </Text>
                                </div>
                            </Space>
                        </Card>

                        <Card style={{ borderRadius: '14px', background: '#f9fafb', border: '1px dashed #d9d9d9' }}>
                            <Space align='start'>
                                <FileTextOutlined style={{ color: '#136dec', fontSize: '20px' }} />
                                <div>
                                    <Title level={5} style={{ marginTop: 0 }}>
                                        Completion Checklist
                                    </Title>
                                    <Text type='secondary'>
                                        Ensure final evaluation, mentor feedback, and HR confirmation are completed.
                                    </Text>
                                </div>
                            </Space>
                        </Card>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};
