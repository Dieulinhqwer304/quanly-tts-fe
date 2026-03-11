import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useResponsive } from '../../../../hooks/useResponsive';
import { useCreateIntern, useUpdateIntern } from '../../../../hooks/Internship/useInterns';
import { http } from '../../../../utils/http';

interface InternFormValues {
  userId: string;
  mentorId: string;
  learningPathId?: string;
  track?: string;
  department: string;
  status?: string;
  dates?: [dayjs.Dayjs, dayjs.Dayjs];
}

interface InternModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialValues?: any;
  viewOnly?: boolean;
}

interface UserOption {
  id: string;
  fullName: string;
  email?: string;
  role?: string;
}

interface LearningPathOption {
  id: string;
  title: string;
  track: string;
}

export const InternModal = ({ open, onCancel, onSuccess, initialValues, viewOnly }: InternModalProps) => {
  const { t } = useTranslation();
  const { isLaptop, isMobile } = useResponsive();
  const [form] = Form.useForm<InternFormValues>();
  const updateMutation = useUpdateIntern();
  const createMutation = useCreateIntern();

  const [users, setUsers] = useState<UserOption[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPathOption[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  const mentorOptions = useMemo(
    () => users.filter((u) => ['mentor', 'hr', 'director', 'admin'].includes((u.role || '').toLowerCase())),
    [users],
  );

  const internUserOptions = useMemo(() => users, [users]);

  const loadOptions = async () => {
    setIsBootstrapping(true);
    try {
      const [usersRes, learningPathRes] = await Promise.all([
        http.get<{ hits?: any[]; data?: any[] }>('/users'),
        http.get<{ hits?: any[]; data?: any[] }>('/learning-paths'),
      ]);

      const userSource = (usersRes?.hits || usersRes?.data || []) as any[];
      setUsers(
        userSource
          .map((u) => ({
            id: String(u.id || ''),
            fullName: String(u.fullName || ''),
            email: u.email ? String(u.email) : undefined,
            role: u.role ? String(u.role) : undefined,
          }))
          .filter((u) => u.id && u.fullName),
      );

      const learningPathSource = (learningPathRes?.hits || learningPathRes?.data || []) as any[];
      setLearningPaths(
        learningPathSource
          .map((lp) => ({
            id: String(lp.id || ''),
            title: String(lp.title || ''),
            track: String(lp.track || ''),
          }))
          .filter((lp) => lp.id && lp.title),
      );
    } catch {
      message.error('Không tải được dữ liệu danh mục cho thực tập sinh');
    } finally {
      setIsBootstrapping(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    loadOptions();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      form.setFieldsValue({
        userId: initialValues.userId,
        mentorId: initialValues.mentorId,
        learningPathId: initialValues.learningPathId || initialValues.learningPath?.id,
        track: initialValues.track,
        department: initialValues.department,
        status: (initialValues.status || '').toLowerCase(),
        dates:
          initialValues.startDate && initialValues.endDate
            ? [dayjs(initialValues.startDate), dayjs(initialValues.endDate)]
            : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues, open]);

  const onLearningPathChange = (learningPathId?: string) => {
    const selected = learningPaths.find((lp) => lp.id === learningPathId);
    form.setFieldValue('track', selected?.track || undefined);
  };

  const onFinish = async (values: InternFormValues) => {
    try {
      const [startDate, endDate] = values.dates || [];
      const payload: Record<string, unknown> = {
        userId: values.userId,
        mentorId: values.mentorId,
        department: values.department,
        learningPathId: values.learningPathId,
        track: values.track,
        startDate: startDate?.format('YYYY-MM-DD'),
        endDate: endDate?.format('YYYY-MM-DD'),
      };

      if (values.status) {
        payload.status = values.status;
      }

      if (initialValues?.id) {
        await updateMutation.mutate({ id: initialValues.id, ...(payload as any) });
      } else {
        await createMutation.mutate(payload);
      }

      message.success(t('common.success'));
      onSuccess();
    } catch {
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
      confirmLoading={updateMutation.isLoading || createMutation.isLoading || isBootstrapping}
      width={isMobile ? 'calc(100vw - 24px)' : isLaptop ? 620 : 720}
      destroyOnClose
      footer={
        viewOnly
          ? [
              <Button key='close' onClick={onCancel}>
                {t('common.close')}
              </Button>,
            ]
          : undefined
      }
    >
      <Form form={form} layout='vertical' onFinish={onFinish} disabled={viewOnly || isBootstrapping}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label='Tài khoản thực tập sinh' name='userId' rules={[{ required: true, message: t('common.required_field') }]}>
              <Select
                showSearch
                optionFilterProp='label'
                placeholder='Chọn tài khoản'
                options={internUserOptions.map((user) => ({
                  value: user.id,
                  label: `${user.fullName}${user.email ? ` - ${user.email}` : ''}`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={t('internship.mentor')} name='mentorId' rules={[{ required: true, message: t('common.required_field') }]}>
              <Select
                showSearch
                optionFilterProp='label'
                placeholder={t('internship.select_mentor')}
                options={mentorOptions.map((mentor) => ({
                  value: mentor.id,
                  label: `${mentor.fullName}${mentor.email ? ` - ${mentor.email}` : ''}`,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label='Lộ trình đào tạo' name='learningPathId' rules={[{ required: true, message: t('common.required_field') }]}>
              <Select
                showSearch
                optionFilterProp='label'
                placeholder='Chọn lộ trình'
                onChange={onLearningPathChange}
                options={learningPaths.map((lp) => ({
                  value: lp.id,
                  label: `${lp.title} (${lp.track})`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={t('internship.track')} name='track' rules={[{ required: true, message: t('common.required_field') }]}>
              <Input readOnly placeholder='Track tự động theo lộ trình' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label='Phòng ban' name='department' rules={[{ required: true, message: t('common.required_field') }]}>
              <Input placeholder='Nhập phòng ban' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={t('common.status')} name='status'>
              <Select
                options={[
                  { value: 'active', label: t('internship.active') },
                  { value: 'completed', label: t('internship.completed') },
                  { value: 'terminated', label: t('internship.dropped') },
                  { value: 'on_hold', label: t('internship.on_hold') },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={t('internship.internship_period')} name='dates' rules={[{ required: true, message: t('common.required_field') }]}>
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
