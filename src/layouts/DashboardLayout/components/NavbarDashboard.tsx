import { Layout, Menu } from 'antd';
import { DashboardOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { ReactNode } from 'react';

const { Sider } = Layout;

interface NavbarDashboardProps {
    collapsed: boolean;
}

interface MenuItem {
    key: string;
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    children?: SubMenuItem[];
}

interface SubMenuItem {
    key: string;
    label: string;
    path?: string;
    onClick: () => void;
}

const PATH_TO_KEYS_MAP: Record<string, string[]> = {
    [RouteConfig.DashBoardPage.path]: ['dashboard'],
    [RouteConfig.ListUserPage.path]: ['users', 'users-list'],
    [RouteConfig.ProfilePage.path]: ['profile'],
    [RouteConfig.SettingPage.path]: ['settings']
};

export const NavbarDashboard = ({ collapsed }: NavbarDashboardProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems: MenuItem[] = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Tổng quan',
            onClick: () => navigate(RouteConfig.DashBoardPage.path)
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: 'Quản lý ngườii dùng',
            children: [
                {
                    key: 'users-list',
                    label: 'Danh sách ngườii dùng',
                    onClick: () => navigate('/users')
                }
            ]
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
            onClick: () => navigate(RouteConfig.SettingPage.path)
        }
    ];

    const getSelectedKeys = (): string[] => {
        const path = location.pathname;

        if (path.match(/\/users\/[^/]+\/update$/)) {
            return ['users', 'users-list'];
        }

        return PATH_TO_KEYS_MAP[path] || ['dashboard'];
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
                ...styles.sider,
                background: '#fff'
            }}
            width={260}
            theme='light'
        >
            <div
                style={{
                    ...styles.logo,
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <img
                    src='/public/vite.svg'
                    alt='Logo'
                    style={{
                        height: '32px',
                        margin: collapsed ? '16px auto' : '16px 24px'
                    }}
                />
            </div>
            <Menu
                theme='light'
                mode='inline'
                selectedKeys={getSelectedKeys()}
                items={menuItems}
                style={{
                    ...styles.menu,
                    fontSize: '15px',
                    fontWeight: 400
                }}
            />
        </Sider>
    );
};

const styles = {
    sider: {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed' as const,
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    logo: {
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    menu: {
        borderRight: 0
    }
} as const;

export default NavbarDashboard;
