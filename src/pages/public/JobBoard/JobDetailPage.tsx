import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloudUploadOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    FieldTimeOutlined,
    GlobalOutlined,
    HourglassOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Layout, Row, Tag, Typography, Upload, Modal, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJobPosition } from '../../../hooks/Recruitment/useJobPositions';
import { useCreateCandidateWithCv } from '../../../hooks/Recruitment/useCandidates';
import { RouteConfig } from '../../../constants';
import type { UploadFile } from 'antd/es/upload/interface';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const MAX_CV_SIZE_IN_MB = 10;
const PHONE_PATTERN = /^\d{10}$/;

const splitContentItems = (value?: string) =>
    String(value || '')
        .split(/\r?\n|•\s*|;\s*/)
        .map((item) => item.trim())
        .filter(Boolean);

const formatDisplayDate = (value?: string) => {
    if (!value) return '';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('vi-VN');
};

const getApplyErrorMessage = (error: unknown) => {
    if (typeof error === 'object' && error !== null) {
        const errorObject = error as {
            message?: string;
            response?: {
                data?: {
                    message?: string;
                    details?: string;
                };
            };
        };

        return (
            errorObject.response?.data?.details ||
            errorObject.response?.data?.message ||
            errorObject.message ||
            'Đã có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại sau.'
        );
    }

    return 'Đã có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại sau.';
};

export const JobDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    useTranslation();
    const [form] = Form.useForm();
    const { mutate: applyJob, isLoading: isApplying } = useCreateCandidateWithCv();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [cvError, setCvError] = useState('');

    const { data: jobRes, isLoading } = useJobPosition(id || '', true);
    const job = jobRes?.data;

    const handleBeforeUpload = (file: File) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const isSupportedFile = ['pdf', 'doc', 'docx'].includes(String(fileExtension || ''));

        if (!isSupportedFile) {
            Modal.error({
                title: 'File không hợp lệ',
                content: 'CV chỉ hỗ trợ định dạng PDF, DOC hoặc DOCX.'
            });
            return Upload.LIST_IGNORE;
        }

        if (file.size > MAX_CV_SIZE_IN_MB * 1024 * 1024) {
            Modal.error({
                title: 'File quá lớn',
                content: `CV chỉ hỗ trợ dung lượng tối đa ${MAX_CV_SIZE_IN_MB}MB.`
            });
            return Upload.LIST_IGNORE;
        }

        return false;
    };

    const onFinish = async (values: { fullName: string; email: string; phone: string }) => {
        if (!id) return;

        const selectedCv = fileList[0]?.originFileObj as File | undefined;

        if (!PHONE_PATTERN.test(values.phone)) {
            form.setFields([
                {
                    name: 'phone',
                    errors: ['Số điện thoại phải gồm đúng 10 chữ số.']
                }
            ]);
            return;
        }

        if (!selectedCv) {
            setCvError('Trường bắt buộc');
            return;
        }

        setCvError('');

        try {
            await applyJob({
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                jobId: id,
                cv: selectedCv
            });

            Modal.success({
                title: 'Nộp hồ sơ thành công!',
                content:
                    'Cảm ơn bạn đã quan tâm. Chúng tôi đã nhận được hồ sơ và sẽ phản hồi trong vòng 3-5 ngày làm việc.',
                okText: 'Quay lại danh sách',
                onOk: () => navigate(RouteConfig.PublicJobBoard.path)
            });

            form.resetFields();
            setFileList([]);
        } catch (err) {
            Modal.error({
                title: 'Lỗi',
                content: getApplyErrorMessage(err)
            });
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <Skeleton active />
            </div>
        );
    }

    if (!job) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <Title level={3}>Không tìm thấy thông tin công việc</Title>
                <Button onClick={() => navigate(RouteConfig.PublicJobBoard.path)}>Quay lại</Button>
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '0 24px',
                    height: '64px'
                }}
            >
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => navigate(RouteConfig.PublicJobBoard.path)}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            background: '#1E40AF',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                        }}
                    >
                        <GlobalOutlined style={{ fontSize: '18px' }} />
                    </div>
                    <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
                        TTS-Learning
                    </Title>
                </div>
                <Button
                    type='text'
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(RouteConfig.PublicJobBoard.path)}
                    style={{ fontWeight: 600, color: '#64748b' }}
                >
                    Quay lại tìm việc
                </Button>
            </Header>

            <Content style={{ padding: '40px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Row gutter={[40, 40]}>
                        <Col xs={24} lg={16}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        <Tag color='blue' style={{ margin: 0, padding: '4px 12px', fontWeight: 700 }}>
                                            {job.department}
                                        </Tag>
                                        <Text
                                            type='secondary'
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <EnvironmentOutlined /> {job.location}
                                        </Text>
                                    </div>
                                    <Title
                                        level={1}
                                        style={{ margin: 0, fontSize: '32px', fontWeight: 800, color: '#1e293b' }}
                                    >
                                        {job.title}
                                    </Title>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {[
                                        {
                                            icon: <DollarOutlined />,
                                            text: job.salaryRange || 'Thỏa thuận'
                                        },
                                        {
                                            icon: <FieldTimeOutlined />,
                                            text: `${job.required || job.requiredQuantity || 0} vị trí`
                                        }
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '8px 16px',
                                                background: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: '#475569'
                                            }}
                                        >
                                            <span style={{ color: '#1E40AF' }}>{item.icon}</span>
                                            {item.text}
                                        </div>
                                    ))}
                                    {job.deadline && (
                                        <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '8px 16px',
                                            background: '#fff1f2',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            color: '#e11d48'
                                        }}
                                        >
                                            <HourglassOutlined /> Hạn nộp: {formatDisplayDate(job.deadline)}
                                        </div>
                                    )}
                                </div>

                                <Card
                                    bordered={false}
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Text
                                                type='secondary'
                                                style={{
                                                    fontSize: '12px',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Lương
                                            </Text>
                                            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                                                {job.salaryRange || 'Thỏa thuận'}
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <Text
                                                type='secondary'
                                                style={{
                                                    fontSize: '12px',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Trình độ
                                            </Text>
                                            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                                                Intern/Trainee
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>

                                <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#334155' }}>
                                    <Title level={3}>Mô tả công việc</Title>
                                    <Paragraph>{job.description}</Paragraph>

                                    <Title level={3} style={{ marginTop: '32px' }}>
                                        Yêu cầu ứng viên
                                    </Title>
                                    <Paragraph>{job.requirements}</Paragraph>

                                    {job.benefits && (
                                        <>
                                            <Title level={3} style={{ marginTop: '32px' }}>
                                                Quyền lợi
                                            </Title>
                                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                                {splitContentItems(job.benefits).map((item, i) => (
                                                    <li
                                                        key={`${item}-${i}`}
                                                        style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}
                                                    >
                                                        <CheckCircleOutlined
                                                            style={{ color: '#1E40AF', marginTop: '6px' }}
                                                        />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} lg={8}>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                <Card
                                    bordered={false}
                                    style={{
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                        border: '1px solid #e2e8f0'
                                    }}
                                    bodyStyle={{ padding: '32px' }}
                                >
                                    <div style={{ marginBottom: '24px' }}>
                                        <Title level={3} style={{ margin: 0, fontSize: '24px' }}>
                                            Ứng tuyển ngay
                                        </Title>
                                        <Text type='secondary'>Gửi thông tin của bạn để bắt đầu hành trình.</Text>
                                    </div>

                                    <Form form={form} layout='vertical' requiredMark onFinish={onFinish}>
                                        <Form.Item
                                            name='fullName'
                                            label='Họ và tên'
                                            rules={[{ required: true, message: 'Trường bắt buộc' }]}
                                        >
                                            <Input placeholder='Nguyễn Văn A' size='large' />
                                        </Form.Item>

                                        <Form.Item
                                            name='email'
                                            label='Địa chỉ Email'
                                            rules={[
                                                { required: true, message: 'Trường bắt buộc' },
                                                { type: 'email', message: 'Email không hợp lệ!' }
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                                                placeholder='example@gmail.com'
                                                size='large'
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name='phone'
                                            getValueFromEvent={(event) =>
                                                String(event?.target?.value || '')
                                                    .replace(/\D/g, '')
                                                    .slice(0, 10)
                                            }
                                            label='Số điện thoại'
                                            rules={[{ required: true, message: 'Trường bắt buộc' }]}
                                        >
                                            <Input
                                                prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />}
                                                placeholder='09xxxxxxxx'
                                                size='large'
                                                inputMode='numeric'
                                                maxLength={10}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label={
                                                <span>
                                                    <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                                                    Tải lên CV (PDF/DOC/DOCX)
                                                </span>
                                            }
                                            validateStatus={cvError ? 'error' : ''}
                                            help={cvError || null}
                                        >
                                    
                                            <Upload.Dragger
                                                style={{
                                                    padding: '24px',
                                                    background: '#f8fafc',
                                                    border: '2px dashed #e2e8f0'
                                                }}
                                                beforeUpload={(file) => handleBeforeUpload(file as File)}
                                                fileList={fileList}
                                                onChange={(info) => {
                                                    const nextFileList = info.fileList.slice(-1);
                                                    setFileList(nextFileList);
                                                    if (nextFileList.length > 0) {
                                                        setCvError('');
                                                    }
                                                }}
                                                accept='.pdf,.doc,.docx'
                                                maxCount={1}
                                            >
                                                <p>
                                                    <CloudUploadOutlined
                                                        style={{ fontSize: '32px', color: '#1E40AF' }}
                                                    />
                                                </p>
                                                <p style={{ fontSize: '14px', fontWeight: 500 }}>
                                                    Bấm để chọn hoặc kéo thả file
                                                </p>
                                                <p style={{ fontSize: '12px', color: '#64748b' }}>
                                                    Dung lượng tối đa 10MB
                                                </p>
                                            </Upload.Dragger>
                                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                                CV là bắt buộc để hoàn tất ứng tuyển.
                                            </Text>
                                        </Form.Item>

                                        <Button
                                            type='primary'
                                            htmlType='submit'
                                            size='large'
                                            block
                                            loading={isApplying}
                                            style={{
                                                height: '52px',
                                                fontWeight: 700,
                                                fontSize: '16px',
                                                marginTop: '12px',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            Gửi hồ sơ ngay
                                        </Button>

                                        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px' }}>
                                            <Text type='secondary'>
                                                Bằng cách nộp đơn, bạn đồng ý với{' '}
                                                <a href='#'>Điều khoản của chúng tôi</a>.
                                            </Text>
                                        </div>
                                    </Form>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );
};
