import { Navigate, Outlet } from 'react-router-dom';
import { RouteConfig } from '../../constants';
import Cookies from 'js-cookie';

export const AuthLayout = () => {
    const token = Cookies.get('accessToken');
    console.log('AuthLayout - Current accessToken:', token);

    if (token) {
        return <Navigate to={RouteConfig.DashBoardPage.path} />;
    }

    return <Outlet />;
};
