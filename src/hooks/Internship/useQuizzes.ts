import { useState, useEffect, useCallback } from 'react';
import * as quizzesService from '../../services/Internship/quizzes';
import { MOCK_DATA } from '../../constants/MockData';

export const useQuizzes = () => {
    const [data, setData] = useState<any>({
        code: 200,
        data: {
            hits: MOCK_DATA.quizzes,
            pagination: {
                totalPages: 1,
                totalRows: MOCK_DATA.quizzes.length
            }
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await quizzesService.getQuizzes();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};

export const useQuiz = (id: string) => {
    const [data, setData] = useState<any>(() => {
        const quiz = MOCK_DATA.quizzes.find((q) => q.id === id);
        if (quiz) {
            return {
                code: 200,
                data: quiz
            };
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const result = await quizzesService.getQuiz(id);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};

export const useCreateQuiz = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = async (params: any) => {
        setIsLoading(true);
        try {
            const result = await quizzesService.createQuiz(params);
            setError(null);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, error };
};

export const useUpdateQuiz = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = async ({ id, data }: { id: string; data: any }) => {
        setIsLoading(true);
        try {
            const result = await quizzesService.updateQuiz(id, data);
            setError(null);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, error };
};

export const useSubmitQuiz = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = async (quizId: string, answers: Record<string, string>) => {
        setIsLoading(true);
        try {
            const result = await quizzesService.submitQuiz(quizId, answers);
            setError(null);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, error };
};
