import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '../services/dashboard';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: () => dashboardService.getDashboardStats()
    });
};
