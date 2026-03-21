import { UserOutlined, MailOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Card, Descriptions, Form, Input, Space, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { changePassword, getProfile } from '../../../services/auth/profile';

const { Title, Text } = Typography;

type ProfileData = {
    id?: string;
    fullName?: string;
    email?: string;
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
    const [form] = Form.useForm();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let mounted = true;

        const loadProfile = async () => {
            setIsLoading(true);
            setErrorMessage('');
            try {
                const response = await getProfile();
                if (!mounted) return;
                const profileData = (response as any)?.data || {};
                setProfile(profileData);
            } catch {
                if (!mounted) return;
                setErrorMessage('Không thể tải thông tin cá nhân.');
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadProfile();

        return () => {
            mounted = false;
        };
    }, []);

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
                            <Space>
                                <Avatar size={56} icon={<UserOutlined />} />
                                <div>
                                    <Text strong style={{ fontSize: 16, display: 'block' }}>
                                        {profile?.fullName || 'Người dùng'}
                                    </Text>
                                    <Text type='secondary'>{profile?.email || 'N/A'}</Text>
                                </div>
                            </Space>

                            <Descriptions bordered column={1} size='middle'>
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
