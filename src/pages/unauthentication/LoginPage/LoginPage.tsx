import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Form, Input, Layout, Typography, message } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { login } from '../../../services/auth/login';
import Cookies from 'js-cookie';
import { useAuth } from '../../../contexts/AuthContext';
import { RouteConfig } from '../../../constants';

const { Text } = Typography;
const { Content } = Layout;

// Schema validation cho form đăng nhập
const loginSchema = z.object({
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc')
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onFinish = async (values: { email: string; password: string }) => {
        try {
            if (values.email === 'admin@example.com' && values.password === 'admin123') {
                const mockToken = 'mock-jwt-token-' + Date.now();
                Cookies.set('accessToken', mockToken);
                setIsAuthenticated(true);
                message.success('Đăng nhập thành công!');
                navigate(RouteConfig.DashBoardPage.path);
                return;
            }

            const response = await login(values.email, values.password);
            if (response.accessToken) {
                Cookies.set('accessToken', response.accessToken);
                setIsAuthenticated(true);
                message.success('Đăng nhập thành công!');
                navigate(RouteConfig.DashBoardPage.path);
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
        }
    };

    return (
        <Layout
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <Content style={{ maxWidth: '400px', width: '100%' }}>
                <Card
                    style={{
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        borderRadius: '12px',
                        border: 'none'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div className='brand-text'>Admin Dashboard</div>
                        <Text type='secondary' style={{ fontSize: '16px' }}>
                            Đăng nhập để tiếp tục vào hệ thống
                        </Text>
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '12px',
                                background: '#f0f9ff',
                                borderRadius: '8px',
                                border: '1px solid #bae6fd'
                            }}
                        >
                            <Text style={{ fontSize: '14px', color: '#0369a1' }}>
                                Tài khoản demo: <strong>admin@example.com</strong> / <strong>admin123</strong>
                            </Text>
                        </div>
                    </div>

                    <Form layout='vertical' onFinish={handleSubmit(onFinish)}>
                        <Controller
                            name='email'
                            control={control}
                            render={({ field }) => (
                                <Form.Item
                                    label='Email'
                                    help={errors.email?.message}
                                    validateStatus={errors.email ? 'error' : ''}
                                >
                                    <Input
                                        {...field}
                                        prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                                        placeholder='Nhập địa chỉ email'
                                        size='large'
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name='password'
                            control={control}
                            render={({ field }) => (
                                <Form.Item
                                    label='Mật khẩu'
                                    help={errors.password?.message}
                                    validateStatus={errors.password ? 'error' : ''}
                                >
                                    <Input.Password
                                        {...field}
                                        prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
                                        placeholder='Nhập mật khẩu'
                                        size='large'
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Item>
                            )}
                        />

                        <Button
                            type='primary'
                            htmlType='submit'
                            loading={isSubmitting}
                            size='large'
                            block
                            style={{
                                borderRadius: '8px',
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};
