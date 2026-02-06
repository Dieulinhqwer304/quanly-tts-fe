import { PlusOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Breadcrumb, Button, Form, FormInstance, Input, Select, Spin } from 'antd';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../../constants';
import { useShowNotification } from '../../../../components/Notification/Notification';
import { useAccount, useCreateAccount, useUpdateAccount } from '../hooks/useAccountQueries';
import { AccountSchema, getMutationAccount } from '../schema/FormAccountSchema';

interface FormMutationAccountPageProps {
    _id?: string;
}

export const FormMutationAccountPage = ({ _id }: FormMutationAccountPageProps) => {
    const navigate = useNavigate();
    const showNotification = useShowNotification();
    const antdFormRef = useRef<FormInstance>(null);
    const createAccountMutation = useCreateAccount();
    const updateAccountMutation = useUpdateAccount();
    const { data, isLoading } = useAccount({ id: _id || '' });
    const initialData = data?.data;

    const {
        control,
        handleSubmit: formSubmit,
        formState: { errors },
        reset
    } = useForm<AccountSchema>({
        resolver: zodResolver(getMutationAccount),
        defaultValues: {
            status: 'active'
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                fullName: initialData?.fullName,
                email: initialData?.email,
                password: initialData?.password,
                phone: initialData?.phone,
                avatar: initialData?.avatar,
                role_id: initialData?.role_id,
                status: initialData?.status
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: AccountSchema) => {
        if (_id) {
            updateAccountMutation.mutate(
                { ...data, id: _id },
                {
                    onSuccess: () => {
                        showNotification('success', 'Cập nhật thành công', 'Tài khoản đã được cập nhật thành công');
                        navigate(-1);
                    },
                    onError: () => {
                        showNotification(
                            'error',
                            'Cập nhật thất bại',
                            'Không thể cập nhật tài khoản. Vui lòng thử lại sau.'
                        );
                    }
                }
            );
        } else {
            createAccountMutation.mutate(data, {
                onSuccess: () => {
                    showNotification('success', 'Tạo mới thành công', 'Tài khoản đã được tạo thành công');
                    navigate(-1);
                },
                onError: () => {
                    showNotification('error', 'Tạo mới thất bại', 'Không thể tạo tài khoản mới. Vui lòng thử lại sau.');
                }
            });
        }
    };

    const options = [
        { value: 'active', label: <span>Hoạt động</span> },
        { value: 'inactive', label: <span>Dừng hoạt động</span> },
        { value: 'pending', label: <span>Chờ duyệt</span> }
    ];

    const optionsRole = [
        { value: 'admin', label: <span>Admin</span> },
        { value: 'staff', label: <span>Staff</span> }
    ];

    return (
        <Spin spinning={_id ? isLoading : false}>
            <div className=''>
                {/* Header với Breadcrumb và nút tạo mới */}
                <div className='flex justify-between items-center mb-6'>
                    <Breadcrumb
                        items={[
                            {
                                title: 'Quản lý tài khoản',
                                onClick: () => navigate(RouteConfig.ListUserPage.path),
                                className: 'cursor-pointer'
                            },
                            {
                                title: _id ? 'Cập nhật tài khoản' : 'Tạo mới tài khoản'
                            }
                        ]}
                    />

                    <div className='flex gap-2'>
                        <Button onClick={() => navigate(RouteConfig.ListUserPage.path)}>Hủy</Button>
                        <Button
                            onClick={formSubmit(handleFormSubmit)}
                            type='primary'
                            htmlType='submit'
                            icon={_id ? <PlusOutlined /> : null}
                            loading={isLoading}
                        >
                            {_id ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </div>

                {/* Form trong Card */}
                <Form className='grid grid-cols-1 gap-2' layout='vertical' ref={antdFormRef}>
                    <div className='grid grid-cols-2 gap-4'>
                        <Controller
                            name='fullName'
                            control={control}
                            render={({ field }) => (
                                <Form.Item label='Tên tài khoản' help={errors.fullName?.message}>
                                    <Input placeholder='Nhập tên tài khoản' type='text' {...field} />
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name='email'
                            control={control}
                            render={({ field }) => (
                                <Form.Item label='Email' help={errors.email?.message}>
                                    <Input placeholder='Nhập email' type='text' {...field} />
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name='password'
                            control={control}
                            render={({ field }) => (
                                <Form.Item label='Mật khẩu' help={errors.password?.message}>
                                    <Input placeholder='Nhập mật khẩu' type='password' {...field} />
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name='phone'
                            control={control}
                            render={({ field }) => (
                                <Form.Item label='Số điện thoại' help={errors.phone?.message}>
                                    <Input placeholder='Nhập số điện thoại' type='text' {...field} />
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name='role_id'
                            control={control}
                            render={({ field }) => (
                                <Form.Item label='Vai trò' help={errors.role_id?.message}>
                                    <Select
                                        options={optionsRole}
                                        value={field.value}
                                        onChange={field.onChange}
                                    ></Select>
                                </Form.Item>
                            )}
                        />

                        <Controller
                            name='status'
                            control={control}
                            render={({ field }) => (
                                <Form.Item label='Trạng thái' help={errors.status?.message}>
                                    <Select options={options} value={field.value} onChange={field.onChange}></Select>
                                </Form.Item>
                            )}
                        />
                    </div>
                </Form>
            </div>
        </Spin>
    );
};
