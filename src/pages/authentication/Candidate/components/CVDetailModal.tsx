import {
    DownloadOutlined,
    FilePdfOutlined,
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
    Modal,
    Row,
    Space,
    Tag,
    Typography,
    message,
    Spin,
    Empty
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCandidate, useShortlistCandidate, useRejectCandidate } from '../../../../hooks/Recruitment/useCandidates';

import { Candidate } from '../../../../services/Recruitment/candidates';

const { Title, Text } = Typography;

interface CVDetailModalProps {
    open: boolean;
    onCancel: () => void;
    candidate: Candidate | null;
}

export const CVDetailModal = ({ open, onCancel, candidate: initialCandidate }: CVDetailModalProps) => {
    const { t } = useTranslation();
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const { data: candidateData, isLoading: isCandidateLoading, isError, refetch } = useCandidate(initialCandidate?.id || '');
    const shortlistMutation = useShortlistCandidate();
    const rejectMutation = useRejectCandidate();

    const candidate = candidateData?.data || initialCandidate;

    const handleApprove = async () => {
        if (!candidate?.id) return;
        try {
            await shortlistMutation.mutateAsync({ id: candidate.id });
            message.success(t('common.success'));
            refetch();
        } catch {
            message.error(t('common.error'));
        }
    };

    const handleReject = async () => {
        if (!candidate?.id) return;
        try {
            await rejectMutation.mutateAsync({ id: candidate.id, reason: rejectReason });
            setIsRejectModalOpen(false);
            message.success(t('common.success'));
            refetch();
        } catch {
            message.error(t('common.error'));
        }
    };

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
            {isCandidateLoading && !initialCandidate ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <Spin size='large' />
                </div>
            ) : isError ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <Empty description={t('common.error')} />
                </div>
            ) : !candidate ? (
                <Empty description='Candidate not found' />
            ) : (
                <div style={{ padding: '10px' }}>
                    <Card size="small" style={{ marginBottom: '20px', borderRadius: '8px' }}>
                        <Row gutter={24} align="middle">
                            <Col span={16}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <Avatar size={64} src={candidate.avatar} icon={<UserOutlined />} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{candidate.name}</Title>
                                        <Text type="secondary">{candidate.email}</Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Tag
                                    color={
                                        candidate.status === 'Shortlisted'
                                            ? 'success'
                                            : candidate.status === 'Rejected'
                                                ? 'error'
                                                : 'warning'
                                    }
                                    style={{ fontSize: '14px', padding: '4px 12px' }}
                                >
                                    {candidate.status === 'Shortlisted'
                                        ? t('candidate.shortlisted')
                                        : candidate.status === 'Rejected'
                                            ? t('candidate.rejected')
                                            : t('candidate.pending_review')}
                                </Tag>
                            </Col>
                        </Row>
                    </Card>

                    <Descriptions bordered column={1} size="small" labelStyle={{ width: '150px', fontWeight: 600 }}>
                        <Descriptions.Item label={t('candidate.job_title')}>
                            {candidate.role || candidate.appliedForTitle}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('candidate.applied_date')}>
                            {candidate.appliedDate}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('common.email')}>
                            {candidate.email}
                        </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginTop: '24px' }}>
                        <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FilePdfOutlined /> {t('candidate.resume_preview')}
                        </Title>
                        <div
                            style={{
                                padding: '24px',
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
                                    style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '12px' }}
                                />
                                <Text strong style={{ display: 'block' }}>
                                    {candidate.name.replace(' ', '_')}_Resume.pdf
                                </Text>
                                <Space style={{ marginTop: '12px' }}>
                                    <Button icon={<DownloadOutlined />}>{t('candidate.download_cv')}</Button>
                                    <Button type="primary">{t('candidate.click_to_preview')}</Button>
                                </Space>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            {candidate.status !== 'Rejected' && (
                                <>
                                    <Button
                                        danger
                                        onClick={() => setIsRejectModalOpen(true)}
                                        loading={rejectMutation.isPending}
                                    >
                                        {t('candidate.reject_candidate_btn')}
                                    </Button>
                                    <Button
                                        type='primary'
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
