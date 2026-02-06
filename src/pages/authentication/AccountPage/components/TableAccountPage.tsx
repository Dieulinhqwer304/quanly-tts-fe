import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Modal, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../../constants';
import { useShowNotification } from '../../../../components/Notification/Notification';
import { useDebounce } from '../../../../hooks/useDebounce';
import { Account } from '../../../../models/Account';
import { ColorMappingStatus, LabelMappingStatus } from '../../../../utils/mapping';
import { FilterParams, PaginateParams, SearchParams, SortParams } from '../../../../utils/types/ServiceResponse';
import { useDeleteAccount, useAccounts } from '../hooks/useAccountQueries';
import { NotFoundPage } from '../../../unauthentication/NotFoundPage/NotFoundPage';
export interface ParamsAccountPage {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    sort?: SortParams;
    filter?: FilterParams;
}

const TableAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const showNotification = useShowNotification();
    const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const debouncedSearchValue = useDebounce<string>(searchValue, 500);

    const [searchParams, setSearchParams] = useState<ParamsAccountPage>({
        pagination: {
            page: 1,
            pageSize: 10
        }
    });

    const { data, isLoading, isFetching, error } = useAccounts(searchParams);
    const deleteAccountMutation = useDeleteAccount();
    const accounts = data?.data?.hits || [];

    useEffect(() => {
        setSearchParams((prev) => ({
            ...prev,
            searcher: debouncedSearchValue
                ? {
                      keyword: debouncedSearchValue,
                      field: 'fullName'
                  }
                : undefined
        }));
    }, [debouncedSearchValue]);

    const handleActionClick = async (key: string, record: Account) => {
        switch (key) {
            case 'edit':
                navigate(RouteConfig.UpdateUserPage.getPath(record._id));
                break;
            case 'delete':
                setSelectedRowKeys([record._id]);
                showModal();
                break;
        }
    };

    const handleTableChange = (pagination: any) => {
        setSearchParams({
            ...searchParams,
            pagination: {
                page: pagination.current,
                pageSize: pagination.pageSize
            }
        });
    };

    const showModal = () => {
        setIsModelOpen(true);
    };

    const handleOKModal = () => {
        if (selectedRowKeys.length > 0) {
            // Xóa từng tài khoản được chọn
            selectedRowKeys.forEach((id) => {
                deleteAccountMutation.mutate(
                    { id: id.toString() },
                    {
                        onSuccess: () => {
                            showNotification('success', 'Xóa thành công', 'Tài khoản đã được xóa thành công');
                        },
                        onError: () => {
                            showNotification('error', 'Xóa thất bại', 'Không thể xóa tài khoản. Vui lòng thử lại sau.');
                        }
                    }
                );
            });
            setSelectedRowKeys([]);
        }
        setIsModelOpen(false);
    };

    const handleCancelModal = () => {
        setIsModelOpen(false);
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    const handleCreateNew = () => {
        navigate(RouteConfig.CreateUserPage.path);
    };

    const handleFilter = (value: string) => {
        setSearchParams({
            ...searchParams,
            filter: {
                name: 'status',
                value: value
            }
        });
    };

    const columns: ColumnsType<Account> = [
        {
            title: 'STT',
            dataIndex: 'key',
            width: 50,
            align: 'center',
            render: (_, __, index) => index + 1
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'fullName',
            width: 100,
            render: (fullName, record) => <Link to={RouteConfig.UpdateUserPage.getPath(record._id)}>{fullName}</Link>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 150,
            ellipsis: true,
            render: (email: string) => <div>{email}</div>
        },

        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 200,
            ellipsis: true,
            render: (phone: string) => <>{phone}</>
        },
        {
            title: 'Vai trò',
            dataIndex: 'role_id',
            width: 200,
            render: (role_id: string) => <>{role_id}</>
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 200,
            render: (status: keyof typeof ColorMappingStatus) => (
                <Tag color={ColorMappingStatus[status]}>{LabelMappingStatus[status]}</Tag>
            )
        },

        {
            title: 'Hành động',
            key: 'action',
            fixed: 'right',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            { key: 'edit', label: 'Sửa', icon: <EditOutlined /> },
                            { key: 'delete', label: 'Xoá', icon: <DeleteOutlined /> }
                        ],
                        onClick: ({ key }) => handleActionClick(key, record)
                    }}
                    trigger={['click']}
                >
                    <Button size='small'>
                        <MoreOutlined />
                    </Button>
                </Dropdown>
            )
        }
    ];

    if (error) {
        return <NotFoundPage />;
    }

    return (
        <div className='tour-table-container'>
            <h1 className='text-[22px]'>Danh sách tài khoản</h1>

            {/* Header */}
            <div className='flex justify-end gap-4 mb-4'>
                <div>
                    <Input
                        placeholder='Tìm kiếm...'
                        prefix={<SearchOutlined />}
                        allowClear
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <div>
                    <Select
                        placeholder='Lọc theo trạng thái'
                        options={[
                            { value: 'active', label: 'Hoạt động' },
                            { value: 'inactive', label: 'Dừng hoạt động' },
                            { value: 'pending', label: 'Chờ duyệt' }
                        ]}
                        allowClear
                        className='w-[200px]'
                        onChange={(value) => handleFilter(value)}
                        value={searchParams.filter?.value}
                    />
                </div>
                <Button onClick={showModal} icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}>
                    Xoá ({selectedRowKeys.length})
                </Button>
                <Button type='primary' icon={<PlusOutlined />} onClick={handleCreateNew}>
                    Tạo mới
                </Button>
            </div>

            {/* Table */}
            <Table<Account>
                rowKey={(record) => record._id}
                bordered={true}
                size='small'
                columns={columns}
                dataSource={accounts}
                loading={isFetching || isLoading}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (newSelectedRowKeys: React.Key[]) => {
                        setSelectedRowKeys(newSelectedRowKeys);
                    }
                }}
                scroll={{ x: 1000 }}
                onChange={handleTableChange}
                pagination={{
                    current: searchParams.pagination?.page,
                    pageSize: searchParams.pagination?.pageSize,
                    total: data?.data?.pagination?.totalRows,
                    position: ['bottomRight'],
                    className: 'ant-pagination-sticky',
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} bản ghi`
                }}
            />
            <Modal
                title={`Bạn có chắc muốn xoá ${selectedRowKeys.length} tài khoản đã chọn?`}
                open={isModelOpen}
                onOk={handleOKModal}
                onCancel={handleCancelModal}
                confirmLoading={deleteAccountMutation.isPending}
            >
                <p>Hành động này không thể hoàn tác.</p>
            </Modal>
        </div>
    );
};

export default TableAccountPage;
