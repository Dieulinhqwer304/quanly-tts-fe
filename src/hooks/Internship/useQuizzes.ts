import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as quizzesService from '../../services/Internship/quizzes';
import { Quiz } from '../../services/Internship/quizzes';
import { MOCK_DATA } from '../../constants/MockData';

export const useQuizzes = () => {
    return useQuery({
        queryKey: ['quizzes'],
        queryFn: quizzesService.getQuizzes,
        initialData: {
            code: 200,
            data: {
                hits: MOCK_DATA.quizzes,
                pagination: {
                    totalPages: 1,
                    totalRows: MOCK_DATA.quizzes.length
                }
            }
        }
    });
};

export const useQuiz = (id: string) => {
    return useQuery({
        queryKey: ['quiz', id],
        queryFn: () => quizzesService.getQuiz(id),
        enabled: !!id,
        initialData: () => {
            const quiz = MOCK_DATA.quizzes.find((q) => q.id === id);
            if (quiz) {
                return {
                    code: 200,
                    data: quiz
                };
            }
            return undefined;
        }
    });
};

export const useCreateQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: quizzesService.createQuiz,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        }
    });
};

export const useUpdateQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: quizzesService.updateQuiz,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
            queryClient.invalidateQueries({ queryKey: ['quiz', data.data.id] });
        }
    });
};
