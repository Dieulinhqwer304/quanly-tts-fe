import { http } from '../utils/http';
import { ResponseDetailSuccess } from '../utils/types/ServiceResponse';

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    todayVisits: number;
    openPositions: number;
    pendingApplications: number;
    upcomingInterviews: number;
    activeInterns: number;
    pendingReviews: number;
    conversionRate: number;
}

export const getDashboardStats = async (): Promise<ResponseDetailSuccess<DashboardStats>> => {
    const response = await http.get('/dashboardStats');
    return {
        code: 200,
        data: response.data
    };
};
