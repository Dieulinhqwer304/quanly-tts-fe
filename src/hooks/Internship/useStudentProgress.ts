import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as studentProgressService from '../../services/Internship/studentProgress';
import { MOCK_DATA } from '../../constants/MockData';

export const useStudentProgress = (internId: string) => {
    return useQuery({
        queryKey: ['studentProgress', internId],
        queryFn: () => studentProgressService.getStudentProgressByIntern(internId),
        enabled: !!internId,
        initialData: () => {
            const progress = MOCK_DATA.studentProgress.find((item) => item.internId === internId);
            if (!progress) {
                return undefined;
            }
            return {
                code: 200,
                data: progress
            };
        }
    });
};

export const useSubmitModuleQuiz = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: studentProgressService.submitModuleQuiz,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['studentProgress', response.data.internId] });
            queryClient.invalidateQueries({ queryKey: ['intern', response.data.internId] });
        }
    });
};
