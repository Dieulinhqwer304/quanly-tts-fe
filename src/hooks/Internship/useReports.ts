import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reportsService from '../../services/Internship/reports';
import { GetReportsParams, CreateReportParams, UpdateReportParams } from '../../services/Internship/reports';

export const useReports = (params?: GetReportsParams) => {
    return useQuery({
        queryKey: ['reports', params],
        queryFn: () => reportsService.getReports(params)
    });
};

export const useReport = (id: string) => {
    return useQuery({
        queryKey: ['report', id],
        queryFn: () => reportsService.getReport(id),
        enabled: !!id
    });
};

export const useCreateReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: CreateReportParams) => reportsService.createReport(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
    });
};

export const useUpdateReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateReportParams) => reportsService.updateReport(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['report', data.data.id] });
        }
    });
};

export const useDeleteReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => reportsService.deleteReport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
    });
};
