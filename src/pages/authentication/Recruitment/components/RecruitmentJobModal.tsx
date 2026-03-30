import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    message
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { JobPosition } from '../../../../services/Recruitment/jobPositions';
import { useResponsive } from '../../../../hooks/useResponsive';
import { showCreateSuccessToast, showUpdateSuccessToast } from '../../../../utils';

interface RecruitmentPlanOption {
    value: string;
    label: string;
    department?: string;
}

interface RecruitmentJobModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    onSubmit: (values: JobFormValues) => Promise<void>;
    planOptions: RecruitmentPlanOption[];
    initialValues?: JobPosition | null;
    viewOnly?: boolean;
}

export interface JobFormValues {
    title: string;
    recruitmentPlanId: string;
    department: string;
    requiredQuantity: number;
    status: 'draft' | 'open' | 'closed' | 'on_hold';
    description?: string;
    requirements?: string;
    benefits?: string;
    location?: string;
    salaryRange?: string;
    deadline?: Dayjs | null;
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
    planOptions,
    initialValues,
    viewOnly
}: RecruitmentJobModalProps) => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const normalizedPlanOptions = [...planOptions];

    if (
        initialValues?.recruitmentPlanId &&
        !normalizedPlanOptions.some((option) => option.value === initialValues.recruitmentPlanId)
    ) {
        normalizedPlanOptions.push({
            value: initialValues.recruitmentPlanId,
            label:
                initialValues.recruitmentPlan?.name ||
                initialValues.recruitmentPlan?.title ||
                initialValues.recruitmentPlanName ||
                initialValues.planName ||
                initialValues.recruitmentPlanId,
            department: initialValues.department
        });
    }

    useEffect(() => {
        if (!open) return;

        if (initialValues) {
            form.setFieldsValue({
                title: initialValues.title,
                recruitmentPlanId: initialValues.recruitmentPlanId || initialValues.planId,
                department: initialValues.department,
                requiredQuantity: initialValues.requiredQuantity,
                status: normalizeStatus(initialValues.status),
                description: initialValues.description,
                requirements: initialValues.requirements,
                benefits: initialValues.benefits,
                location: initialValues.location,
                salaryRange: initialValues.salaryRange,
                deadline: initialValues.deadline ? dayjs(initialValues.deadline) : undefined
            });
            return;
        }

        form.resetFields();
        const defaultPlan = planOptions[0];
        form.setFieldsValue({
            recruitmentPlanId: defaultPlan?.value,
            department: defaultPlan?.department || 'Engineering',
            status: 'draft'
        });
    }, [open, initialValues, form, planOptions]);

    const onFinish = async (values: JobFormValues) => {
        setLoading(true);
        try {
            await onSubmit(values);
            if (initialValues?.id) {
                showUpdateSuccessToast('tin tuyển dụng');
            } else {
                showCreateSuccessToast('tin tuyển dụng');
            }
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

    const handlePlanChange = (planId: string) => {
        const selectedPlan = normalizedPlanOptions.find((option) => option.value === planId);

        if (selectedPlan?.department) {
            form.setFieldValue('department', selectedPlan.department);
        }
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
            footer={
                viewOnly
                    ? [
                          <Button key='close' onClick={onCancel}>
                              {t('common.close')}
                          </Button>
                      ]
                    : undefined
            }
        >
            <Form
                form={form}
                layout='vertical'
                onFinish={onFinish}
                disabled={viewOnly}
                initialValues={{
                    status: 'draft',
                    department: 'Engineering'
                }}
            >
                <Form.Item
                    label={t('recruitment.job_title')}
                    name='title'
                    rules={[{ required: true, message: t('common.required_field') }]}
                >
                    <Input placeholder={t('recruitment.job_title')} size='large' />
                </Form.Item>

                <Form.Item
                    label={t('recruitment.campaign_name')}
                    name='recruitmentPlanId'
                    rules={[{ required: true, message: t('common.required_field') }]}
                >
                    <Select
                        placeholder={t('recruitment.campaign_name')}
                        options={normalizedPlanOptions}
                        onChange={handlePlanChange}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('common.department')}
                            name='department'
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
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('recruitment.quantity')}
                            name='requiredQuantity'
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label={t('common.status')} name='status'>
                    <Select
                        options={[
                            { value: 'draft', label: t('recruitment.draft') },
                            { value: 'open', label: t('common.open') },
                            { value: 'on_hold', label: t('recruitment.on_hold') },
                            { value: 'closed', label: t('common.closed') }
                        ]}
                    />
                </Form.Item>

                <Form.Item label={t('recruitment.campaign_desc')} name='description'>
                    <Input.TextArea rows={3} placeholder={t('recruitment.campaign_desc')} />
                </Form.Item>

                <Form.Item label={t('recruitment.requirements')} name='requirements'>
                    <Input.TextArea rows={3} placeholder={t('recruitment.requirements')} />
                </Form.Item>

                <Form.Item label={t('recruitment.benefits')} name='benefits'>
                    <Input.TextArea rows={3} placeholder={t('recruitment.benefits')} />
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

                <Form.Item label='Hạn nộp' name='deadline'>
                    <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
                </Form.Item>
            </Form>
        </Modal>
    );
};
