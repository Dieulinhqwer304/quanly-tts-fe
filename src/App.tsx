import { FC } from 'react';
import { BrowserRouter, Route, RouteObject, Routes } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { RouteConfig } from './constants/RouteConfig';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './components/Notification/Notification';
import { AuthLayout } from './layouts/AuthLayout/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';
import RootLayout from './layouts/RootLayout/RootLayout';
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
import { ProtectRoute } from './components/ProtectRoute/ProtectRoute';

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
    }
];

import { ConfigProvider } from 'antd';
import { themeConfig } from './theme/themeConfig';

export const App: FC = () => {
    return (
        <ConfigProvider theme={themeConfig}>
            <AntApp>
                <NotificationProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path='/' element={<RootLayout />}>
                                    <Route element={<AuthLayout />}>
                                        <Route path={RouteConfig.LoginPage.path} element={<LoginPage />} />
                                        <Route path={RouteConfig.Logout.path} element={<FormLogout />} />
                                    </Route>

                                    <Route element={<DashboardLayout />}>
                                        <Route path={RouteConfig.ProfilePage.path} element={<ProfilePage />} />
                                        {dashboardRoutes.map((route) => {
                                            return <Route key={route.path} path={route.path} element={route.element} />;
                                        })}
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
