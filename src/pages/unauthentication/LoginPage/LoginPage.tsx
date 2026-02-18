import { LockOutlined, UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Divider, Form, Input, Typography, message, theme } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { login } from '../../../services/auth/login';
import Cookies from 'js-cookie';
import { useAuth } from '../../../contexts/AuthContext';
import { RouteConfig } from '../../../constants';

const { Title, Text, Link } = Typography;

const loginSchema = z.object({
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc')
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
    const { token } = theme.useToken();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'admin@example.com',
            password: 'admin123'
        }
    });

    const onFinish = async (values: { email: string; password: string }) => {
        try {
            const response = await login(values.email, values.password);
            if (response.access_token) {
                Cookies.set('accessToken', response.access_token);
                // Lưu thêm thông tin user nếu cần
                Cookies.set('userInfo', JSON.stringify(response.user));

                setIsAuthenticated(true);
                message.success('Đăng nhập thành công!');
                navigate(RouteConfig.ModuleSelection.path);
            }
        } catch (error: any) {
            console.error('Login error:', error);
            message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
            <div
                style={{
                    flex: '1',
                    display: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                className='hidden md:flex flex-col justify-between p-12 text-white'
            >
                <div style={{ zIndex: 10 }}>
                    <div
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                backdropFilter: 'blur(10px)'
                            }}
                        ></div>
                        Admin Dashboard
                    </div>
                </div>

                <div style={{ zIndex: 10, maxWidth: '480px' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.2' }}>
                        Manage your business with ease.
                    </h1>
                    <p style={{ fontSize: '18px', opacity: 0.9 }}>
                        Start managing your users, tracking analytics, and growing your business with our comprehensive
                        dashboard solution.
                    </p>
                </div>

                <div style={{ zIndex: 10, fontSize: '14px', opacity: 0.7 }}>
                    © 2024 Base Project. All rights reserved.
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-10%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)'
                    }}
                ></div>
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-10%',
                        left: '-10%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)'
                    }}
                ></div>
            </div>

            <div
                style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
            >
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <Title level={2} style={{ marginBottom: '8px' }}>
                            Welcome back
                        </Title>
                        <Text type='secondary' style={{ fontSize: '16px' }}>
                            Please enter your details to sign in.
                        </Text>
                    </div>

                    <div
                        style={{
                            marginBottom: '24px',
                            padding: '16px',
                            background: token.colorPrimaryBg,
                            borderRadius: '8px',
                            border: `1px solid ${token.colorPrimaryBorder}`
                        }}
                    >
                        <Text style={{ fontSize: '14px', color: token.colorPrimaryText }}>
                            Demo Account: <strong>admin@example.com</strong> / <strong>admin123</strong>
                        </Text>
                    </div>

                    <Form layout='vertical' onFinish={handleSubmit(onFinish)} size='large'>
                        <Controller
                            name='email'
                            control={control}
                            render={({ field }) => (
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Email Address</span>}
                                    help={errors.email?.message}
                                    validateStatus={errors.email ? 'error' : ''}
                                >
                                    <Input
                                        {...field}
                                        placeholder='Enter your email'
                                        prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                    />
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name='password'
                            control={control}
                            render={({ field }) => (
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Password</span>}
                                    help={errors.password?.message}
                                    validateStatus={errors.password ? 'error' : ''}
                                >
                                    <Input.Password
                                        {...field}
                                        placeholder='Enter your password'
                                        prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                    />
                                </Form.Item>
                            )}
                        />

                        {/* <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px'
                            }}
                        > */}
                        {/* <Checkbox>Remember me</Checkbox> */}
                        {/* <Link href='#' style={{ fontWeight: 500 }}>
                                Forgot password?
                            </Link> */}
                        {/* </div> */}

                        <Button
                            type='primary'
                            htmlType='submit'
                            loading={isSubmitting}
                            block
                            style={{ fontWeight: 600 }}
                        >
                            Sign In
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};
