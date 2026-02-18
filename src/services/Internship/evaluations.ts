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
    intern?: {
        id: string;
        user?: {
            fullName: string;
        };
    };
    mentorId: string;
    mentor?: {
        fullName: string;
    };
    type: string;
    overallScore: number;
    technicalScore?: number;
    attitudeScore?: number;
    teamworkScore?: number;
    progressScore?: number;
    feedback: string;
    strengths?: string;
    weaknesses?: string;
    evaluationDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const getEvaluations = async (params?: any): Promise<ResponseListSuccess<Evaluation>> => {
    const response = await http.get('/evaluations', {
        params: {
            page: params?.pagination?.page,
            limit: params?.pagination?.pageSize,
            search: params?.searcher?.keyword,
            internId: params?.internId,
            mentorId: params?.mentorId
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
