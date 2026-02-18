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
    candidateId: string;
    internId?: string;
    name: string;
    avatar: string;
    email?: string;
    phone?: string;
    track: string;
    mentor?: string;
    department?: string;
    currentStep: number;
    startDate: string;
    endDate?: string;
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
    const response = await http.get('/onboardings', {
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

export const getOnboarding = async (id: string): Promise<ResponseDetailSuccess<Onboarding>> => {
    const response = await http.get(`/onboardings/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateOnboardingParams {
    candidateId: string;
    name: string;
    avatar?: string;
    email?: string;
    phone?: string;
    track: string;
    mentor?: string;
    department?: string;
    startDate: string;
    endDate?: string;
}

export const createOnboarding = async (params: CreateOnboardingParams): Promise<ResponseDetailSuccess<Onboarding>> => {
    const now = new Date().toISOString();

    const learningPathResponse = await http.get('/learningPaths', {
        params: { track: params.track }
    });
    const learningPath = learningPathResponse.data?.[0] as { id?: string; modules?: Array<{ id: number }> } | undefined;

    const internResponse = await http.post('/interns', {
        name: params.name,
        avatar: params.avatar || '',
        email: params.email || `${params.candidateId}@intern.local`,
        phone: params.phone || '',
        track: params.track,
        mentor: params.mentor || 'TBD',
        startDate: params.startDate,
        endDate: params.endDate || params.startDate,
        progress: 0,
        status: 'Active',
        createdAt: now,
        updatedAt: now
    });

    const intern = internResponse.data as { id: string };

    const moduleIds = (learningPath?.modules || []).map((module) => module.id);
    const currentModuleId = moduleIds[0] ?? null;

    if (learningPath?.id) {
        await http.post('/studentProgress', {
            internId: intern.id,
            learningPathId: learningPath.id,
            modulesCompleted: [],
            currentModuleId,
            quizScores: {},
            createdAt: now,
            updatedAt: now
        });
    }

    const response = await http.post('/onboardings', {
        ...params,
        internId: intern.id,
        currentStep: 0,
        status: 'In Progress',
        steps: [
            { title: 'Documents', status: 'process' },
            { title: 'Account Setup', status: 'wait' },
            { title: 'Orientation', status: 'wait' },
            { title: 'First Assignment', status: 'wait' }
        ],
        createdAt: now,
        updatedAt: now
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
    const response = await http.patch(`/onboardings/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};
