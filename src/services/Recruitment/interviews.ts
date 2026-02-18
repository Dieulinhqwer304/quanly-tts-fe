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
    candidate?: {
        fullName: string;
    };
    jobId: string;
    job?: {
        title: string;
    };
    interviewDate: string;
    interviewTime: string;
    durationMinutes: number;
    format: string;
    location: string;
    interviewerId: string;
    interviewer?: {
        fullName: string;
    };
    status: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export const getInterviews = async (params?: any): Promise<ResponseListSuccess<Interview>> => {
    const response = await http.get('/interviews', {
        params: {
            page: params?.pagination?.page,
            limit: params?.pagination?.pageSize,
            search: params?.searcher?.keyword,
            status: params?.status !== 'all' ? params?.status : undefined
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
