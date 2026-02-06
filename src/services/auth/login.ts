import { httpPublic } from '../../utils/http';

interface LoginResponse {
    code: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        userInfo: {
            userId: string;
            email: string;
            fullName: string;
            role: string;
        };
    };
}

export const login = async (email: string, password: string): Promise<any> => {
    const response = await httpPublic.post<LoginResponse>('/auth/login', { email, password });
    return response.data.data;
};
