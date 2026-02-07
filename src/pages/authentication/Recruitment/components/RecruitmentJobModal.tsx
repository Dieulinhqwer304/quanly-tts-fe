import {
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

interface RecruitmentJobModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialValues?: JobPosition | null;
}

export const RecruitmentJobModal = ({ open, onCancel, onSuccess, initialValues }: RecruitmentJobModalProps) => {
    const { t } = useTranslation();
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

    const onFinish = (values: any) => {
        setLoading(true);
        console.log('Form values:', values);

        setTimeout(() => {
            setLoading(false);
            message.success(t('common.success'));
            onSuccess();
        }, 1500);
    };

    return (
        <Modal
            title={initialValues ? t('common.edit') : t('recruitment.create_job_post')}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={700}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    status: 'Open',
                    department: 'Engineering',
                    level: 'Junior'
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
                    <Col span={12}>
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
                    <Col span={12}>
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

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('recruitment.level')}
                            name="level"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Select
                                options={[
                                    { value: 'Junior', label: 'Junior' },
                                    { value: 'Middle', label: 'Middle' },
                                    { value: 'Senior', label: 'Senior' },
                                    { value: 'Intern', label: 'Intern' }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('recruitment.quantity')}
                            name="required"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

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
