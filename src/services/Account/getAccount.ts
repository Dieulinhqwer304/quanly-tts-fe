import { Account } from '../../models/Account';
import { http } from '../../utils/http';
import { ResponseDetailSuccess } from '../../utils/types/ServiceResponse';

export interface GetAccount {
    id: Account['_id'];
}

export type AccountResponseData = Account;

export const getAccount = async (params?: GetAccount): Promise<ResponseDetailSuccess<AccountResponseData>> => {
    const response = await http.get(`/accounts/detail/${params?.id}`);
    const res = response.data;

    console.log(res);
    return {
        code: 200,
        data: res.data
    };
};

export const getProfile = async (): Promise<ResponseDetailSuccess<AccountResponseData>> => {
    const response = await http.get('/profile');
    const res = response.data;

    return {
        code: 200,
        data: res.data
    };
};
