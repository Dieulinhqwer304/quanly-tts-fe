import { Badge, Button, Card, Col, Descriptions, Row, Skeleton, Space, Steps, Typography, message } from 'antd';
import {
    CheckCircleOutlined,
    DownloadOutlined,
    FileTextOutlined,
    ShareAltOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import { useIntern } from '../../../hooks/Internship/useInterns';
import { useEvaluations } from '../../../hooks/Internship/useEvaluations';

const { Title, Text } = Typography;

export const CertificatePage = () => {
    const internId = 'ITS-001'; // Mock current intern ID
    const { data: internDetail, isLoading: isLoadingIntern } = useIntern(internId);
    const { data: evaluationsData, isLoading: isLoadingEvaluations } = useEvaluations({
        internId
    });

    const intern = internDetail?.data;
    const evaluations = evaluationsData?.data?.hits || [];

    const finalEvaluation = evaluations.find((e) => e.type === 'Final' && e.status === 'Completed');
    const isCertified = intern?.progress === 100 && !!finalEvaluation;

    const handleDownload = () => {
        message.success('Certificate download started');
    };

    if (isLoadingIntern || isLoadingEvaluations) {
        return (
            <div style={{ padding: '24px' }}>
                <Skeleton active paragraph={{ rows: 10 }} />
            </div>
        );
    }

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
                            </div>

                            <Steps
                                current={isCertified ? 4 : finalEvaluation ? 3 : intern && intern.progress > 50 ? 2 : 1}
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
                                        {intern?.name || '---'}
                                    </Title>
                                    <Text type='secondary'>for successfully completing the internship program</Text>
                                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#8c8c8c' }}>
                                        Issue Date: {isCertified ? new Date().toISOString().split('T')[0] : 'Pending'} •
                                        Certificate ID:{' '}
                                        {isCertified ? `INT-${internId}-${new Date().getFullYear()}` : 'Pending'}
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
                                <Descriptions.Item label='Department'>{intern?.track || '---'}</Descriptions.Item>
                                <Descriptions.Item label='Mentor'>{intern?.mentor || '---'}</Descriptions.Item>
                                <Descriptions.Item label='Duration'>
                                    {intern?.startDate} - {intern?.endDate}
                                </Descriptions.Item>
                                <Descriptions.Item label='Final Grade'>
                                    {finalEvaluation?.score
                                        ? finalEvaluation.score >= 90
                                            ? 'A'
                                            : finalEvaluation.score >= 80
                                              ? 'B'
                                              : 'C'
                                        : '---'}
                                </Descriptions.Item>
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
                                        {isCertified
                                            ? 'Keep your LinkedIn profile updated and include the certificate link once it is issued.'
                                            : 'Complete your remaining tasks and final evaluation to unlock your certificate.'}
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
