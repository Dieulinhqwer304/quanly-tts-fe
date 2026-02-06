import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface Report {
    id: string;
    internId: string;
    title: string;
    type: 'Weekly' | 'Monthly';
    period: string;
    submittedAt: string;
    status: 'Submitted' | 'Approved' | 'Rejected';
    score?: number;
    feedback?: string;
    content: string;
    challenges: string;
    nextPlan: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetReportsParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    internId?: string;
    status?: string;
    type?: string;
}

export const getReports = async (params?: GetReportsParams): Promise<ResponseListSuccess<Report>> => {
    const queryParams: any = {
        q: params?.searcher?.keyword,
        _page: params?.pagination?.page || 1,
        _limit: params?.pagination?.pageSize || 10
    };

    if (params?.internId) {
        queryParams.internId = params.internId;
    }

    if (params?.status && params.status !== 'All') {
        queryParams.status = params.status;
    }

    if (params?.type && params.type !== 'All') {
        queryParams.type = params.type;
    }

    const response = await http.get('/reports', { params: queryParams });
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

export const getReport = async (id: string): Promise<ResponseDetailSuccess<Report>> => {
    const response = await http.get(`/reports/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateReportParams {
    internId: string;
    title: string;
    type: 'Weekly' | 'Monthly';
    period: string;
    content: string;
    challenges: string;
    nextPlan: string;
}

export const createReport = async (params: CreateReportParams): Promise<ResponseDetailSuccess<Report>> => {
    const response = await http.post('/reports', {
        ...params,
        status: 'Submitted',
        submittedAt: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return {
        code: 201,
        data: response.data
    };
};

export interface UpdateReportParams {
    id: string;
    status?: 'Approved' | 'Rejected';
    score?: number;
    feedback?: string;
}

export const updateReport = async (params: UpdateReportParams): Promise<ResponseDetailSuccess<Report>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/reports/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};

export const deleteReport = async (id: string): Promise<void> => {
    await http.delete(`/reports/${id}`);
};
