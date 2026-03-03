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
        id: string;
        fullName: string;
    };
    jobId: string;
    job?: {
        id: string;
        title: string;
    };
    interviewDate: string;
    interviewTime: string;
    durationMinutes: number;
    format: 'online' | 'in_person';
    location: string;
    interviewerId: string;
    interviewer?: {
        id: string;
        fullName: string;
    };
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    notes: string;
    result?: string;
    feedback?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetInterviewsParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    status?: string;
}

export const getInterviews = async (params?: GetInterviewsParams): Promise<ResponseListSuccess<Interview>> => {
    const queryParams: any = {};
    if (params?.status) queryParams.status = params.status;

    // In searcher is provided, we can add it too

    const result = await http.get<ResponseListSuccess<Interview>>('/interviews', { params: queryParams });
    return result;
};

export const getInterview = async (id: string): Promise<ResponseDetailSuccess<Interview>> => {
    const result = await http.get<ResponseDetailSuccess<Interview>>(`/interviews/${id}`);
    return result;
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
    const result = await http.post<ResponseDetailSuccess<Interview>>('/interviews', {
        ...params,
        interviewDate: params.date,
        interviewTime: params.time,
        durationMinutes: parseInt(params.duration) || 45
    });
    return result;
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
    const result = await http.patch<ResponseDetailSuccess<Interview>>(`/interviews/${id}`, {
        ...data,
        interviewDate: params.date,
        interviewTime: params.time,
        durationMinutes: params.duration ? parseInt(params.duration) : undefined
    });
    return result;
};

export const deleteInterview = async (id: string): Promise<ResponseDetailSuccess<null>> => {
    const result = await http.delete<ResponseDetailSuccess<null>>(`/interviews/${id}`);
    return result;
};
