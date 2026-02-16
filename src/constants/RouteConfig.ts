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

    ModuleSelection: {
        path: '/'
    },

    SettingPage: {
        path: '/admin/setting'
    },

    PublicJobBoard: {
        path: '/jobs'
    },
    PublicJobDetail: {
        path: '/jobs/:id',
        getPath: (id: string) => `/jobs/${id}`
    },

    // RECRUITMENT MODULE
    RecruitmentDashboard: {
        path: '/recruitment/dashboard'
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

    // TRAINING MODULE
    MentorRequestList: {
        path: '/training/mentor/requests'
    },
    MentorLearningPath: {
        path: '/training/mentor/learning-paths'
    },
    MentorEvalPhase1: {
        path: '/training/mentor/eval-phase1/:id',
        getPath: (id: string) => `/training/mentor/eval-phase1/${id}`
    },
    MentorTaskManagement: {
        path: '/training/mentor/tasks'
    },
    MentorEvalPhase2: {
        path: '/training/mentor/eval-phase2/:id',
        getPath: (id: string) => `/training/mentor/eval-phase2/${id}`
    },
    MentorEvalFinal: {
        path: '/training/mentor/eval-final/:id',
        getPath: (id: string) => `/training/mentor/eval-final/${id}`
    },
    MentorEvaluation: {
        path: '/training/mentor/evaluations/:id',
        getPath: (id: string) => `/training/mentor/evaluations/${id}`
    },
    InternDashboard: {
        path: '/training/intern/dashboard'
    },
    InternTest: {
        path: '/training/intern/test'
    },
    InternTaskBoard: {
        path: '/training/intern/tasks'
    },

    // ADMIN MODULE
    DirectorApprovals: {
        path: '/admin/director/approvals'
    },
    UserManagement: {
        path: '/admin/users'
    },
    PermissionManagement: {
        path: '/admin/permissions'
    }
};
