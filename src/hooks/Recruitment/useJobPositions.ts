import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobPositionsService from '../../services/Recruitment/jobPositions';
import {
    GetJobPositionsParams,
    CreateJobPositionParams,
    UpdateJobPositionParams
} from '../../services/Recruitment/jobPositions';

export const useJobPositions = (params?: GetJobPositionsParams) => {
    return useQuery({
        queryKey: ['jobPositions', params],
        queryFn: () => jobPositionsService.getJobPositions(params)
    });
};

export const useJobPosition = (id: string) => {
    return useQuery({
        queryKey: ['jobPosition', id],
        queryFn: () => jobPositionsService.getJobPosition(id),
        enabled: !!id
    });
};

export const useCreateJobPosition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: CreateJobPositionParams) => jobPositionsService.createJobPosition(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
        }
    });
};

export const useUpdateJobPosition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateJobPositionParams) => jobPositionsService.updateJobPosition(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
            queryClient.invalidateQueries({ queryKey: ['jobPosition', data.data.id] });
        }
    });
};

export const useDeleteJobPosition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => jobPositionsService.deleteJobPosition({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
        }
    });
};
