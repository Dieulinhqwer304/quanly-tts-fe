import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as onboardingService from '../../services/Recruitment/onboarding';
import { GetOnboardingParams, UpdateOnboardingParams } from '../../services/Recruitment/onboarding';
import { MOCK_DATA } from '../../constants/MockData';

export const useOnboardingList = (params?: GetOnboardingParams) => {
    return useQuery({
        queryKey: ['onboardingList', params],
        queryFn: () => onboardingService.getOnboardingList(params),
        initialData: {
            code: 200,
            data: {
                hits: MOCK_DATA.onboarding as onboardingService.Onboarding[],
                pagination: {
                    totalPages: 1,
                    totalRows: MOCK_DATA.onboarding.length
                }
            }
        }
    });
};

export const useOnboarding = (id: string) => {
    return useQuery({
        queryKey: ['onboarding', id],
        queryFn: () => onboardingService.getOnboarding(id),
        enabled: !!id
    });
};

export const useCreateOnboarding = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: onboardingService.CreateOnboardingParams) =>
            onboardingService.createOnboarding(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['onboardingList'] });
            queryClient.invalidateQueries({ queryKey: ['interns'] });
            queryClient.invalidateQueries({ queryKey: ['studentProgress'] });
        }
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
