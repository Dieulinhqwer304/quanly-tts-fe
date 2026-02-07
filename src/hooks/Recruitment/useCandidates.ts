import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as candidatesService from '../../services/Recruitment/candidates';
import {
    GetCandidatesParams,
    CreateCandidateParams,
    UpdateCandidateParams,
    ShortlistCandidateParams,
    RejectCandidateParams
} from '../../services/Recruitment/candidates';
import { MOCK_DATA } from '../../constants/MockData';

export const useCandidates = (params?: GetCandidatesParams) => {
    // Filter candidates based on params
    let filteredCandidates = MOCK_DATA.candidates;

    // Filter by status
    if (params?.status && params.status !== 'all') {
        filteredCandidates = filteredCandidates.filter(c => c.status === params.status);
    }

    // Search by keyword
    if (params?.searcher?.keyword) {
        const keyword = params.searcher.keyword.toLowerCase();
        filteredCandidates = filteredCandidates.filter(c =>
            c.name.toLowerCase().includes(keyword) ||
            c.email.toLowerCase().includes(keyword) ||
            c.appliedForTitle.toLowerCase().includes(keyword)
        );
    }

    return useQuery({
        queryKey: ['candidates', params],
        queryFn: () => candidatesService.getCandidates(params),
        initialData: {
            code: 200,
            data: {
                hits: filteredCandidates,
                pagination: {
                    totalPages: 1,
                    totalRows: filteredCandidates.length
                }
            }
        }
    });
};

export const useCandidate = (id: string) => {
    const candidate = MOCK_DATA.candidates.find(c => c.id === id);

    return useQuery({
        queryKey: ['candidate', id],
        queryFn: () => candidatesService.getCandidate(id),
        enabled: !!id,
        initialData: candidate ? {
            code: 200,
            data: candidate
        } : undefined
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
