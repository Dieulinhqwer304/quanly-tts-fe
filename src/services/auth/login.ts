import { httpPublic } from '../../utils/http';

interface LoginResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        roles: Array<{
            name: string;
            displayName: string;
        }>;
    };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await httpPublic.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
};
