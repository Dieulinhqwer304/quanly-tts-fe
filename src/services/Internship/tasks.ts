import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface Task {
    id: string;
    code: string;
    title: string;
    description: string;
    internId: string;
    intern?: {
        id: string;
        user?: {
            fullName: string;
            avatarUrl: string;
        };
    };
    mentorId: string;
    priority: string;
    dueDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const getTasks = async (params?: any): Promise<ResponseListSuccess<Task>> => {
    const response = await http.get('/tasks', {
        params: {
            page: params?.pagination?.page,
            limit: params?.pagination?.pageSize,
            search: params?.searcher?.keyword,
            internId: params?.internId,
            status: params?.status !== 'All' ? params?.status : undefined
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

export const getTask = async (id: string): Promise<ResponseDetailSuccess<Task>> => {
    const response = await http.get(`/tasks/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateTaskParams {
    title: string;
    internId: string;
    priority: string;
    dueDate: string;
    description: string;
}

export const createTask = async (params: CreateTaskParams): Promise<ResponseDetailSuccess<Task>> => {
    const response = await http.post('/tasks', {
        ...params,
        status: 'To Do',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return {
        code: 201,
        data: response.data
    };
};

export interface UpdateTaskParams {
    id: string;
    title?: string;
    priority?: string;
    dueDate?: string;
    status?: string;
    description?: string;
}

export const updateTask = async (params: UpdateTaskParams): Promise<ResponseDetailSuccess<Task>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/tasks/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};

export const deleteTask = async (id: string): Promise<ResponseDetailSuccess<null>> => {
    await http.delete(`/tasks/${id}`);
    return {
        code: 200,
        data: null
    };
};
