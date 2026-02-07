import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as approvalsService from '../../services/Recruitment/approvals';
import { GetApprovalsParams, UpdateApprovalParams } from '../../services/Recruitment/approvals';
import { MOCK_DATA } from '../../constants/MockData';

export const useApprovals = (params?: GetApprovalsParams) => {
    // Filter approvals based on params
    let filteredApprovals = MOCK_DATA.approvals;

    if (params?.status) {
        filteredApprovals = filteredApprovals.filter(a => a.status === params.status);
    }

    if (params?.searcher?.keyword) {
        const keyword = params.searcher.keyword.toLowerCase();
        filteredApprovals = filteredApprovals.filter(a =>
            a.name.toLowerCase().includes(keyword) ||
            a.title.toLowerCase().includes(keyword) ||
            a.department.toLowerCase().includes(keyword)
        );
    }

    return useQuery({
        queryKey: ['approvals', params],
        queryFn: () => approvalsService.getApprovals(params),
        initialData: {
            code: 200,
            data: {
                hits: filteredApprovals as any,
                pagination: {
                    totalPages: 1,
                    totalRows: filteredApprovals.length
                }
            }
        }
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
