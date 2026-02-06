import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as evaluationsService from '../../services/Internship/evaluations';
import { GetEvaluationsParams, CreateEvaluationParams } from '../../services/Internship/evaluations';

export const useEvaluations = (params?: GetEvaluationsParams) => {
    return useQuery({
        queryKey: ['evaluations', params],
        queryFn: () => evaluationsService.getEvaluations(params)
    });
};

export const useEvaluation = (id: string) => {
    return useQuery({
        queryKey: ['evaluation', id],
        queryFn: () => evaluationsService.getEvaluation(id),
        enabled: !!id
    });
};

export const useCreateEvaluation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: CreateEvaluationParams) => evaluationsService.createEvaluation(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
        }
    });
};
