import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as candidatesService from '../../services/Recruitment/candidates';
import {
    GetCandidatesParams,
    CreateCandidateParams,
    UpdateCandidateParams,
    ShortlistCandidateParams,
    RejectCandidateParams
} from '../../services/Recruitment/candidates';

export const useCandidates = (params?: GetCandidatesParams) => {
    return useQuery({
        queryKey: ['candidates', params],
        queryFn: () => candidatesService.getCandidates(params)
    });
};

export const useCandidate = (id: string) => {
    return useQuery({
        queryKey: ['candidate', id],
        queryFn: () => candidatesService.getCandidate(id),
        enabled: !!id
    });
};

export const useCreateCandidate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: CreateCandidateParams) => candidatesService.createCandidate(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        }
    });
};

export const useUpdateCandidate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateCandidateParams) => candidatesService.updateCandidate(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            queryClient.invalidateQueries({ queryKey: ['candidate', data.data.id] });
        }
    });
};

export const useShortlistCandidate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: ShortlistCandidateParams) => candidatesService.shortlistCandidate(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            queryClient.invalidateQueries({ queryKey: ['candidate', data.data.id] });
        }
    });
};

export const useRejectCandidate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: RejectCandidateParams) => candidatesService.rejectCandidate(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            queryClient.invalidateQueries({ queryKey: ['candidate', data.data.id] });
        }
    });
};

export const usePassInterviewCandidate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: candidatesService.PassInterviewCandidateParams) =>
            candidatesService.passInterviewCandidate(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            queryClient.invalidateQueries({ queryKey: ['candidate', data.data.id] });
        }
    });
};

export const useDeleteCandidate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => candidatesService.deleteCandidate({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        }
    });
};
