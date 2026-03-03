import { useState, useEffect, useCallback } from 'react';
import * as approvalsService from '../../services/Recruitment/approvals';
import { GetApprovalsParams, UpdateApprovalParams } from '../../services/Recruitment/approvals';
import { MOCK_DATA } from '../../constants/MockData';

export const useApprovals = (params?: GetApprovalsParams) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const paramsString = JSON.stringify(params);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await approvalsService.getApprovals(params);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [paramsString]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};

export const useApproval = (id: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const result = await approvalsService.getApproval(id);
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

export const useUpdateApproval = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = async (params: UpdateApprovalParams) => {
        setIsLoading(true);
        try {
            const result = await approvalsService.updateApproval(params);
            setError(null);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading: isLoading, error };
};
