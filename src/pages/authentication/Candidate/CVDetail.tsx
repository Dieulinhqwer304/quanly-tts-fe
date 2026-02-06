import {
    DownloadOutlined,
    EnvironmentOutlined,
    FilePdfOutlined,
    LinkedinOutlined,
    LeftOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Input,
    Layout,
    List,
    Modal,
    Row,
    Space,
    Tag,
    Timeline,
    Typography,
    message
} from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export const CVDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<string>('Pending Review');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const candidate = {
        id: id || '1',
        name: 'Sarah Jenkins',
        role: 'Frontend Developer Intern',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        avatar: 'https://i.pravatar.cc/150?u=1',
        education: 'BS Computer Science, University of Tech (2024)',
        experience: '2 Previous Internships',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
        resumeUrl: '#',
        appliedDate: '2023-10-24'
    };

    const handleApprove = () => {
        setStatus('Shortlisted');
        message.success(t('common.success'));
    };

    const handleReject = () => {
        setIsRejectModalOpen(false);
        setStatus('Rejected');
        message.error(t('common.error'));
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f6f7f8' }}>
            <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <div style={{ marginBottom: '24px' }}>
                    <Button icon={<LeftOutlined />} type='link' onClick={() => navigate('/recruitment/cvs')} style={{ paddingLeft: 0 }}>
                        {t('candidate.back_to_candidates')}
                    </Button>
                </div>

                <div
                    style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        marginBottom: '24px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '16px'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <Avatar size={80} src={candidate.avatar} />
                            <div>
                                <Title level={2} style={{ margin: '0 0 8px 0' }}>
                                    {candidate.name}
                                </Title>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <Text type='secondary' style={{ fontSize: '16px' }}>
                                        {candidate.role}
                                    </Text>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            color: '#6b7280',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <span>
                                            <MailOutlined /> {candidate.email}
                                        </span>
                                        <span>
                                            <PhoneOutlined /> {candidate.phone}
                                        </span>
                                        <span>
                                            <EnvironmentOutlined /> {candidate.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <Tag
                                    color={
                                        status === 'Shortlisted'
                                            ? 'success'
                                            : status === 'Rejected'
                                                ? 'error'
                                                : 'warning'
                                    }
                                    style={{ fontSize: '14px', padding: '4px 12px' }}
                                >
                                    {status === 'Shortlisted' ? t('candidate.shortlisted') : status === 'Rejected' ? t('candidate.rejected') : t('candidate.pending_review')}
                                </Tag>
                            </div>
                            <Space>
                                <Button icon={<DownloadOutlined />}>{t('candidate.download_cv')}</Button>
                                {status !== 'Rejected' && (
                                    <>
                                        <Button danger onClick={() => setIsRejectModalOpen(true)}>
                                            {t('candidate.reject_candidate_btn')}
                                        </Button>
                                        <Button
                                            type='primary'
                                            onClick={handleApprove}
                                            disabled={status === 'Shortlisted'}
                                        >
                                            {status === 'Shortlisted' ? t('candidate.shortlisted') : t('candidate.shortlist_candidate_btn')}
                                        </Button>
                                    </>
                                )}
                            </Space>
                        </div>
                    </div>
                </div>

                <Row gutter={24}>
                    <Col xs={24} lg={16}>
                        <Card
                            title={t('candidate.candidate_info')}
                            bordered={false}
                            style={{ borderRadius: '12px', marginBottom: '24px' }}
                        >
                            <Descriptions column={1} labelStyle={{ fontWeight: 600, width: '150px' }}>
                                <Descriptions.Item label={t('candidate.education')}>{candidate.education}</Descriptions.Item>
                                <Descriptions.Item label={t('candidate.experience')}>{candidate.experience}</Descriptions.Item>
                                <Descriptions.Item label={t('candidate.skills')}>
                                    <Space size={[0, 8]} wrap>
                                        {candidate.skills.map((skill) => (
                                            <Tag key={skill}>{skill}</Tag>
                                        ))}
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label='LinkedIn'>
                                    <a href='#' style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <LinkedinOutlined /> linkedin.com/in/sarahjenkins
                                    </a>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            <Title level={5}>{t('candidate.cover_letter')}</Title>
                            <Paragraph style={{ color: '#4b5563' }}>
                                I am writing to express my strong interest in the Frontend Developer Intern position at
                                InternOS. As a final year Computer Science student, I have built several React
                                applications and have a deep passion for UI/UX. During my previous internship at
                                TechCorp, I helped migrate a legacy jQuery app to React, improving performance by 40%. I
                                am eager to bring my skills and enthusiasm to your team.
                            </Paragraph>

                            <Divider />

                            <Title level={5}>{t('candidate.resume_preview')}</Title>
                            <div
                                style={{
                                    height: '400px',
                                    background: '#f9fafb',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px dashed #d9d9d9'
                                }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <FilePdfOutlined
                                        style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }}
                                    />
                                    <Text type='secondary' style={{ display: 'block' }}>
                                        Sarah_Jenkins_Resume.pdf
                                    </Text>
                                    <Button type='link'>{t('candidate.click_to_preview')}</Button>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card
                            title={t('candidate.app_timeline')}
                            bordered={false}
                            style={{ borderRadius: '12px', marginBottom: '24px' }}
                        >
                            <Timeline
                                items={[
                                    {
                                        color: 'green',
                                        children: (
                                            <>
                                                <Text strong>{t('candidate.applied')}</Text>
                                                <br />
                                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                                    {candidate.appliedDate} - {t('candidate.via_website')}
                                                </Text>
                                            </>
                                        )
                                    },
                                    {
                                        color: 'blue',
                                        children: (
                                            <>
                                                <Text strong>{t('candidate.screening')}</Text>
                                                <br />
                                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                                    Oct 25, 2023 - {t('candidate.auto_screened')} (Match: 92%)
                                                </Text>
                                            </>
                                        )
                                    },
                                    {
                                        color: status === 'Shortlisted' ? 'blue' : 'gray',
                                        children: (
                                            <>
                                                <Text strong>{t('candidate.shortlisted')}</Text>
                                                <br />
                                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                                    {status === 'Shortlisted' ? `${t('candidate.just_now')} - by HR` : t('learning_path.draft')}
                                                </Text>
                                            </>
                                        )
                                    },
                                    {
                                        color: 'gray',
                                        children: t('candidate.interview')
                                    },
                                    {
                                        color: 'gray',
                                        children: t('candidate.offer')
                                    }
                                ]}
                            />
                        </Card>

                        <Card title={t('candidate.internal_notes')} bordered={false} style={{ borderRadius: '12px' }}>
                            <List
                                itemLayout='horizontal'
                                dataSource={[
                                    {
                                        user: 'System',
                                        text: 'Match score calculated: 92% based on keywords.',
                                        time: '2 days ago'
                                    }
                                ]}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} size='small' />}
                                            title={
                                                <Text style={{ fontSize: '12px' }}>
                                                    {item.user}{' '}
                                                    <Text type='secondary' style={{ marginLeft: '4px' }}>
                                                        {item.time}
                                                    </Text>
                                                </Text>
                                            }
                                            description={<Text style={{ fontSize: '13px' }}>{item.text}</Text>}
                                        />
                                    </List.Item>
                                )}
                            />
                            <div style={{ marginTop: '16px' }}>
                                <Input.TextArea placeholder={`${t('candidate.add_note')}...`} rows={2} />
                                <Button type='primary' size='small' style={{ marginTop: '8px', float: 'right' }}>
                                    {t('candidate.add_note')}
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title={t('candidate.reject_confirm_title')}
                    open={isRejectModalOpen}
                    onOk={handleReject}
                    onCancel={() => setIsRejectModalOpen(false)}
                    okText={t('candidate.reject_candidate_btn')}
                    okButtonProps={{ danger: true }}
                >
                    <p>
                        {t('candidate.reject_confirm_msg')}
                    </p>
                    <Input.TextArea
                        placeholder={t('candidate.reject_reason_label')}
                        rows={3}
                        style={{ marginTop: '16px' }}
                    />
                </Modal>
            </Content>
        </Layout>
    );
};
