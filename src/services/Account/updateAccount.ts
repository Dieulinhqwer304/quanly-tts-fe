import { Account } from '../../models/Account';
import { http } from '../../utils/http';
import { CreateAccount } from './createAccount';

export type UpdateAccount = CreateAccount & {
    id?: Account['_id'];
};

export type UpdateProfile = Partial<CreateAccount> & {
    id?: Account['_id'];
};

export const updateAccount = async (params?: UpdateAccount) => {
    const response = await http.patch(`/accounts/update/${params?.id}`, params);

    return {
        code: 200,
        data: response.data
    };
};

export const updateProfile = async (params?: UpdateProfile) => {
    const response = await http.patch(`/accounts/update/${params?.id}`, params);

    return {
        code: 200,
        data: response.data
    };
};
