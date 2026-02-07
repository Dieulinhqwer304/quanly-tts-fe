import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as learningPathService from '../../services/Internship/learningPath';
import { LearningPath } from '../../services/Internship/learningPath';
import { MOCK_DATA } from '../../constants/MockData';

export const useLearningPaths = () => {
    return useQuery({
        queryKey: ['learningPaths'],
        queryFn: learningPathService.getLearningPaths,
        initialData: {
            code: 200,
            data: {
                hits: MOCK_DATA.learningPaths,
                pagination: {
                    totalPages: 1,
                    totalRows: MOCK_DATA.learningPaths.length
                }
            }
        }
    });
};

export const useLearningPath = (track: string) => {
    return useQuery({
        queryKey: ['learningPath', track],
        queryFn: () => learningPathService.getLearningPathByTrack(track),
        enabled: !!track
    });
};

export const useUpdateLearningPath = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<LearningPath> }) =>
            learningPathService.updateLearningPath(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
            queryClient.invalidateQueries({ queryKey: ['learningPath', data.data.track] });
        }
    });
};
