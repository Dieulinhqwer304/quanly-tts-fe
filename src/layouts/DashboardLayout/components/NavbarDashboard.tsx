import { Layout, Menu, Avatar, Typography, theme, Button } from 'antd';
import { DashboardOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { ReactNode } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const { Sider } = Layout;
const { Text } = Typography;

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
    const { logout } = useAuth();
    const { token } = theme.useToken();

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
            label: 'Quản lý người dùng',
            children: [
                {
                    key: 'users-list',
                    label: 'Danh sách người dùng',
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
                background: '#fff',
                borderRight: '1px solid rgba(5, 5, 5, 0.06)',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1001
            }}
            width={260}
            theme='light'
        >
            <div
                style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '0' : '0 24px',
                    borderBottom: '1px solid rgba(5, 5, 5, 0.06)'
                }}
            >
                <div
                    style={{
                        width: '32px',
                        height: '32px',
                        background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #764ba2 100%)`,
                        borderRadius: '8px',
                        marginRight: collapsed ? 0 : '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        flexShrink: 0
                    }}
                >
                    A
                </div>
                {!collapsed && <span style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>Admin</span>}
            </div>

            <div style={{ height: 'calc(100vh - 64px - 70px)', overflowY: 'auto', paddingTop: '16px' }}>
                <Menu
                    theme='light'
                    mode='inline'
                    selectedKeys={getSelectedKeys()}
                    defaultOpenKeys={['users']}
                    items={menuItems}
                    style={{
                        borderRight: 0,
                        fontSize: '15px',
                        fontWeight: 500
                    }}
                />
            </div>

            <div
                style={{
                    height: '70px',
                    borderTop: '1px solid rgba(5, 5, 5, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: collapsed ? '0' : '0 16px',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    background: '#fafafa'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                    <Avatar style={{ backgroundColor: token.colorPrimary, flexShrink: 0 }} icon={<UserOutlined />} />
                    {!collapsed && (
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Text
                                strong
                                style={{
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                Admin User
                            </Text>
                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                admin@example.com
                            </Text>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <Button type='text' icon={<LogoutOutlined />} onClick={logout} style={{ color: '#6b7280' }} />
                )}
            </div>
        </Sider>
    );
};

export default NavbarDashboard;
