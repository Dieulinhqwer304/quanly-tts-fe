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
    initialValues?: JobPosition | null;
    viewOnly?: boolean;
}

export const RecruitmentJobModal = ({ open, onCancel, onSuccess, initialValues, viewOnly }: RecruitmentJobModalProps) => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [open, initialValues, form]);

    const onFinish = (values: Partial<JobPosition>) => {
        setLoading(true);
        console.log('Form values:', values);

        setTimeout(() => {
            setLoading(false);
            message.success(t('common.success'));
            onSuccess();
        }, 1500);
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
                    status: 'Open',
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
                            name="campaign"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Select
                                options={[
                                    { value: 'Summer Internship 2025', label: 'Summer Internship 2025' },
                                    { value: 'Fresh Graduate 2025', label: 'Fresh Graduate 2025' }
                                ]}
                            />
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
                    name="required"
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
                            { value: 'Open', label: t('common.open') },
                            { value: 'On Hold', label: t('recruitment.on_hold') },
                            { value: 'Closed', label: t('common.closed') }
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
            </Form>
        </Modal>
    );
};
