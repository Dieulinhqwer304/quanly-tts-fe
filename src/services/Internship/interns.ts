import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface Intern {
    id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    track: string;
    mentor: string;
    startDate: string;
    endDate: string;
    progress: number;
    status: 'Active' | 'Completed' | 'Dropped';
    createdAt: string;
    updatedAt: string;
}

export interface GetInternsParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    track?: string;
    status?: string;
}

export const getInterns = async (params?: GetInternsParams): Promise<ResponseListSuccess<Intern>> => {
    const queryParams: any = {
        q: params?.searcher?.keyword,
        _page: params?.pagination?.page || 1,
        _limit: params?.pagination?.pageSize || 10
    };

    if (params?.track && params.track !== 'All') {
        queryParams.track = params.track;
    }

    if (params?.status && params.status !== 'All') {
        queryParams.status = params.status;
    }

    const response = await http.get('/interns', { params: queryParams });
    const totalCount = parseInt(response.headers['x-total-count'] || '0');
    const data = response.data;

    return {
        code: 200,
        data: {
            hits: data,
            pagination: {
                totalPages: Math.ceil(totalCount / (params?.pagination?.pageSize || 10)),
                totalRows: totalCount
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
    progress?: number;
    status?: string;
    mentor?: string;
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
