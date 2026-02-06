import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface Evaluation {
    id: string;
    internId: string;
    internName: string;
    mentorId: string;
    mentorName: string;
    type: 'Mid-term' | 'Final' | 'Probation';
    score: number;
    feedback: string;
    status: 'Pending' | 'Completed';
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetEvaluationsParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    internId?: string;
    mentorId?: string;
}

export const getEvaluations = async (params?: GetEvaluationsParams): Promise<ResponseListSuccess<Evaluation>> => {
    const queryParams: any = {
        q: params?.searcher?.keyword,
        _page: params?.pagination?.page || 1,
        _limit: params?.pagination?.pageSize || 10
    };

    if (params?.internId) {
        queryParams.internId = params.internId;
    }

    if (params?.mentorId) {
        queryParams.mentorId = params.mentorId;
    }

    const response = await http.get('/evaluations', { params: queryParams });
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

export const getEvaluation = async (id: string): Promise<ResponseDetailSuccess<Evaluation>> => {
    const response = await http.get(`/evaluations/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateEvaluationParams {
    internId: string;
    internName: string;
    mentorId: string;
    mentorName: string;
    type: string;
    score: number;
    feedback: string;
    date: string;
}

export const createEvaluation = async (params: CreateEvaluationParams): Promise<ResponseDetailSuccess<Evaluation>> => {
    const response = await http.post('/evaluations', {
        ...params,
        status: 'Completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return {
        code: 201,
        data: response.data
    };
};
