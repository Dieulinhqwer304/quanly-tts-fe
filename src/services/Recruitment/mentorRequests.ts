import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface MentorRequest {
    id: string;
    title: string;
    department: string;
    mentorId: string;
    mentor?: {
        id: string;
        fullName: string;
    };
    position: string;
    quantity: number;
    requiredSkills: string;
    expectedStartDate: string;
    priority: string;
    status: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export const getMentorRequests = async (params?: any): Promise<ResponseListSuccess<MentorRequest>> => {
    const response = await http.get('/mentor-requests', {
        params: {
            page: params?.pagination?.page,
            limit: params?.pagination?.pageSize,
            search: params?.searcher?.keyword,
            status: params?.status !== 'all' ? params?.status : undefined,
            priority: params?.priority !== 'all' ? params?.priority : undefined,
            department: params?.department !== 'all' ? params?.department : undefined
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
