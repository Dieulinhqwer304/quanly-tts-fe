import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface OnboardingStep {
    title: string;
    status: 'finish' | 'process' | 'wait' | 'error';
}

export interface Onboarding {
    id: string;
    name: string;
    avatar: string;
    track: string;
    currentStep: number;
    startDate: string;
    status: 'In Progress' | 'Completed' | 'Delayed';
    steps: OnboardingStep[];
    createdAt: string;
    updatedAt: string;
}

export interface GetOnboardingParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    status?: string;
}

export const getOnboardingList = async (params?: GetOnboardingParams): Promise<ResponseListSuccess<Onboarding>> => {
    const queryParams: any = {
        q: params?.searcher?.keyword,
        _page: params?.pagination?.page || 1,
        _limit: params?.pagination?.pageSize || 10
    };

    if (params?.status && params.status !== 'all') {
        queryParams.status = params.status;
    }

    const response = await http.get('/onboarding', { params: queryParams });
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

export const getOnboarding = async (id: string): Promise<ResponseDetailSuccess<Onboarding>> => {
    const response = await http.get(`/onboarding/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateOnboardingParams {
    candidateId: string;
    name: string;
    avatar?: string;
    track: string;
    mentor?: string;
    department?: string;
    startDate: string;
    endDate?: string;
}

export const createOnboarding = async (params: CreateOnboardingParams): Promise<ResponseDetailSuccess<Onboarding>> => {
    const response = await http.post('/onboarding', {
        ...params,
        currentStep: 0,
        status: 'In Progress',
        steps: [
            { title: 'Documents', status: 'process' },
            { title: 'Account Setup', status: 'wait' },
            { title: 'Orientation', status: 'wait' },
            { title: 'First Assignment', status: 'wait' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return {
        code: 201,
        data: response.data
    };
};

export interface UpdateOnboardingParams {
    id: string;
    currentStep?: number;
    status?: string;
    steps?: OnboardingStep[];
}

export const updateOnboarding = async (params: UpdateOnboardingParams): Promise<ResponseDetailSuccess<Onboarding>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/onboarding/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};
