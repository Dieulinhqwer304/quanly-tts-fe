import { CameraOutlined, EditOutlined, LockOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Avatar,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Col,
    Descriptions,
    Form,
    Input,
    Row,
    Space,
    Tabs,
    Typography,
    Upload,
    message
} from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AccountResponseData, getProfile } from '../../../services/Account/getAccount';
import { updateProfile } from '../../../services/Account/updateAccount';
import { uploadSingle } from '../../../services/Upload';

const { Title, Text } = Typography;

// Schema validation cho form profile
const profileSchema = z.object({
    fullName: z.string().min(1, 'Họ tên là bắt buộc'),
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
    phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
    avatar: z.string().optional()
});

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
        newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
        confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc')
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword']
    });

type ProfileSchema = z.infer<typeof profileSchema>;
type PasswordSchema = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<AccountResponseData | null>(null);
    const [, setIsUploading] = useState(false);

    useEffect(() => {
        getProfile().then((res) => {
            setUserData(res.data);
            setAvatarUrl(res.data.avatar || '');
        });
    }, []);

    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
        reset: _resetProfile,
        setValue
    } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: userData || undefined
    });

    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
        reset: resetPassword
    } = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onProfileSubmit = async (data: ProfileSchema) => {
        try {
            if (!userData?._id) return;

            const response = await updateProfile({
                id: userData._id,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                avatar: data.avatar
            });

            if (response.code === 200) {
                message.success('Cập nhật thông tin thành công!');
                setIsEditing(false);
                // Refresh profile data
                getProfile().then((res) => {
                    setUserData(res.data);
                    setAvatarUrl(res.data.avatar || '');
                });
            }
        } catch (error) {
            message.error('Cập nhật thất bại. Vui lòng thử lại!');
        }
    };

    const onPasswordSubmit = async (data: PasswordSchema) => {
        try {
            if (!userData?._id) return;

            const response = await updateProfile({
                id: userData._id,
                password: data.newPassword
            });

            if (response.code === 200) {
                message.success('Đổi mật khẩu thành công!');
                resetPassword();
            }
        } catch (error) {
            message.error('Đổi mật khẩu thất bại. Vui lòng thử lại!');
        }
    };

    const handleAvatarChange = async (info: any) => {
        if (info.file.status === 'uploading') {
            setIsUploading(true);
            return;
        }

        if (info.file.status === 'done') {
            try {
                const file = info.file.originFileObj;
                const response = await uploadSingle(file);

                if (response.code === 200) {
                    const imageUrl = response.data.url;
                    setAvatarUrl(imageUrl);
                    setValue('avatar', imageUrl);
                    message.success('Tải ảnh thành công!');
                }
            } catch (error) {
                message.error('Tải ảnh thất bại!');
            } finally {
                setIsUploading(false);
            }
        } else if (info.file.status === 'error') {
            message.error('Tải ảnh thất bại!');
            setIsUploading(false);
        }
    };

    if (!userData) {
        return null; // or loading spinner
    }

    const tabItems = [
        {
            key: 'profile',
            label: 'Thông tin cá nhân',
            children: !isEditing ? (
                <Descriptions column={2} bordered>
                    <Descriptions.Item label='Họ tên' span={2}>
                        {userData.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label='Email'>{userData.email}</Descriptions.Item>
                    <Descriptions.Item label='Số điện thoại'>{userData.phone}</Descriptions.Item>
                    <Descriptions.Item label='Vai trò'>{userData.role_id}</Descriptions.Item>
                    <Descriptions.Item label='Trạng thái'>{userData.status}</Descriptions.Item>
                    <Descriptions.Item label='Ngày tạo'>
                        {new Date(userData.createdAt).toLocaleDateString()}
                    </Descriptions.Item>
                </Descriptions>
            ) : (
                <Form layout='vertical' onFinish={handleProfileSubmit(onProfileSubmit)}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Controller
                                name='fullName'
                                control={profileControl}
                                render={({ field }) => (
                                    <Form.Item
                                        label='Họ tên'
                                        help={profileErrors.fullName?.message}
                                        validateStatus={profileErrors.fullName ? 'error' : ''}
                                    >
                                        <Input {...field} placeholder='Nhập họ tên' />
                                    </Form.Item>
                                )}
                            />
                        </Col>
                        <Col span={12}>
                            <Controller
                                name='email'
                                control={profileControl}
                                render={({ field }) => (
                                    <Form.Item
                                        label='Email'
                                        help={profileErrors.email?.message}
                                        validateStatus={profileErrors.email ? 'error' : ''}
                                    >
                                        <Input {...field} placeholder='Nhập email' />
                                    </Form.Item>
                                )}
                            />
                        </Col>
                        <Col span={12}>
                            <Controller
                                name='phone'
                                control={profileControl}
                                render={({ field }) => (
                                    <Form.Item
                                        label='Số điện thoại'
                                        help={profileErrors.phone?.message}
                                        validateStatus={profileErrors.phone ? 'error' : ''}
                                    >
                                        <Input {...field} placeholder='Nhập số điện thoại' />
                                    </Form.Item>
                                )}
                            />
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                            <Button
                                type='primary'
                                htmlType='submit'
                                loading={isProfileSubmitting}
                                icon={<SaveOutlined />}
                            >
                                Lưu thay đổi
                            </Button>
                        </Space>
                    </div>
                </Form>
            )
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: (
                <div style={{ maxWidth: '384px' }}>
                    <Form layout='vertical' onFinish={handlePasswordSubmit(onPasswordSubmit)}>
                        <Controller
                            name='currentPassword'
                            control={passwordControl}
                            render={({ field }) => (
                                <Form.Item
                                    label='Mật khẩu hiện tại'
                                    help={passwordErrors.currentPassword?.message}
                                    validateStatus={passwordErrors.currentPassword ? 'error' : ''}
                                >
                                    <Input.Password
                                        {...field}
                                        prefix={<LockOutlined />}
                                        placeholder='Nhập mật khẩu hiện tại'
                                    />
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name='newPassword'
                            control={passwordControl}
                            render={({ field }) => (
                                <Form.Item
                                    label='Mật khẩu mới'
                                    help={passwordErrors.newPassword?.message}
                                    validateStatus={passwordErrors.newPassword ? 'error' : ''}
                                >
                                    <Input.Password
                                        {...field}
                                        prefix={<LockOutlined />}
                                        placeholder='Nhập mật khẩu mới'
                                    />
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name='confirmPassword'
                            control={passwordControl}
                            render={({ field }) => (
                                <Form.Item
                                    label='Xác nhận mật khẩu mới'
                                    help={passwordErrors.confirmPassword?.message}
                                    validateStatus={passwordErrors.confirmPassword ? 'error' : ''}
                                >
                                    <Input.Password
                                        {...field}
                                        prefix={<LockOutlined />}
                                        placeholder='Xác nhận mật khẩu mới'
                                    />
                                </Form.Item>
                            )}
                        />

                        <Button type='primary' htmlType='submit' loading={isPasswordSubmitting} icon={<SaveOutlined />}>
                            Đổi mật khẩu
                        </Button>
                    </Form>
                </div>
            )
        }
    ];

    return (
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <Breadcrumb style={{ marginBottom: '24px' }}>
                <Breadcrumb.Item onClick={() => navigate('/')}>
                    <span style={{ cursor: 'pointer' }}>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Hồ sơ cá nhân</Breadcrumb.Item>
            </Breadcrumb>

            {/* Header */}
            <Card style={{ marginBottom: '24px', border: 'none', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <Row gutter={24} align='middle'>
                    <Col span={4}>
                        <div style={{ textAlign: 'center' }}>
                            <Badge
                                count={
                                    <Button
                                        type='primary'
                                        size='small'
                                        icon={<CameraOutlined />}
                                        shape='circle'
                                        style={{ border: '2px solid white' }}
                                    />
                                }
                                offset={[-10, 10]}
                            >
                                <Upload
                                    showUploadList={false}
                                    onChange={handleAvatarChange}
                                    beforeUpload={() => false} // Prevent auto upload
                                >
                                    <Avatar
                                        size={80}
                                        icon={<UserOutlined />}
                                        src={avatarUrl}
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    />
                                </Upload>
                            </Badge>
                        </div>
                    </Col>
                    <Col span={16}>
                        <div>
                            <Title level={3} style={{ marginBottom: '4px' }}>
                                {userData.fullName}
                            </Title>
                            <Text type='secondary' style={{ fontSize: '16px' }}>
                                {userData.role_id} • {userData.email}
                            </Text>
                            <div style={{ marginTop: '8px' }}>
                                <Space size='large'>
                                    <Text type='secondary'>
                                        Ngày tạo: {new Date(userData.createdAt).toLocaleDateString()}
                                    </Text>
                                    <Text type='secondary'>
                                        Cập nhật: {new Date(userData.updatedAt).toLocaleDateString()}
                                    </Text>
                                </Space>
                            </div>
                        </div>
                    </Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                        <Button type='primary' icon={<EditOutlined />} onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Tabs Content */}
            <Card style={{ border: 'none', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
            </Card>
        </div>
    );
}
