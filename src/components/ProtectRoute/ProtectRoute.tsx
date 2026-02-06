import { Navigate } from 'react-router-dom';
import { RouteConfig } from '../../constants';
import Cookies from 'js-cookie';
import { ReactNode } from 'react';

interface ProtectRouteProps {
    children: ReactNode;
}

export const ProtectRoute = ({ children }: ProtectRouteProps) => {
    const token = Cookies.get('accessToken');
    if (!token) {
        return <Navigate to={RouteConfig.LoginPage.path} />;
    }
    return <>{children}</>;
};
