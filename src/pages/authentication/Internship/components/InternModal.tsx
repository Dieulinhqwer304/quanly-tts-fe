import {
    Col,
    Form,
    Input,
    Row,
    Select,
    message,
    Modal,
    DatePicker
} from 'antd';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface InternModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialValues?: any;
}

export const InternModal = ({ open, onCancel, onSuccess, initialValues }: InternModalProps) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    dates: initialValues.startDate && initialValues.endDate
                        ? [dayjs(initialValues.startDate), dayjs(initialValues.endDate)]
                        : undefined
                });
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
            title={initialValues ? t('common.edit') : t('internship.add_intern')}
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
                    status: 'Active',
                    track: 'Frontend'
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('internship.intern_name')}
                            name="name"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('internship.intern_name')} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('common.email')}
                            name="email"
                            rules={[
                                { required: true, message: t('common.required_field') },
                                { type: 'email', message: t('common.invalid_email') }
                            ]}
                        >
                            <Input placeholder={t('common.email')} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('common.phone')}
                            name="phone"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('common.phone')} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('internship.track')}
                            name="track"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Select
                                options={[
                                    { value: 'Frontend', label: 'Frontend' },
                                    { value: 'Backend', label: 'Backend' },
                                    { value: 'UI/UX', label: 'UI/UX' },
                                    { value: 'DevOps', label: 'DevOps' }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('internship.mentor')}
                            name="mentor"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('internship.mentor')} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('common.status')}
                            name="status"
                        >
                            <Select
                                options={[
                                    { value: 'Active', label: t('internship.active') },
                                    { value: 'Completed', label: t('internship.completed') },
                                    { value: 'Dropped', label: t('internship.dropped') }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label={t('internship.internship_period')}
                    name="dates"
                    rules={[{ required: true, message: t('common.required_field') }]}
                >
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
