import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tasksService from '../../services/Internship/tasks';
import { GetTasksParams, CreateTaskParams, UpdateTaskParams } from '../../services/Internship/tasks';
import { MOCK_DATA } from '../../constants/MockData';

export const useTasks = (params?: GetTasksParams) => {
    return useQuery({
        queryKey: ['tasks', params],
        queryFn: () => tasksService.getTasks(params),
        initialData: {
            code: 200,
            data: {
                hits: MOCK_DATA.tasks,
                pagination: {
                    totalPages: 1,
                    totalRows: MOCK_DATA.tasks.length
                }
            }
        }
    });
};

export const useTask = (id: string) => {
    return useQuery({
        queryKey: ['task', id],
        queryFn: () => tasksService.getTask(id),
        enabled: !!id
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: CreateTaskParams) => tasksService.createTask(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateTaskParams) => tasksService.updateTask(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task', data.data.id] });
        }
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => tasksService.deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });
};
