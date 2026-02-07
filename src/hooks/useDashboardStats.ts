import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '../services/dashboard';
import { MOCK_DATA } from '../constants/MockData';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: () => dashboardService.getDashboardStats(),
        initialData: {
            code: 200,
            data: MOCK_DATA.dashboardStats
        }
    });
};
