import { useState, useEffect, useCallback } from 'react';
import * as learningPathService from '../../services/Internship/learningPath';
import { LearningPath } from '../../services/Internship/learningPath';
import { MOCK_DATA } from '../../constants/MockData';

export const useLearningPaths = () => {
    const [data, setData] = useState<any>({
        code: 200,
        data: {
            hits: MOCK_DATA.learningPaths,
            pagination: {
                totalPages: 1,
                totalRows: MOCK_DATA.learningPaths.length
            }
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await learningPathService.getLearningPaths();
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

export const useLearningPath = (track: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        if (!track) return;
        setIsLoading(true);
        try {
            const result = await learningPathService.getLearningPathByTrack(track);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [track]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};

export const useUpdateLearningPath = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = async ({ id, data }: { id: string; data: Partial<LearningPath> }) => {
        setIsLoading(true);
        try {
            const result = await learningPathService.updateLearningPath(id, data);
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
