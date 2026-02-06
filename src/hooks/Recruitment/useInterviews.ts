import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as interviewsService from '../../services/Recruitment/interviews';
import {
    GetInterviewsParams,
    CreateInterviewParams,
    UpdateInterviewParams
} from '../../services/Recruitment/interviews';

export const useInterviews = (params?: GetInterviewsParams) => {
    return useQuery({
        queryKey: ['interviews', params],
        queryFn: () => interviewsService.getInterviews(params)
    });
};

export const useInterview = (id: string) => {
    return useQuery({
        queryKey: ['interview', id],
        queryFn: () => interviewsService.getInterview(id),
        enabled: !!id
    });
};

export const useCreateInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: CreateInterviewParams) => interviewsService.createInterview(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
        }
    });
};

export const useUpdateInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateInterviewParams) => interviewsService.updateInterview(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            queryClient.invalidateQueries({ queryKey: ['interview', data.data.id] });
        }
    });
};

export const useDeleteInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => interviewsService.deleteInterview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
        }
    });
};
