import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as mentorRequestsService from '../../services/Recruitment/mentorRequests';
import {
    GetMentorRequestsParams,
    CreateMentorRequestParams,
    UpdateMentorRequestParams
} from '../../services/Recruitment/mentorRequests';
import { MOCK_DATA } from '../../constants/MockData';

export const useMentorRequests = (params?: GetMentorRequestsParams) => {
    return useQuery({
        queryKey: ['mentorRequests', params],
        queryFn: () => mentorRequestsService.getMentorRequests(params),
        initialData: {
            code: 200,
            data: {
                hits: MOCK_DATA.mentorRequests as any,
                pagination: {
                    totalPages: 1,
                    totalRows: MOCK_DATA.mentorRequests.length
                }
            }
        }
    });
};

export const useMentorRequest = (id: string) => {
    return useQuery({
        queryKey: ['mentorRequest', id],
        queryFn: () => mentorRequestsService.getMentorRequest(id),
        enabled: !!id,
        initialData: () => {
            const request = MOCK_DATA.mentorRequests.find((r: any) => r.id === id);
            return request
                ? {
                    code: 200,
                    data: request as any
                }
                : undefined;
        }
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
