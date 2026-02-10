import {
    Button,
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
import { useResponsive } from '../../../../hooks/useResponsive';

interface InternFormValues {
    [key: string]: unknown;
    startDate?: string;
    endDate?: string;
    dates?: [dayjs.Dayjs, dayjs.Dayjs];
}

interface InternModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialValues?: InternFormValues;
    viewOnly?: boolean;
}

export const InternModal = ({ open, onCancel, onSuccess, initialValues, viewOnly }: InternModalProps) => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
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

    const onFinish = (values: InternFormValues) => {
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
        return initialValues ? t('common.edit') : t('internship.add_intern');
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
                    status: 'Active',
                    track: 'Frontend'
                }}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('internship.intern_name')}
                            name="name"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('internship.intern_name')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
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
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('common.phone')}
                            name="phone"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('common.phone')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
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
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('internship.mentor')}
                            name="mentor"
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('internship.mentor')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
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
