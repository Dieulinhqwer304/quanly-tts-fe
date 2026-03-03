import { useState, useEffect, useCallback } from 'react';
import * as studentProgressService from '../../services/Internship/studentProgress';
import { MOCK_DATA } from '../../constants/MockData';

export const useStudentProgress = (internId: string) => {
    const [data, setData] = useState<any>(() => {
        const progress = MOCK_DATA.studentProgress.find((item) => item.internId === internId);
        if (progress) {
            return {
                code: 200,
                data: progress
            };
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        if (!internId) return;
        setIsLoading(true);
        try {
            const result = await studentProgressService.getInternProgress(internId);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [internId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};

export const useMyProgress = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await studentProgressService.getMyProgress();
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
