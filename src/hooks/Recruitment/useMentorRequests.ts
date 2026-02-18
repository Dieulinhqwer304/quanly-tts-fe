import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as mentorRequestsService from '../../services/Recruitment/mentorRequests';
import { CreateMentorRequestParams, UpdateMentorRequestParams } from '../../services/Recruitment/mentorRequests';

export const useMentorRequests = (params?: any) => {
    return useQuery({
        queryKey: ['mentorRequests', params],
        queryFn: () => mentorRequestsService.getMentorRequests(params)
    });
};

export const useMentorRequest = (id: string) => {
    return useQuery({
        queryKey: ['mentorRequest', id],
        queryFn: () => mentorRequestsService.getMentorRequest(id),
        enabled: !!id
    });
};

export const useCreateMentorRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: CreateMentorRequestParams) => mentorRequestsService.createMentorRequest(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentorRequests'] });
        }
    });
};

export const useUpdateMentorRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateMentorRequestParams) => mentorRequestsService.updateMentorRequest(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['mentorRequests'] });
            queryClient.invalidateQueries({ queryKey: ['mentorRequest', data.data.id] });
        }
    });
};

export const useDeleteMentorRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => mentorRequestsService.deleteMentorRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentorRequests'] });
        }
    });
};
