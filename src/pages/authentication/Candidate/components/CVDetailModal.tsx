import {
    DownloadOutlined,
    EnvironmentOutlined,
    FilePdfOutlined,
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
    List,
    Modal,
    Row,
    Space,
    Tag,
    Timeline,
    Typography,
    message,
    Spin,
    Empty
} from 'antd';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCandidate, useShortlistCandidate, useRejectCandidate } from '../../../../hooks/Recruitment/useCandidates';

const { Title, Text, Paragraph } = Typography;

interface CVDetailModalProps {
    open: boolean;
    onCancel: () => void;
    candidateId: string | null;
}

export const CVDetailModal = ({ open, onCancel, candidateId }: CVDetailModalProps) => {
    const { t } = useTranslation();
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const { data: candidateData, isLoading: isCandidateLoading, refetch } = useCandidate(candidateId || '');
    const shortlistMutation = useShortlistCandidate();
    const rejectMutation = useRejectCandidate();

    useEffect(() => {
        if (open && candidateId) {
            refetch();
        }
    }, [open, candidateId, refetch]);

    const handleApprove = async () => {
        if (!candidateId) return;
        try {
            await shortlistMutation.mutateAsync({ id: candidateId });
            message.success(t('common.success'));
            refetch();
        } catch {
            message.error(t('common.error'));
        }
    };

    const handleReject = async () => {
        if (!candidateId) return;
        try {
            await rejectMutation.mutateAsync({ id: candidateId, reason: rejectReason });
            setIsRejectModalOpen(false);
            message.success(t('common.success'));
            refetch();
        } catch {
            message.error(t('common.error'));
        }
    };

    const candidate = candidateData?.data;

    return (
        <Modal
            title={t('candidate.candidate_info')}
            open={open}
            onCancel={onCancel}
            width={1000}
            footer={[
                <Button key="close" onClick={onCancel}>
                    {t('common.close')}
                </Button>
            ]}
            destroyOnClose
        >
            {isCandidateLoading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <Spin size='large' />
                </div>
            ) : !candidate ? (
                <Empty description='Candidate not found' />
            ) : (
                <div style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden', padding: '10px' }}>
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #f0f0f0',
                            marginBottom: '20px'
                        }}
                    >
                        <Row gutter={24} align="middle">
                            <Col xs={24} md={16}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <Avatar size={80} src={candidate.avatar} />
                                    <div>
                                        <Title level={3} style={{ margin: '0 0 4px 0' }}>
                                            {candidate.name}
                                        </Title>
                                        <Text type='secondary' style={{ fontSize: '15px', display: 'block', marginBottom: '8px' }}>
                                            {candidate.role}
                                        </Text>
                                        <Space split={<Divider type="vertical" />} wrap>
                                            <span>
                                                <MailOutlined /> {candidate.email}
                                            </span>
                                            <span>
                                                <PhoneOutlined /> {candidate.phone}
                                            </span>
                                            <span>
                                                <EnvironmentOutlined /> {candidate.location}
                                            </span>
                                        </Space>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                <Tag
                                    color={
                                        candidate.status === 'Shortlisted'
                                            ? 'success'
                                            : candidate.status === 'Rejected'
                                                ? 'error'
                                                : 'warning'
                                    }
                                    style={{ fontSize: '14px', padding: '4px 12px', marginBottom: '16px' }}
                                >
                                    {candidate.status === 'Shortlisted'
                                        ? t('candidate.shortlisted')
                                        : candidate.status === 'Rejected'
                                            ? t('candidate.rejected')
                                            : t('candidate.pending_review')}
                                </Tag>
                                <div style={{ marginTop: '12px' }}>
                                    <Space>
                                        <Button icon={<DownloadOutlined />} size="small">{t('candidate.download_cv')}</Button>
                                        {candidate.status !== 'Rejected' && (
                                            <>
                                                <Button
                                                    danger
                                                    size="small"
                                                    onClick={() => setIsRejectModalOpen(true)}
                                                    loading={rejectMutation.isPending}
                                                >
                                                    {t('candidate.reject_candidate_btn')}
                                                </Button>
                                                <Button
                                                    type='primary'
                                                    size="small"
                                                    onClick={handleApprove}
                                                    disabled={candidate.status === 'Shortlisted'}
                                                    loading={shortlistMutation.isPending}
                                                >
                                                    {candidate.status === 'Shortlisted'
                                                        ? t('candidate.shortlisted')
                                                        : t('candidate.shortlist_candidate_btn')}
                                                </Button>
                                            </>
                                        )}
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <Row gutter={20}>
                        <Col span={15}>
                            <Card size="small" title={t('candidate.candidate_info')} style={{ marginBottom: '20px' }}>
                                <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600 }}>
                                    <Descriptions.Item label={t('candidate.education')}>
                                        {candidate.education}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t('candidate.experience')}>
                                        {candidate.experience}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t('candidate.skills')}>
                                        <Space size={[0, 4]} wrap>
                                            {candidate.skills?.map((skill) => <Tag key={skill} style={{ fontSize: '11px' }}>{skill}</Tag>)}
                                        </Space>
                                    </Descriptions.Item>
                                </Descriptions>

                                <Divider style={{ margin: '12px 0' }} />

                                <Title level={5} style={{ fontSize: '14px' }}>{t('candidate.cover_letter')}</Title>
                                <Paragraph style={{ color: '#4b5563', fontSize: '13px' }}>
                                    {candidate.coverLetter || 'No cover letter provided.'}
                                </Paragraph>

                                <Divider style={{ margin: '12px 0' }} />

                                <Title level={5} style={{ fontSize: '14px' }}>{t('candidate.resume_preview')}</Title>
                                <div
                                    style={{
                                        height: '200px',
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
                                            style={{ fontSize: '32px', color: '#ff4d4f', marginBottom: '8px' }}
                                        />
                                        <Text type='secondary' style={{ display: 'block', fontSize: '12px' }}>
                                            {candidate.name.replace(' ', '_')}_Resume.pdf
                                        </Text>
                                        <Button type='link' size="small">{t('candidate.click_to_preview')}</Button>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col span={9}>
                            <Card size="small" title={t('candidate.app_timeline')} style={{ marginBottom: '20px' }}>
                                <Timeline
                                    items={[
                                        {
                                            color: 'green',
                                            children: (
                                                <div style={{ fontSize: '12px' }}>
                                                    <Text strong>{t('candidate.applied')}</Text>
                                                    <br />
                                                    <Text type='secondary'>{candidate.appliedDate}</Text>
                                                </div>
                                            )
                                        },
                                        {
                                            color: 'blue',
                                            children: (
                                                <div style={{ fontSize: '12px' }}>
                                                    <Text strong>{t('candidate.screening')}</Text>
                                                    <br />
                                                    <Text type='secondary'>{candidate.matchScore}% match</Text>
                                                </div>
                                            )
                                        },
                                        {
                                            color: candidate.status === 'Shortlisted' ? 'blue' : 'gray',
                                            children: (
                                                <div style={{ fontSize: '12px' }}>
                                                    <Text strong>{t('candidate.shortlisted')}</Text>
                                                </div>
                                            )
                                        }
                                    ]}
                                />
                            </Card>

                            <Card size="small" title={t('candidate.internal_notes')}>
                                <List
                                    size="small"
                                    dataSource={[
                                        {
                                            user: 'System',
                                            text: `Match score: ${candidate.matchScore}%`,
                                            time: candidate.timeAgo
                                        }
                                    ]}
                                    renderItem={(item) => (
                                        <List.Item style={{ padding: '8px 0' }}>
                                            <List.Item.Meta
                                                avatar={<Avatar icon={<UserOutlined />} size='small' />}
                                                title={<Text style={{ fontSize: '11px' }}>{item.user} • {item.time}</Text>}
                                                description={<Text style={{ fontSize: '12px' }}>{item.text}</Text>}
                                            />
                                        </List.Item>
                                    )}
                                />
                                <div style={{ marginTop: '12px' }}>
                                    <Input.TextArea placeholder={`${t('candidate.add_note')}...`} rows={2} style={{ fontSize: '12px' }} />
                                    <Button type='primary' size='small' style={{ marginTop: '8px', float: 'right' }}>
                                        {t('candidate.add_note')}
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}

            <Modal
                title={t('candidate.reject_confirm_title')}
                open={isRejectModalOpen}
                onOk={handleReject}
                onCancel={() => setIsRejectModalOpen(false)}
                okText={t('candidate.reject_candidate_btn')}
                okButtonProps={{ danger: true, loading: rejectMutation.isPending }}
                zIndex={1100}
            >
                <p>{t('candidate.reject_confirm_msg')}</p>
                <Input.TextArea
                    placeholder={t('candidate.reject_reason_label')}
                    rows={3}
                    style={{ marginTop: '16px' }}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                />
            </Modal>
        </Modal>
    );
};
