import { CameraOutlined, LockOutlined, MailOutlined, PhoneOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Descriptions, Form, Input, Space, Spin, Typography, Upload } from 'antd';
import { useEffect, useState } from 'react';
import UserAvatar from '../../../components/UserAvatar';
import { useAuth } from '../../../contexts/AuthContext';
import { changePassword, uploadProfileAvatar } from '../../../services/auth/profile';
import { showUpdateSuccessToast } from '../../../utils';

const { Title, Text } = Typography;

type ProfileData = {
    id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    role?: string;
    roles?: Array<{ name?: string; displayName?: string }>;
};

const toDisplayRole = (profile: ProfileData): string => {
    const primaryRole = String(profile.role || profile.roles?.[0]?.name || '').toLowerCase();
    if (!primaryRole) return 'N/A';

    if (primaryRole === 'super_admin') return 'Super Admin';
    if (primaryRole === 'admin') return 'Admin';
    if (primaryRole === 'hr') return 'HR';
    if (primaryRole === 'mentor') return 'Mentor';
    if (primaryRole === 'director') return 'Director';
    if (primaryRole === 'intern') return 'Intern';
    return primaryRole;
};

export default function SettingPage() {
    const { profile: authProfile, refreshProfile } = useAuth();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const profile = authProfile as ProfileData | null;

    useEffect(() => {
        let mounted = true;

        const loadProfile = async () => {
            if (profile) {
                if (mounted) {
                    setErrorMessage('');
                    setIsLoading(false);
                }
                return;
            }

            setIsLoading(true);
            setErrorMessage('');
            const profileData = (await refreshProfile()) as ProfileData | null;
            if (!mounted) return;
            if (!profileData) {
                setErrorMessage('Không thể tải thông tin cá nhân.');
            }

            setIsLoading(false);
        };

        void loadProfile();

        return () => {
            mounted = false;
        };
    }, [profile, refreshProfile]);

    const handleChangePassword = async (values: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) => {
        setIsChangingPassword(true);
        try {
            await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });
            window.alert('Đổi mật khẩu thành công.');
            form.resetFields();
        } catch {
            // Http interceptor xử lý hiển thị message lỗi từ backend
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        setIsUploadingAvatar(true);
        try {
            await uploadProfileAvatar(file);
            await refreshProfile();
            setErrorMessage('');
            showUpdateSuccessToast('\u1ea3nh \u0111\u1ea1i di\u1ec7n');
        } catch {
            // Http interceptor xử lý hiển thị lỗi từ backend
        } finally {
            setIsUploadingAvatar(false);
        }

        return Upload.LIST_IGNORE;
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
                <Title level={3} style={{ margin: 0 }}>
                    Thông tin cá nhân
                </Title>
                <Text type='secondary'>Quản lý thông tin tài khoản và đổi mật khẩu đăng nhập.</Text>
            </div>

            <Space direction='vertical' size={16} style={{ width: '100%', maxWidth: 760 }}>
                <Card bordered={false} style={{ borderRadius: 12 }}>
                    {isLoading ? (
                        <div style={{ padding: '24px 0', textAlign: 'center' }}>
                            <Spin />
                        </div>
                    ) : errorMessage ? (
                        <Alert type='error' message={errorMessage} showIcon />
                    ) : (
                        <Space direction='vertical' size={20} style={{ width: '100%' }}>
                            <Space align='start' size={16}>
                                <UserAvatar
                                    size={72}
                                    src={profile?.avatarUrl}
                                    alt={profile?.fullName || 'Avatar'}
                                />
                                <div>
                                    <Text strong style={{ fontSize: 16, display: 'block' }}>
                                        {profile?.fullName || 'Người dùng'}
                                    </Text>
                                    <Text type='secondary'>{profile?.email || 'N/A'}</Text>
                                </div>
                                <Space direction='vertical' size={8}>
                                    <Upload
                                        accept='image/*'
                                        showUploadList={false}
                                        beforeUpload={(file) => handleAvatarUpload(file as File)}
                                    >
                                        <Button icon={<CameraOutlined />} loading={isUploadingAvatar}>
                                            {'Ch\u1ecdn \u1ea3nh \u0111\u1ea1i di\u1ec7n'}
                                        </Button>
                                    </Upload>
                                    <Text type='secondary' style={{ fontSize: 12 }}>
                                        {'H\u1ed7 tr\u1ee3 JPG, PNG, WEBP t\u1ed1i \u0111a 5MB. \u1ea2nh \u0111\u01b0\u1ee3c l\u01b0u b\u1ea3n g\u1ed1c \u0111\u1ec3 hi\u1ec3n th\u1ecb r\u00f5 h\u01a1n.'}
                                    </Text>
                                </Space>
                            </Space>

                            <Descriptions bordered column={1} size='middle'>
                                <Descriptions.Item
                                    label={
                                        <Space>
                                            <UserOutlined />
                                            <span>{'H\u1ecd v\u00e0 t\u00ean'}</span>
                                        </Space>
                                    }
                                >
                                    {profile?.fullName || 'Người dùng'}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={
                                        <Space>
                                            <MailOutlined />
                                            <span>Email</span>
                                        </Space>
                                    }
                                >
                                    {profile?.email || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={
                                        <Space>
                                            <PhoneOutlined />
                                            <span>{'S\u1ed1 \u0111i\u1ec7n tho\u1ea1i'}</span>
                                        </Space>
                                    }
                                >
                                    {profile?.phone || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={
                                        <Space>
                                            <TeamOutlined />
                                            <span>Vai trò</span>
                                        </Space>
                                    }
                                >
                                    {toDisplayRole(profile || {})}
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>
                    )}
                </Card>

                <Card
                    bordered={false}
                    style={{ borderRadius: 12 }}
                    title={
                        <Space>
                            <LockOutlined />
                            <span>Đổi mật khẩu</span>
                        </Space>
                    }
                >
                    <Form form={form} layout='vertical' onFinish={handleChangePassword}>
                        <Form.Item
                            label='Mật khẩu hiện tại'
                            name='currentPassword'
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại.' }]}
                        >
                            <Input.Password placeholder='Nhập mật khẩu hiện tại' />
                        </Form.Item>

                        <Form.Item
                            label='Mật khẩu mới'
                            name='newPassword'
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới.' },
                                { min: 6, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || value !== getFieldValue('currentPassword')) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('Mật khẩu mới phải khác mật khẩu hiện tại.')
                                        );
                                    }
                                })
                            ]}
                        >
                            <Input.Password placeholder='Nhập mật khẩu mới' />
                        </Form.Item>

                        <Form.Item
                            label='Xác nhận mật khẩu mới'
                            name='confirmNewPassword'
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới.' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp.'));
                                    }
                                })
                            ]}
                        >
                            <Input.Password placeholder='Nhập lại mật khẩu mới' />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type='primary' htmlType='submit' loading={isChangingPassword}>
                                Cập nhật mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Space>
        </div>
    );
}
