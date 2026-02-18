import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface RecruitmentPlan {
    id: string;
    name: string;
    batch: string;
    department: string;
    startDate: string;
    endDate: string;
    description: string;
    status: 'Active' | 'Pending' | 'Closed';
    candidates: number;
    createdAt: string;
    updatedAt: string;
}

export interface GetRecruitmentPlansParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
}

export const getRecruitmentPlans = async (
    params?: GetRecruitmentPlansParams
): Promise<ResponseListSuccess<RecruitmentPlan>> => {
    const response = await http.get('/recruitment-plans', {
        params: {
            page: params?.pagination?.page,
            limit: params?.pagination?.pageSize,
            search: params?.searcher?.keyword
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

export const getRecruitmentPlan = async (id: string): Promise<ResponseDetailSuccess<RecruitmentPlan>> => {
    const response = await http.get(`/recruitment-plans/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateRecruitmentPlanParams {
    name: string;
    batch: string;
    department: string;
    startDate: string;
    endDate: string;
    description?: string;
    status: string;
}

export const createRecruitmentPlan = async (
    params: CreateRecruitmentPlanParams
): Promise<ResponseDetailSuccess<RecruitmentPlan>> => {
    const response = await http.post('/recruitment-plans', {
        ...params,
        candidates: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return {
        code: 201,
        data: response.data
    };
};

export interface UpdateRecruitmentPlanParams {
    id: string;
    name?: string;
    batch?: string;
    department?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    status?: string;
}

export const updateRecruitmentPlan = async (
    params: UpdateRecruitmentPlanParams
): Promise<ResponseDetailSuccess<RecruitmentPlan>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/recruitment-plans/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};

export interface DeleteRecruitmentPlanParams {
    id: string;
}

export const deleteRecruitmentPlan = async (
    params: DeleteRecruitmentPlanParams
): Promise<ResponseDetailSuccess<null>> => {
    await http.delete(`/recruitment-plans/${params.id}`);
    return {
        code: 200,
        data: null
    };
};
