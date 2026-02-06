import { Card, Tabs, Form, Input, Button, Select, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { http } from '../../../utils/http';

// Types
interface SystemSettings {
    _id: string;
    websiteName: string;
    contactEmail: string;
    phoneNumber: string;
    address: string;
    currency: string;
    timeZone: string;
    logoUrl?: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    data: SystemSettings;
}

interface FormValues {
    siteName: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    timezone: string;
    logoUrl?: string;
}

// API calls
const getSystemSettings = async (): Promise<SystemSettings> => {
    const response = await http.get<ApiResponse>('/system-settings');
    return response.data.data;
};

const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    const response = await http.patch<ApiResponse>('/system-settings', settings);
    return response.data.data;
};

// Component
const { TabPane } = Tabs;

export default function SettingPage() {
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const settings = await getSystemSettings();
            // Map BE fields to form fields
            form.setFieldsValue({
                siteName: settings.websiteName,
                email: settings.contactEmail,
                phone: settings.phoneNumber,
                address: settings.address,
                currency: settings.currency,
                timezone: settings.timeZone,
                logoUrl: settings.logoUrl
            });
        } catch (error: unknown) {
            console.error('Error fetching settings:', error);
            message.error('Không thể tải cài đặt hệ thống!');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async (values: FormValues) => {
        setLoading(true);
        try {
            // Map form fields to BE fields
            const settings: Partial<SystemSettings> = {
                websiteName: values.siteName,
                contactEmail: values.email,
                phoneNumber: values.phone,
                address: values.address,
                currency: values.currency,
                timeZone: values.timezone,
                logoUrl: values.logoUrl
            };

            await updateSystemSettings(settings);
            message.success('Cài đặt đã được lưu thành công!');
        } catch (error: unknown) {
            console.error('Error updating settings:', error);
            message.error('Có lỗi xảy ra khi lưu cài đặt!');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className='p-6'>Đang tải...</div>;
    }

    return (
        <div className='p-6'>
            <Card title='Cài đặt hệ thống' className='mb-4'>
                <Tabs defaultActiveKey='1'>
                    <TabPane tab='Thông tin chung' key='1'>
                        <Form form={form} layout='vertical' onFinish={handleSave}>
                            <Form.Item
                                label='Tên website'
                                name='siteName'
                                rules={[{ required: true, message: 'Vui lòng nhập tên website!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label='Email liên hệ'
                                name='email'
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label='Số điện thoại'
                                name='phone'
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label='Địa chỉ'
                                name='address'
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label='Đơn vị tiền tệ'
                                name='currency'
                                rules={[{ required: true, message: 'Vui lòng chọn đơn vị tiền tệ!' }]}
                            >
                                <Select>
                                    <Select.Option value='VND'>VND</Select.Option>
                                    <Select.Option value='USD'>USD</Select.Option>
                                    <Select.Option value='EUR'>EUR</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label='Múi giờ'
                                name='timezone'
                                rules={[{ required: true, message: 'Vui lòng chọn múi giờ!' }]}
                            >
                                <Select>
                                    <Select.Option value='Asia/Ho_Chi_Minh'>Việt Nam (GMT+7)</Select.Option>
                                    <Select.Option value='Asia/Bangkok'>Thái Lan (GMT+7)</Select.Option>
                                    <Select.Option value='Asia/Singapore'>Singapore (GMT+8)</Select.Option>
                                </Select>
                            </Form.Item>

                            {/* <Form.Item label='Logo website' name='logoUrl'>
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />}>
                                        Chọn logo
                                    </Button>
                                </Upload>
                            </Form.Item> */}

                            <Form.Item>
                                <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={loading}>
                                    Lưu cài đặt
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}
