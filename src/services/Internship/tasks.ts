import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface Task {
    id: string;
    title: string;
    intern: string;
    internId: string;
    internAvatar: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    status: 'To Do' | 'In Progress' | 'Under Review' | 'Completed';
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetTasksParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    internId?: string;
    status?: string;
}

export const getTasks = async (params?: GetTasksParams): Promise<ResponseListSuccess<Task>> => {
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

    const response = await http.get('/tasks', { params: queryParams });
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

export const getTask = async (id: string): Promise<ResponseDetailSuccess<Task>> => {
    const response = await http.get(`/tasks/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface CreateTaskParams {
    title: string;
    intern: string;
    internId: string;
    internAvatar: string;
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
