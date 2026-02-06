import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as approvalsService from '../../services/Recruitment/approvals';
import { GetApprovalsParams, UpdateApprovalParams } from '../../services/Recruitment/approvals';

export const useApprovals = (params?: GetApprovalsParams) => {
    return useQuery({
        queryKey: ['approvals', params],
        queryFn: () => approvalsService.getApprovals(params)
    });
};

export const useApproval = (id: string) => {
    return useQuery({
        queryKey: ['approval', id],
        queryFn: () => approvalsService.getApproval(id),
        enabled: !!id
    });
};

export const useUpdateApproval = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateApprovalParams) => approvalsService.updateApproval(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            queryClient.invalidateQueries({ queryKey: ['approval', data.data.id] });
        }
    });
};
