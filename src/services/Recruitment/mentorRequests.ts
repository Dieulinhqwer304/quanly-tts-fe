import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface MentorRequest {
    id: string;
    type: 'Recruitment' | 'Training' | 'Equipment';
    name: string;
    title: string;
    department: string;
    requestedBy: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
    positions?: string[];
    quantity?: number;
    requiredSkills?: string[];
    expectedStartDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetMentorRequestsParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    status?: string;
    priority?: string;
    department?: string;
}

export const getMentorRequests = async (
    params?: GetMentorRequestsParams
): Promise<ResponseListSuccess<MentorRequest>> => {
    const queryParams: any = {
        q: params?.searcher?.keyword,
        _page: params?.pagination?.page || 1,
        _limit: params?.pagination?.pageSize || 10
    };

    if (params?.status && params.status !== 'all') {
        queryParams.status = params.status;
    }

    if (params?.priority && params.priority !== 'all') {
        queryParams.priority = params.priority;
    }

    if (params?.department && params.department !== 'all') {
        queryParams.department = params.department;
    }

    const response = await http.get('/mentor-requests', { params: queryParams });
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

export const getMentorRequest = async (id: string): Promise<ResponseDetailSuccess<MentorRequest>> => {
    const response = await http.get(`/mentor-requests/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateMentorRequestParams {
    type: 'Recruitment' | 'Training' | 'Equipment';
    name: string;
    title: string;
    department: string;
    priority: 'High' | 'Medium' | 'Low';
    positions?: string[];
    quantity?: number;
    requiredSkills?: string[];
    expectedStartDate?: string;
}

export const createMentorRequest = async (
    params: CreateMentorRequestParams
): Promise<ResponseDetailSuccess<MentorRequest>> => {
    const response = await http.post('/mentor-requests', {
        ...params,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return {
        code: 201,
        data: response.data
    };
};

export interface UpdateMentorRequestParams {
    id: string;
    type?: 'Recruitment' | 'Training' | 'Equipment';
    name?: string;
    title?: string;
    department?: string;
    priority?: 'High' | 'Medium' | 'Low';
    status?: 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
    positions?: string[];
    quantity?: number;
    requiredSkills?: string[];
    expectedStartDate?: string;
}

export const updateMentorRequest = async (
    params: UpdateMentorRequestParams
): Promise<ResponseDetailSuccess<MentorRequest>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/mentor-requests/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};

export const deleteMentorRequest = async (id: string): Promise<ResponseDetailSuccess<null>> => {
    await http.delete(`/mentor-requests/${id}`);
    return {
        code: 200,
        data: null
    };
};
