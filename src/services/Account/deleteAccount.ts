import { Account } from '../../models/Account';
import { http } from '../../utils/http';

export interface DeleteAccount {
    id: Account['_id'];
}

export const deleteAccount = async (params?: DeleteAccount) => {
    const response = await http.delete(`/accounts/deleteOne/${params?.id}`);

    return {
        code: 200,
        data: response
    };
};
