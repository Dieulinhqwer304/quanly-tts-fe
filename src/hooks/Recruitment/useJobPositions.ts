import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobPositionsService from '../../services/Recruitment/jobPositions';
import {
    GetJobPositionsParams,
    CreateJobPositionParams,
    UpdateJobPositionParams
} from '../../services/Recruitment/jobPositions';
import { MOCK_DATA } from '../../constants/MockData';

export const useJobPositions = (params?: GetJobPositionsParams) => {
    // Filter job positions based on params
    let filteredJobs = MOCK_DATA.jobPositions;

    // Filter by status (for public job board, only show "Open" jobs)
    if (params?.status) {
        filteredJobs = filteredJobs.filter(j => j.status === params.status);
    }

    // Filter by department
    if (params?.department) {
        filteredJobs = filteredJobs.filter(j => j.department === params.department);
    }

    // Search by keyword
    if (params?.searcher?.keyword) {
        const keyword = params.searcher.keyword.toLowerCase();
        filteredJobs = filteredJobs.filter(j =>
            j.title.toLowerCase().includes(keyword) ||
            j.description.toLowerCase().includes(keyword) ||
            j.department.toLowerCase().includes(keyword) ||
            j.requirements.toLowerCase().includes(keyword)
        );
    }

    return useQuery({
        queryKey: ['jobPositions', params],
        queryFn: () => jobPositionsService.getJobPositions(params),
        initialData: {
            code: 200,
            data: {
                hits: filteredJobs,
                pagination: {
                    totalPages: 1,
                    totalRows: filteredJobs.length
                }
            }
        }
    });
};

export const useJobPosition = (id: string) => {
    const job = MOCK_DATA.jobPositions.find(j => j.id === id);

    return useQuery({
        queryKey: ['jobPosition', id],
        queryFn: () => jobPositionsService.getJobPosition(id),
        enabled: !!id,
        initialData: job ? {
            code: 200,
            data: job
        } : undefined
    });
};

export const useCreateJobPosition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: CreateJobPositionParams) => jobPositionsService.createJobPosition(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
        }
    });
};

export const useUpdateJobPosition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateJobPositionParams) => jobPositionsService.updateJobPosition(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
            queryClient.invalidateQueries({ queryKey: ['jobPosition', data.data.id] });
        }
    });
};

export const useDeleteJobPosition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => jobPositionsService.deleteJobPosition({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
        }
    });
};
