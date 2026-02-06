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
    }
};
