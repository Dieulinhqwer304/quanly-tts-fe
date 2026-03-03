import { Button, Col, Form, Input, Row, Select, message, Modal, DatePicker } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useResponsive } from '../../../../hooks/useResponsive';
import { useUpdateIntern, useCreateIntern } from '../../../../hooks/Internship/useInterns';

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
    initialValues?: any;
    viewOnly?: boolean;
}

export const InternModal = ({ open, onCancel, onSuccess, initialValues, viewOnly }: InternModalProps) => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [form] = Form.useForm();
    const updateMutation = useUpdateIntern();
    const createMutation = useCreateIntern();

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    name: initialValues.user?.fullName,
                    email: initialValues.user?.email,
                    phone: initialValues.user?.phone,
                    mentor: initialValues.mentor?.fullName,
                    dates:
                        initialValues.startDate && initialValues.endDate
                            ? [dayjs(initialValues.startDate), dayjs(initialValues.endDate)]
                            : undefined
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialValues, form]);

    const onFinish = async (values: InternFormValues) => {
        try {
            const [startDate, endDate] = values.dates || [];
            const payload = {
                ...values,
                startDate: startDate?.format('YYYY-MM-DD'),
                endDate: endDate?.format('YYYY-MM-DD')
            };

            if (initialValues?.id) {
                await updateMutation.mutate({
                    ...payload,
                    id: initialValues.id
                } as any);
                message.success(t('common.success'));
            } else {
                await createMutation.mutate(payload);
                message.success(t('common.success'));
            }
            onSuccess();
        } catch (error) {
            message.error(t('common.error'));
        }
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
            confirmLoading={updateMutation.isLoading || createMutation.isLoading}
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
                    status: 'Active',
                    track: 'Frontend'
                }}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('internship.intern_name')}
                            name='name'
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('internship.intern_name')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('common.email')}
                            name='email'
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
                            name='phone'
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('common.phone')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={t('internship.track')}
                            name='track'
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
                            name='mentor'
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('internship.mentor')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label={t('common.status')} name='status'>
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
                    name='dates'
                    rules={[{ required: true, message: t('common.required_field') }]}
                >
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
