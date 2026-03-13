import { UserOutlined, MailOutlined, IdcardOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Card, Descriptions, Space, Spin, Typography, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { getProfile } from '../../../services/auth/profile';

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
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
                <Title level={3} style={{ margin: 0 }}>
                    Thông tin cá nhân
                </Title>
                <Text type='secondary'>Trang này chỉ dùng để xem thông tin tài khoản hiện tại.</Text>
            </div>

            <Card bordered={false} style={{ maxWidth: 760, borderRadius: 12 }}>
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
                                        <IdcardOutlined />
                                        <span>ID</span>
                                    </Space>
                                }
                            >
                                {profile?.id || 'N/A'}
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
        </div>
    );
}
