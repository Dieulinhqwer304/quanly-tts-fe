import { Account } from '../models/Account';

export const RouteConfig = {
    ForbiddenPage: {
        path: '/403'
    },
    NotFoundPage: {
        path: '/404'
    },
    InternalErrorPage: {
        path: '/500'
    },

    LoginPage: {
        path: '/login',
        searchParam: 'redirectTo',
        getFullPath: (redirectTo: string) => {
            return `/login?redirectTo=${redirectTo}`;
        }
    },
    ForgotPassword: {
        path: '/forgot-password'
    },
    ForgotPasswordSucess: {
        path: '/forgot-password-success'
    },
    Logout: {
        path: '/logout'
    },
    ProfilePage: {
        path: '/profile'
    },

    DashBoardPage: {
        path: '/'
    },

    SettingPage: {
        path: '/setting'
    },

    ListUserPage: {
        path: '/users'
    },
    CreateUserPage: {
        path: '/users/create'
    },
    UpdateUserPage: {
        path: '/users/:id/update',
        getPath: (_id: Account['_id']) => {
            return `/users/${_id}/update`;
        }
    },
    DetailUserPage: {
        path: '/users/:id/detail',
        paramKey: 'id',
        getPath: (_id: Account['_id']) => {
            return `/users/${_id}/detail`;
        }
    },

    PublicJobBoard: {
        path: '/jobs'
    },
    PublicJobDetail: {
        path: '/jobs/:id',
        getPath: (id: string) => `/jobs/${id}`
    },

    RecruitmentPlanList: {
        path: '/recruitment/plans'
    },
    RecruitmentPlanCreate: {
        path: '/recruitment/plans/create'
    },
    RecruitmentPlanUpdate: {
        path: '/recruitment/plans/:id/update',
        getPath: (id: string) => `/recruitment/plans/${id}/update`
    },
    RecruitmentJobList: {
        path: '/recruitment/jobs'
    },

    CVList: {
        path: '/recruitment/cvs'
    },
    CVDetail: {
        path: '/recruitment/cvs/:id',
        getPath: (id: string) => `/recruitment/cvs/${id}`
    },
    InterviewSchedule: {
        path: '/recruitment/interviews'
    },

    OnboardingList: {
        path: '/recruitment/onboarding'
    },
    InternList: {
        path: '/recruitment/interns'
    },

    MentorRequestList: {
        path: '/mentor/requests'
    },
    MentorLearningPath: {
        path: '/mentor/learning-paths'
    },
    MentorEvalPhase1: {
        path: '/mentor/eval-phase1/:id',
        getPath: (id: string) => `/mentor/eval-phase1/${id}`
    },
    MentorTaskManagement: {
        path: '/mentor/tasks'
    },
    MentorEvalPhase2: {
        path: '/mentor/eval-phase2/:id',
        getPath: (id: string) => `/mentor/eval-phase2/${id}`
    },
    MentorEvalFinal: {
        path: '/mentor/eval-final/:id',
        getPath: (id: string) => `/mentor/eval-final/${id}`
    },

    InternDashboard: {
        path: '/intern/dashboard'
    },
    InternTest: {
        path: '/intern/test'
    },
    InternTaskBoard: {
        path: '/intern/tasks'
    },
    InternReports: {
        path: '/intern/reports'
    },
    InternCertificate: {
        path: '/intern/certificate'
    },

    DirectorApprovals: {
        path: '/director/approvals'
    }
};
