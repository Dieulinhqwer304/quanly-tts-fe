import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as recruitmentPlansService from '../../services/Recruitment/recruitmentPlans';
import {
    GetRecruitmentPlansParams,
    CreateRecruitmentPlanParams,
    UpdateRecruitmentPlanParams
} from '../../services/Recruitment/recruitmentPlans';
import { MOCK_DATA } from '../../constants/MockData';

export const useRecruitmentPlans = (params?: GetRecruitmentPlansParams) => {
    return useQuery({
        queryKey: ['recruitmentPlans', params],
        queryFn: () => recruitmentPlansService.getRecruitmentPlans(params),
        initialData: {
            code: 200,
            data: {
                hits: MOCK_DATA.recruitmentPlans,
                pagination: {
                    totalPages: 1,
                    totalRows: MOCK_DATA.recruitmentPlans.length
                }
            }
        }
    });
};

export const useRecruitmentPlan = (id: string) => {
    return useQuery({
        queryKey: ['recruitmentPlan', id],
        queryFn: () => recruitmentPlansService.getRecruitmentPlan(id),
        enabled: !!id
    });
};

export const useCreateRecruitmentPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: CreateRecruitmentPlanParams) => recruitmentPlansService.createRecruitmentPlan(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitmentPlans'] });
        }
    });
};

export const useUpdateRecruitmentPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateRecruitmentPlanParams) => recruitmentPlansService.updateRecruitmentPlan(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['recruitmentPlans'] });
            queryClient.invalidateQueries({ queryKey: ['recruitmentPlan', data.data.id] });
        }
    });
};

export const useDeleteRecruitmentPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => recruitmentPlansService.deleteRecruitmentPlan({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitmentPlans'] });
        }
    });
};
