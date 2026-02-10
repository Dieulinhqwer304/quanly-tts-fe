import { Modal, Form, Select, DatePicker, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCreateOnboarding } from '../../../../hooks/Recruitment/useOnboarding';
import { useResponsive } from '../../../../hooks/useResponsive';

const { RangePicker } = DatePicker;

interface ConvertToInternModalProps {
    open: boolean;
    onCancel: () => void;
    candidateId: string;
    candidateName: string;
    candidateAvatar?: string;
    candidateEmail?: string;
    candidatePhone?: string;
}

export const ConvertToInternModal = ({
    open,
    onCancel,
    candidateId,
    candidateName,
    candidateAvatar,
    candidateEmail,
    candidatePhone
}: ConvertToInternModalProps) => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [form] = Form.useForm();
    const createOnboarding = useCreateOnboarding();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const [startDate, endDate] = values.internshipPeriod || [];

            await createOnboarding.mutateAsync({
                candidateId,
                name: candidateName,
                avatar: candidateAvatar || '',
                email: candidateEmail || '',
                phone: candidatePhone || '',
                track: values.track,
                mentor: values.mentor,
                department: values.department,
                startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
                endDate: endDate ? endDate.format('YYYY-MM-DD') : ''
            });

            message.success(t('onboarding.convert_success', { name: candidateName }));
            form.resetFields();
            onCancel();
        } catch (error) {
            if (error instanceof Error && 'errorFields' in error) {
                // Validation error, do nothing
                return;
            }
            message.error(t('common.error'));
        }
    };

    return (
        <Modal
            title={t('onboarding.convert_to_intern')}
            open={open}
            onOk={handleSubmit}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            okText={t('onboarding.create_intern_profile')}
            cancelText={t('common.cancel')}
            confirmLoading={createOnboarding.isPending}
            width={isMobile ? 'calc(100vw - 24px)' : isLaptop ? 540 : 600}
        >
            <div style={{ marginBottom: '16px' }}>
                <strong>{t('candidate.name')}:</strong> {candidateName}
            </div>

            <Form form={form} layout='vertical'>
                <Form.Item
                    name='track'
                    label={t('onboarding.track')}
                    rules={[{ required: true, message: t('onboarding.track_required') }]}
                >
                    <Select placeholder={t('onboarding.select_track')}>
                        <Select.Option value='Frontend Development'>Frontend Development</Select.Option>
                        <Select.Option value='Backend Development'>Backend Development</Select.Option>
                        <Select.Option value='Full Stack Development'>Full Stack Development</Select.Option>
                        <Select.Option value='Mobile Development'>Mobile Development</Select.Option>
                        <Select.Option value='DevOps'>DevOps</Select.Option>
                        <Select.Option value='UI/UX Design'>UI/UX Design</Select.Option>
                        <Select.Option value='QA Testing'>QA Testing</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name='mentor'
                    label={t('onboarding.mentor')}
                    rules={[{ required: true, message: t('onboarding.mentor_required') }]}
                >
                    <Select placeholder={t('onboarding.select_mentor')}>
                        <Select.Option value='Michael Ross'>Michael Ross</Select.Option>
                        <Select.Option value='Sarah Chen'>Sarah Chen</Select.Option>
                        <Select.Option value='David Kim'>David Kim</Select.Option>
                        <Select.Option value='Emily Johnson'>Emily Johnson</Select.Option>
                        <Select.Option value='Alex Martinez'>Alex Martinez</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name='department'
                    label={t('onboarding.department')}
                    rules={[{ required: true, message: t('onboarding.department_required') }]}
                >
                    <Select placeholder={t('onboarding.select_department')}>
                        <Select.Option value='Engineering'>Engineering</Select.Option>
                        <Select.Option value='Product'>Product</Select.Option>
                        <Select.Option value='Design'>Design</Select.Option>
                        <Select.Option value='QA'>QA</Select.Option>
                        <Select.Option value='DevOps'>DevOps</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name='internshipPeriod'
                    label={t('onboarding.internship_period')}
                    rules={[{ required: true, message: t('onboarding.period_required') }]}
                >
                    <RangePicker
                        style={{ width: '100%' }}
                        format='YYYY-MM-DD'
                        placeholder={[t('onboarding.start_date'), t('onboarding.end_date')]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
