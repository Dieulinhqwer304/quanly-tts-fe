import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as onboardingService from '../../services/Recruitment/onboarding';
import { GetOnboardingParams, UpdateOnboardingParams } from '../../services/Recruitment/onboarding';

export const useOnboardingList = (params?: GetOnboardingParams) => {
    return useQuery({
        queryKey: ['onboardingList', params],
        queryFn: () => onboardingService.getOnboardingList(params)
    });
};

export const useOnboarding = (id: string) => {
    return useQuery({
        queryKey: ['onboarding', id],
        queryFn: () => onboardingService.getOnboarding(id),
        enabled: !!id
    });
};

export const useUpdateOnboarding = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateOnboardingParams) => onboardingService.updateOnboarding(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['onboardingList'] });
            queryClient.invalidateQueries({ queryKey: ['onboarding', data.data.id] });
        }
    });
};
