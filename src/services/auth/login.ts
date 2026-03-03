import { httpPublic } from '../../utils/http';

interface LoginData {
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

export const login = async (email: string, password: string): Promise<any> => {
    const data = await httpPublic.post<LoginData>('/auth/login', { email, password });

    return {
        accessToken: (data as unknown as LoginData).access_token,
        userInfo: {
            userId: (data as unknown as LoginData).user.id,
            email: (data as unknown as LoginData).user.email,
            fullName: (data as unknown as LoginData).user.fullName,
            role: (data as unknown as LoginData).user.roles[0]?.name || ''
        }
    };
};
