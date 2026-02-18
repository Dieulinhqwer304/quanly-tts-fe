import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface Intern {
    id: string;
    userId: string;
    user?: {
        fullName: string;
        avatarUrl: string;
        email: string;
        phone: string;
    };
    code: string;
    track: string;
    mentorId: string;
    mentor?: {
        fullName: string;
    };
    department: string;
    startDate: string;
    endDate: string;
    overallProgress: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const getInterns = async (params?: any): Promise<ResponseListSuccess<Intern>> => {
    const response = await http.get('/interns', {
        params: {
            page: params?.pagination?.page,
            limit: params?.pagination?.pageSize,
            search: params?.searcher?.keyword,
            track: params?.track !== 'All' ? params?.track : undefined,
            status: params?.status !== 'All' ? params?.status : undefined
        }
    });

    const data = response.data;

    return {
        code: 200,
        data: {
            hits: data,
            pagination: {
                totalPages: 1,
                totalRows: data.length
            }
        }
    };
};

export const getIntern = async (id: string): Promise<ResponseDetailSuccess<Intern>> => {
    const response = await http.get(`/interns/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface UpdateInternParams {
    id: string;
    overallProgress?: number;
    status?: string;
    mentorId?: string;
}

export const updateIntern = async (params: UpdateInternParams): Promise<ResponseDetailSuccess<Intern>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/interns/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};
