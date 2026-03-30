import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Divider, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { useResponsive } from '../../../../hooks/useResponsive';
import { http } from '../../../../utils/http';
import { RecruitmentPlan, RecruitmentPlanPosition } from '../../../../services/Recruitment/recruitmentPlans';
import { showCreateSuccessToast, showUpdateSuccessToast } from '../../../../utils';

const { RangePicker } = DatePicker;

interface RecruitmentPlanModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialValues?: RecruitmentPlan | null;
    viewOnly?: boolean;
}

interface PlanFormValues {
    name: string;
    batch: string;
    department: string;
    status?: 'draft' | 'pending_approval' | 'active' | 'closed';
    description?: string;
    period?: [Dayjs, Dayjs];
    positions?: Array<{
        title: string;
        count: number;
        department?: string;
        description?: string;
        requirements?: string;
        benefits?: string;
        location?: string;
        salaryRange?: string;
        deadline?: Dayjs;
    }>;
}

const getPlanPositions = (plan?: RecruitmentPlan | null): RecruitmentPlanPosition[] => {
    if (!plan) return [];
    if (Array.isArray(plan.positions) && plan.positions.length > 0) {
        return plan.positions;
    }
    return Array.isArray(plan.jobPositions) ? plan.jobPositions : [];
};

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
    const [isLoading, setIsLoading] = useState(false);
    const departmentOptions = [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Design', label: 'Design' },
        { value: 'Data', label: 'Data Science' },
        { value: 'HR', label: 'Human Resources' }
    ];
    const planStatusOptions = [
        { value: 'draft', label: t('recruitment.draft') },
        { value: 'pending_approval', label: t('recruitment.pending_approval') },
        { value: 'active', label: t('internship.active') },
        { value: 'closed', label: t('recruitment.closed') }
    ];

    useEffect(() => {
        if (open) {
            if (initialValues) {
                const existingPositions = getPlanPositions(initialValues);
                form.setFieldsValue({
                    ...initialValues,
                    department: initialValues.department || existingPositions[0]?.department || 'Engineering',
                    positions: existingPositions.map((position) => ({
                        title: position.title,
                        count: Number(position.requiredQuantity || position.count || 1),
                        department: position.department || initialValues.department || 'Engineering',
                        description: position.description,
                        requirements: position.requirements,
                        benefits: position.benefits,
                        location: position.location,
                        salaryRange: position.salaryRange,
                        deadline: position.deadline ? dayjs(position.deadline) : undefined
                    })),
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

    const onFinish = async (values: PlanFormValues) => {
        setIsLoading(true);
        try {
            const normalizedPositions = (values.positions || []).map((position) => ({
                title: position.title,
                requiredQuantity: position.count,
                department: position.department?.trim() || values.department || 'Engineering',
                description: position.description?.trim(),
                requirements: position.requirements?.trim(),
                benefits: position.benefits?.trim(),
                location: position.location?.trim(),
                salaryRange: position.salaryRange?.trim(),
                deadline: position.deadline ? position.deadline.format('YYYY-MM-DD') : undefined
            }));

            const formData = {
                name: values.name,
                batch: values.batch,
                department: values.department?.trim() || initialValues?.department?.trim() || 'Engineering',
                status: values.status,
                description: values.description,
                startDate: values.period ? values.period[0].format('YYYY-MM-DD') : '',
                endDate: values.period ? values.period[1].format('YYYY-MM-DD') : '',
                positions: normalizedPositions
            };

            if (initialValues?.id) {
                await http.patch(`/recruitment-plans/${initialValues.id}`, formData);
                showUpdateSuccessToast('kế hoạch tuyển dụng');
            } else {
                await http.post('/recruitment-plans', {
                    ...formData,
                    status: 'draft'
                });
                showCreateSuccessToast('kế hoạch tuyển dụng');
            }
            onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
            confirmLoading={isLoading}
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
                    status: 'draft',
                    department: 'Engineering',
                    positions: []
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
                                    <Select options={departmentOptions} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {initialValues?.id && (
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label={t('common.status')}
                                        name='status'
                                        rules={[{ required: true, message: t('common.required_field') }]}
                                    >
                                        <Select options={planStatusOptions} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}

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
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'department']}
                                                        label={t('common.department')}
                                                        rules={[
                                                            { required: true, message: t('common.required_field') }
                                                        ]}
                                                    >
                                                        <Select options={departmentOptions} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'description']}
                                                        label={t('recruitment.campaign_desc')}
                                                    >
                                                        <Input.TextArea
                                                            rows={2}
                                                            placeholder={t('recruitment.campaign_desc')}
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
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'benefits']}
                                                        label={t('recruitment.benefits')}
                                                    >
                                                        <Input.TextArea rows={2} placeholder={t('recruitment.benefits')} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'location']}
                                                        label={t('recruitment.location')}
                                                    >
                                                        <Input placeholder='Hà Nội / TP.HCM / Remote' />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'salaryRange']}
                                                        label={t('recruitment.salary')}
                                                    >
                                                        <Input placeholder='1000 - 1500 USD' />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'deadline']}
                                                        label='Hạn nộp'
                                                    >
                                                        <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            {!viewOnly && (
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
                                    <Button
                                        type='dashed'
                                        onClick={() =>
                                            add({
                                                department: form.getFieldValue('department') || 'Engineering'
                                            })
                                        }
                                        block
                                        icon={<SaveOutlined />}
                                    >
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
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
