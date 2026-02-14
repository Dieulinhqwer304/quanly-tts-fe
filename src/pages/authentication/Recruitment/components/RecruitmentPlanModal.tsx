import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, message, Divider, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useResponsive } from '../../../../hooks/useResponsive';

const { RangePicker } = DatePicker;

interface RecruitmentPlanFormValues {
    [key: string]: unknown;
    startDate?: string;
    endDate?: string;
    period?: [dayjs.Dayjs, dayjs.Dayjs];
}

interface RecruitmentPlanModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialValues?: RecruitmentPlanFormValues;
    viewOnly?: boolean;
}

export const RecruitmentPlanModal = ({
    open,
    onCancel,
    onSuccess,
    initialValues,
    viewOnly
}: RecruitmentPlanModalProps) => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    period:
                        initialValues.startDate && initialValues.endDate
                            ? [dayjs(initialValues.startDate), dayjs(initialValues.endDate)]
                            : undefined
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialValues, form]);

    const onFinish = (values: RecruitmentPlanFormValues) => {
        setLoading(true);
        console.log('Form values:', values);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            message.success(t('common.success'));
            onSuccess();
        }, 1500);
    };

    const getTitle = () => {
        if (viewOnly) return t('common.view');
        return initialValues ? t('common.edit') : t('recruitment.create_new_plan');
    };

    return (
        <Modal
            title={getTitle()}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={isMobile ? 'calc(100vw - 24px)' : isLaptop ? 700 : 800}
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
                    department: 'Engineering'
                }}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            label={t('recruitment.campaign_name')}
                            name='name'
                            rules={[{ required: true, message: t('common.required_field') }]}
                        >
                            <Input placeholder={t('recruitment.campaign_name')} size='large' />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={t('recruitment.batch_name')}
                                    name='batch'
                                    rules={[{ required: true, message: t('common.required_field') }]}
                                >
                                    <Input placeholder={t('recruitment.batch_name')} />
                                </Form.Item>
                            </Col>
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
                                            { value: 'Data', label: 'Data Science' },
                                            { value: 'HR', label: 'Human Resources' }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label={t('recruitment.campaign_desc')} name='description'>
                            <Input.TextArea rows={3} placeholder={t('recruitment.campaign_desc')} />
                        </Form.Item>

                        <Divider orientation='left'>{t('recruitment.positions_reqs')}</Divider>

                        <Form.List name='positions'>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div
                                            key={key}
                                            style={{
                                                marginBottom: '16px',
                                                padding: '16px',
                                                background: '#fafafa',
                                                borderRadius: '8px',
                                                position: 'relative'
                                            }}
                                        >
                                            <Row gutter={16}>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'title']}
                                                        label={t('recruitment.job_title')}
                                                        rules={[
                                                            { required: true, message: t('common.required_field') }
                                                        ]}
                                                    >
                                                        <Input placeholder='VD: Frontend Developer Intern' />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'count']}
                                                        label={t('recruitment.quantity')}
                                                        rules={[
                                                            { required: true, message: t('common.required_field') }
                                                        ]}
                                                    >
                                                        <InputNumber
                                                            min={1}
                                                            style={{ width: '100%' }}
                                                            placeholder='5'
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'requirements']}
                                                        label={t('recruitment.requirements')}
                                                        rules={[
                                                            { required: true, message: 'Vui lòng nhập yêu cầu chính' }
                                                        ]}
                                                    >
                                                        <Input.TextArea
                                                            rows={2}
                                                            placeholder='VD: ReactJS, TypeScript, 6 tháng kinh nghiệm, có khả năng làm việc nhóm...'
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            {fields.length > 1 && (
                                                <Button
                                                    type='text'
                                                    danger
                                                    onClick={() => remove(name)}
                                                    style={{ position: 'absolute', top: 8, right: 8 }}
                                                >
                                                    {t('common.delete')}
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button type='dashed' onClick={() => add()} block icon={<SaveOutlined />}>
                                        {t('recruitment.add_position')}
                                    </Button>
                                </>
                            )}
                        </Form.List>

                        <Divider orientation='left'>{t('recruitment.timeline_status')}</Divider>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={t('recruitment.campaign_period')}
                                    name='period'
                                    rules={[{ required: true, message: t('common.required_field') }]}
                                >
                                    <RangePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label={t('common.status')} name='status'>
                                    <Select
                                        options={[
                                            { value: 'Active', label: t('recruitment.active_hiring') },
                                            { value: 'Pending', label: t('recruitment.pending_approval') },
                                            { value: 'Closed', label: t('recruitment.closed') }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label={t('recruitment.assign_approver')} name='approver'>
                            <Select
                                placeholder={t('recruitment.assign_approver')}
                                options={[
                                    { value: 'dir1', label: 'John Director (CTO)' },
                                    { value: 'dir2', label: 'Jane Director (CEO)' }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
