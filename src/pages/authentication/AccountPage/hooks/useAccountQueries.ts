import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAccount, CreateAccount } from '../../../../services/Account/createAccount';
import { deleteAccount, DeleteAccount } from '../../../../services/Account/deleteAccount';
import { getAccount, GetAccount } from '../../../../services/Account/getAccount';
import { getAccounts, GetAccounts } from '../../../../services/Account/getAccounts';
import { UpdateAccount, updateAccount } from '../../../../services/Account/updateAccount';

export const ACCOUNT_QUERY_KEYS = {
    all: ['accounts'] as const,
    list: (params?: GetAccounts) => [...ACCOUNT_QUERY_KEYS.all, 'list', params] as const
};

export const useAccounts = (params?: GetAccounts) => {
    const query = useQuery({
        queryKey: ACCOUNT_QUERY_KEYS.list(params),
        queryFn: () => getAccounts(params)
    });

    if (query.isError) {
        console.error('Get accounts error:', query.error);
        // useShowNotification('error', 'Lỗi tải dữ liệu', 'Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
    }

    return query;
};

export const useAccount = (params: GetAccount) => {
    const query = useQuery({
        queryKey: ['account', params.id],
        queryFn: () => getAccount(params),
        enabled: !!params.id
    });

    if (query.isError) {
        console.error('Get account error:', query.error);
        // useShowNotification('error', 'Lỗi tải dữ liệu', 'Không thể tải thông tin tài khoản. Vui lòng thử lại sau.');
    }

    return query;
};

export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateAccount) => createAccount(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.all });
            // useShowNotification('success', 'Tạo tài khoản thành công');
        },
        onError: (error) => {
            console.error('Create account error:', error);
            // useShowNotification('error', 'Tạo tài khoản thất bại', 'Đã có lỗi xảy ra khi tạo tài khoản');
        }
    });
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: UpdateAccount) => updateAccount(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.all });
            // useShowNotification('success', 'Cập nhật tài khoản thành công');
        },
        onError: (error) => {
            console.error('Update account error:', error);
            // useShowNotification('error', 'Cập nhật tài khoản thất bại', 'Đã có lỗi xảy ra khi cập nhật tài khoản');
        }
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: DeleteAccount) => deleteAccount(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.all });
            // useShowNotification('success', 'Xóa tài khoản thành công');
        },
        onError: (error) => {
            console.error('Delete account error:', error);
            // useShowNotification('error', 'Xóa tài khoản thất bại', 'Đã có lỗi xảy ra khi xóa tài khoản');
        }
    });
};
