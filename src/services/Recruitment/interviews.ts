import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface Interview {
    id: string;
    candidateId: string;
    candidateName: string;
    jobId: string;
    jobTitle: string;
    date: string;
    time: string;
    duration: string;
    format: 'Online' | 'In Person';
    location: string;
    interviewer: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetInterviewsParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    status?: string;
}

export const getInterviews = async (params?: GetInterviewsParams): Promise<ResponseListSuccess<Interview>> => {
    const queryParams: any = {
        q: params?.searcher?.keyword,
        _page: params?.pagination?.page || 1,
        _limit: params?.pagination?.pageSize || 10
    };

    if (params?.status && params.status !== 'all') {
        queryParams.status = params.status;
    }

    const response = await http.get('/interviews', { params: queryParams });
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

export const getInterview = async (id: string): Promise<ResponseDetailSuccess<Interview>> => {
    const response = await http.get(`/interviews/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateInterviewParams {
    candidateId: string;
    candidateName: string;
    jobId: string;
    jobTitle: string;
    date: string;
    time: string;
    duration: string;
    format: string;
    location: string;
    interviewer: string;
    notes?: string;
}

export const createInterview = async (params: CreateInterviewParams): Promise<ResponseDetailSuccess<Interview>> => {
    const response = await http.post('/interviews', {
        ...params,
        status: 'Scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return {
        code: 201,
        data: response.data
    };
};

export interface UpdateInterviewParams {
    id: string;
    date?: string;
    time?: string;
    duration?: string;
    format?: string;
    location?: string;
    interviewer?: string;
    status?: string;
    notes?: string;
}

export const updateInterview = async (params: UpdateInterviewParams): Promise<ResponseDetailSuccess<Interview>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/interviews/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};

export const deleteInterview = async (id: string): Promise<ResponseDetailSuccess<null>> => {
    await http.delete(`/interviews/${id}`);
    return {
        code: 200,
        data: null
    };
};
