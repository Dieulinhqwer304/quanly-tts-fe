import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface JobPosition {
    id: string;
    code: string;
    title: string;
    recruitmentPlanId: string;
    recruitmentPlan?: {
        id: string;
        name: string;
    };
    department: string;
    level: string;
    requiredQuantity: number;
    filledQuantity: number;
    status: string;
    postedDate: string;
    description: string;
    requirements: string;
    location: string;
    salaryRange: string;
    createdAt: string;
    updatedAt: string;
}

export const getJobPositions = async (params?: any): Promise<ResponseListSuccess<JobPosition>> => {
    const response = await http.get('/job-positions', {
        params: {
            page: params?.pagination?.page,
            limit: params?.pagination?.pageSize,
            search: params?.searcher?.keyword,
            department: params?.department !== 'All' ? params?.department : undefined
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

export const getJobPosition = async (id: string): Promise<ResponseDetailSuccess<JobPosition>> => {
    const response = await http.get(`/job-positions/${id}`);
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
    const response = await http.post('/job-positions', {
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
    const response = await http.patch(`/job-positions/${id}`, {
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
    await http.delete(`/job-positions/${params.id}`);
    return {
        code: 200,
        data: null
    };
};
