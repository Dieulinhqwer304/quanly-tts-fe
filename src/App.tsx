import { FC } from 'react';
import { BrowserRouter, Route, RouteObject, Routes } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { ConfigProvider } from 'antd';
import { themeConfig } from './theme/themeConfig';
import { RouteConfig } from './constants/RouteConfig';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './components/Notification/Notification';
import { AuthLayout } from './layouts/AuthLayout/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';
import RootLayout from './layouts/RootLayout/RootLayout';
import { ProtectRoute } from './components/ProtectRoute/ProtectRoute';

import CreateUserPage from './pages/authentication/AccountPage/CreateUserPage';
import ListUserPage from './pages/authentication/AccountPage/ListUserPage';
import UpdateUserPage from './pages/authentication/AccountPage/UpdateUserPage';
import { DashboardPage } from './pages/authentication/DashboardPage/DashboardPage';
import ProfilePage from './pages/authentication/ProfilePage/ProfilePage';
import SettingPage from './pages/authentication/SettingPage/SettingPage';
import { ForbiddenPage } from './pages/unauthentication/ForbiddenPage/ForbiddenPage';
import { FormLogout } from './pages/unauthentication/FormLogout/FormLogout';
import { InternalErrorPage } from './pages/unauthentication/InternalErrorPage/InternalErrorPage';
import { LoginPage } from './pages/unauthentication/LoginPage/LoginPage';
import { NotFoundPage } from './pages/unauthentication/NotFoundPage/NotFoundPage';

import { JobBoardPage } from './pages/public/JobBoard/JobBoardPage';
import { JobDetailPage } from './pages/public/JobBoard/JobDetailPage';
import { RecruitmentPlanList } from './pages/authentication/Recruitment/RecruitmentPlanList';
import { RecruitmentPlanCreate } from './pages/authentication/Recruitment/RecruitmentPlanCreate';
import { RecruitmentJobList } from './pages/authentication/Recruitment/RecruitmentJobList';
import { CVList } from './pages/authentication/Candidate/CVList';
import { CVDetail } from './pages/authentication/Candidate/CVDetail';
import { InterviewSchedule } from './pages/authentication/Candidate/InterviewSchedule';
import { OnboardingList } from './pages/authentication/Internship/OnboardingList';
import { InternList } from './pages/authentication/Internship/InternList';
import { MentorRequestList } from './pages/authentication/Recruitment/MentorRequestList';
import { MentorLearningPath } from './pages/authentication/Internship/MentorLearningPath';
import { MentorEvalPhase1 } from './pages/authentication/Internship/MentorEvalPhase1';
import { MentorTaskManagement } from './pages/authentication/Internship/MentorTaskManagement';
import { MentorEvalPhase2 } from './pages/authentication/Internship/MentorEvalPhase2';
import { MentorEvalFinal } from './pages/authentication/Internship/MentorEvalFinal';
import { InternDashboard } from './pages/authentication/Internship/InternDashboard';
import { InternTest } from './pages/authentication/Internship/InternTest';
import { InternTaskBoard } from './pages/authentication/Internship/InternTaskBoard';
import { DirectorApprovals } from './pages/authentication/Director/DirectorApprovals';

const dashboardRoutes: RouteObject[] = [
    {
        path: '/',
        element: (
            <ProtectRoute>
                <DashboardPage />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.ListUserPage.path,
        element: (
            <ProtectRoute>
                <ListUserPage />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.CreateUserPage.path,
        element: (
            <ProtectRoute>
                <CreateUserPage />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.UpdateUserPage.path,
        element: (
            <ProtectRoute>
                <UpdateUserPage />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.SettingPage.path,
        element: (
            <ProtectRoute>
                <SettingPage />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.RecruitmentPlanList.path,
        element: (
            <ProtectRoute>
                <RecruitmentPlanList />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.RecruitmentPlanCreate.path,
        element: (
            <ProtectRoute>
                <RecruitmentPlanCreate />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.RecruitmentJobList.path,
        element: (
            <ProtectRoute>
                <RecruitmentJobList />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.CVList.path,
        element: (
            <ProtectRoute>
                <CVList />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.CVDetail.path,
        element: (
            <ProtectRoute>
                <CVDetail />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.InterviewSchedule.path,
        element: (
            <ProtectRoute>
                <InterviewSchedule />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.OnboardingList.path,
        element: (
            <ProtectRoute>
                <OnboardingList />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.InternList.path,
        element: (
            <ProtectRoute>
                <InternList />
            </ProtectRoute>
        )
    },

    {
        path: RouteConfig.MentorRequestList.path,
        element: (
            <ProtectRoute>
                <MentorRequestList />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.MentorLearningPath.path,
        element: (
            <ProtectRoute>
                <MentorLearningPath />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.MentorEvalPhase1.path,
        element: (
            <ProtectRoute>
                <MentorEvalPhase1 />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.MentorTaskManagement.path,
        element: (
            <ProtectRoute>
                <MentorTaskManagement />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.MentorEvalPhase2.path,
        element: (
            <ProtectRoute>
                <MentorEvalPhase2 />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.MentorEvalFinal.path,
        element: (
            <ProtectRoute>
                <MentorEvalFinal />
            </ProtectRoute>
        )
    },

    {
        path: RouteConfig.InternDashboard.path,
        element: (
            <ProtectRoute>
                <InternDashboard />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.InternTest.path,
        element: (
            <ProtectRoute>
                <InternTest />
            </ProtectRoute>
        )
    },
    {
        path: RouteConfig.InternTaskBoard.path,
        element: (
            <ProtectRoute>
                <InternTaskBoard />
            </ProtectRoute>
        )
    },

    {
        path: RouteConfig.DirectorApprovals.path,
        element: (
            <ProtectRoute>
                <DirectorApprovals />
            </ProtectRoute>
        )
    }
];

export const App: FC = () => {
    return (
        <ConfigProvider theme={themeConfig}>
            <AntApp>
                <NotificationProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path='/' element={<RootLayout />}>
                                    <Route path={RouteConfig.PublicJobBoard.path} element={<JobBoardPage />} />
                                    <Route path={RouteConfig.PublicJobDetail.path} element={<JobDetailPage />} />

                                    <Route element={<AuthLayout />}>
                                        <Route path={RouteConfig.LoginPage.path} element={<LoginPage />} />
                                        <Route path={RouteConfig.Logout.path} element={<FormLogout />} />
                                    </Route>

                                    <Route element={<DashboardLayout />}>
                                        <Route path={RouteConfig.ProfilePage.path} element={<ProfilePage />} />
                                        {dashboardRoutes.map((route) => (
                                            <Route key={route.path} path={route.path} element={route.element} />
                                        ))}
                                    </Route>

                                    <Route path={RouteConfig.InternalErrorPage.path} element={<InternalErrorPage />} />
                                    <Route path={RouteConfig.ForbiddenPage.path} element={<ForbiddenPage />} />
                                    <Route path={RouteConfig.NotFoundPage.path} element={<NotFoundPage />} />
                                    <Route path='*' element={<NotFoundPage />} />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </AuthProvider>
                </NotificationProvider>
            </AntApp>
        </ConfigProvider>
    );
};
