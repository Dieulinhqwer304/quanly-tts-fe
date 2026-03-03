import { httpPublic } from '../../utils/http';

interface LoginResponse {
    errorCode: number;
    data: {
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
    };
}

export const login = async (email: string, password: string): Promise<any> => {
    const response = await httpPublic.post<LoginResponse>('/auth/login', { email, password });

    // Transform to what Frontend expects if necessary,
    // but better to align Frontend to Backend.
    // For now, let's return the data part
    const data = response.data;
    return {
        accessToken: data.access_token,
        userInfo: {
            userId: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName,
            role: data.user.roles[0]?.name || ''
        }
    };
};
