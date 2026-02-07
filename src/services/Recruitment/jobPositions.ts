import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface JobPosition {
    id: string;
    title: string;
    campaign: string;
    campaignId: string;
    department: string;
    level: string;
    required: number;
    filled: number;
    status: 'Open' | 'Closed' | 'On Hold';
    postedDate: string;
    description: string;
    requirements: string;
    location: string;
    salary: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetJobPositionsParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    department?: string;
    status?: 'Open' | 'Closed' | 'On Hold';
}

export const getJobPositions = async (params?: GetJobPositionsParams): Promise<ResponseListSuccess<JobPosition>> => {
    const queryParams: any = {
        q: params?.searcher?.keyword,
        _page: params?.pagination?.page || 1,
        _limit: params?.pagination?.pageSize || 10
    };

    if (params?.department && params.department !== 'All') {
        queryParams.department = params.department;
    }

    const response = await http.get('/jobPositions', { params: queryParams });
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

export const getJobPosition = async (id: string): Promise<ResponseDetailSuccess<JobPosition>> => {
    const response = await http.get(`/jobPositions/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateJobPositionParams {
    title: string;
    campaign: string;
    campaignId: string;
    department: string;
    level: string;
    required: number;
    description: string;
    requirements: string;
    location: string;
    salary: string;
}

export const createJobPosition = async (
    params: CreateJobPositionParams
): Promise<ResponseDetailSuccess<JobPosition>> => {
    const response = await http.post('/jobPositions', {
        ...params,
        filled: 0,
        status: 'Open',
        postedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return {
        code: 201,
        data: response.data
    };
};

export interface UpdateJobPositionParams {
    id: string;
    title?: string;
    campaign?: string;
    campaignId?: string;
    department?: string;
    level?: string;
    required?: number;
    filled?: number;
    status?: string;
    description?: string;
    requirements?: string;
    location?: string;
    salary?: string;
}

export const updateJobPosition = async (
    params: UpdateJobPositionParams
): Promise<ResponseDetailSuccess<JobPosition>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/jobPositions/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};

export interface DeleteJobPositionParams {
    id: string;
}

export const deleteJobPosition = async (params: DeleteJobPositionParams): Promise<ResponseDetailSuccess<null>> => {
    await http.delete(`/jobPositions/${params.id}`);
    return {
        code: 200,
        data: null
    };
};
