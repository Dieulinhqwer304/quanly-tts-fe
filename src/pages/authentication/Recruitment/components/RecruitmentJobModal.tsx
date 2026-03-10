import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    message,
    Modal
} from 'antd';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { JobPosition } from '../../../../services/Recruitment/jobPositions';
import { useResponsive } from '../../../../hooks/useResponsive';

interface RecruitmentJobModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    onSubmit: (values: JobFormValues) => Promise<void>;
    campaignOptions: Array<{ value: string; label: string }>;
    initialValues?: JobPosition | null;
    viewOnly?: boolean;
}

export interface JobFormValues {
    title: string;
    campaignId: string;
    department: string;
    requiredQuantity: number;
    status: 'draft' | 'open' | 'closed' | 'on_hold';
    description?: string;
    requirements?: string;
    location?: string;
    salaryRange?: string;
}

const normalizeStatus = (status?: string): JobFormValues['status'] => {
    const normalized = (status || 'draft').toLowerCase().replace(/\s+/g, '_');
    if (normalized === 'open') return 'open';
    if (normalized === 'closed') return 'closed';
    if (normalized === 'on_hold') return 'on_hold';
    return 'draft';
};

export const RecruitmentJobModal = ({
    open,
    onCancel,
    onSuccess,
    onSubmit,
    campaignOptions,
    initialValues,
    viewOnly
}: RecruitmentJobModalProps) => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue({
                    title: initialValues.title,
                    campaignId: initialValues.recruitmentPlanId,
                    department: initialValues.department,
                    requiredQuantity: initialValues.requiredQuantity,
                    status: normalizeStatus(initialValues.status),
                    description: initialValues.description,
                    requirements: initialValues.requirements,
                    location: initialValues.location,
                    salaryRange: initialValues.salaryRange
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    status: 'draft'
                });
            }
        }
    }, [open, initialValues, form]);

    const onFinish = async (values: JobFormValues) => {
        setLoading(true);
        try {
            await onSubmit(values);
            message.success(t('common.success'));
            onSuccess();
        } catch {
            message.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (viewOnly) return t('common.view');
        return initialValues ? t('common.edit') : t('recruitment.create_job_post');
    };

    return (
        <Modal
            title={getTitle()}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={isMobile ? 'calc(100vw - 24px)' : isLaptop ? 620 : 700}
            destroyOnClose
            footer={viewOnly ? [
                <Button key="close" onClick={onCancel}>
                    {t('common.close')}
                </Button>
            ] : undefined}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                disabled={viewOnly}
                initialValues={{
                    status: 'draft',
                    department: 'Engineering'
                }}
            >
                <Form.Item
                    label={t('recruitment.job_title')}
                    name="title"
                    rules={[{ required: true, message: t('common.required_field') }]}
                >
                    <Input placeholder={t('recruitment.job_title')} size="large" />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('recruitment.campaigns')}
                            name="campaignId"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Select options={campaignOptions} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('common.department')}
                            name="department"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Select
                                options={[
                                    { value: 'Engineering', label: 'Engineering' },
                                    { value: 'Marketing', label: 'Marketing' },
                                    { value: 'Design', label: 'Design' },
                                    { value: 'Data', label: 'Data Science' }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label={t('recruitment.quantity')}
                    name="requiredQuantity"
                    rules={[{ required: true, message: t('common.required_field') }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label={t('common.status')}
                    name="status"
                >
                    <Select
                        options={[
                            { value: 'draft', label: 'Draft' },
                            { value: 'open', label: t('common.open') },
                            { value: 'on_hold', label: t('recruitment.on_hold') },
                            { value: 'closed', label: t('common.closed') }
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label={t('recruitment.campaign_desc')}
                    name="description"
                >
                    <Input.TextArea rows={3} placeholder={t('recruitment.campaign_desc')} />
                </Form.Item>

                <Form.Item
                    label={t('recruitment.requirements')}
                    name="requirements"
                >
                    <Input.TextArea rows={3} placeholder={t('recruitment.requirements')} />
                </Form.Item>

                <Form.Item
                    label={t('recruitment.location')}
                    name="location"
                >
                    <Input placeholder='Hà Nội / TP.HCM / Remote' />
                </Form.Item>

                <Form.Item
                    label={t('recruitment.salary')}
                    name="salaryRange"
                >
                    <Input placeholder='1000 - 1500 USD' />
                </Form.Item>
            </Form>
        </Modal>
    );
};
