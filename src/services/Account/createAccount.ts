import { http } from '../../utils/http';

export type CreateAccount = {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    avatar?: string;
    role_id: string;
    status: string;
};

export const createAccount = async (params?: CreateAccount) => {
    const response = await http.post('/accounts/create', params);

    return {
        code: 201,
        data: response.data
    };
};
