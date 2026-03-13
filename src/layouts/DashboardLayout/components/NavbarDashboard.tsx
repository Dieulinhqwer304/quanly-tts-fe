import { Layout, Menu, Avatar, Typography, theme, Button, Drawer } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    LogoutOutlined,
    TeamOutlined,
    SolutionOutlined,
    BookOutlined,
    FileProtectOutlined,
    RocketOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../../components';
import { getProfile } from '../../../services/auth/profile';

const { Sider } = Layout;
const { Text } = Typography;

type ModuleType = 'recruitment' | 'training' | 'admin' | 'director' | 'none';

interface NavbarDashboardProps {
    collapsed: boolean;
    isMobile: boolean;
    isLaptop: boolean;
    mobileOpen: boolean;
    onMobileClose: () => void;
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

export const NavbarDashboard = ({ collapsed, isMobile, isLaptop, mobileOpen, onMobileClose }: NavbarDashboardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { token } = theme.useToken();
    const { t } = useTranslation();
    const [currentRoles, setCurrentRoles] = useState<string[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            try {
                const response = await getProfile();
                const roles = (response.data?.roles || [])
                    .map((role) => String(role?.name || '').toLowerCase())
                    .filter(Boolean);

                if (isMounted) {
                    setCurrentRoles(roles);
                }
            } catch {
                if (isMounted) {
                    setCurrentRoles([]);
                }
            }
        };

        void loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const getCurrentModule = (): ModuleType => {
        const path = location.pathname;
        if (path.startsWith('/recruitment')) return 'recruitment';
        if (path.startsWith('/training')) return 'training';
        if (path.startsWith('/director')) return 'director';
        if (path.startsWith('/admin')) return 'admin';
        return 'none';
    };

    const currentModule = getCurrentModule();
    const isIntern = currentRoles.includes('intern');

    const recruitmentItems: MenuItem[] = [
        {
            key: 'rec-dashboard',
            icon: <DashboardOutlined />,
            label: t('menu.dashboard'),
            onClick: () => navigate(RouteConfig.RecruitmentDashboard.path)
        },
        {
            key: 'rec-plans',
            icon: <FileProtectOutlined />,
            label: t('menu.recruitment_plans'),
            onClick: () => navigate(RouteConfig.RecruitmentPlanList.path)
        },
        {
            key: 'rec-jobs',
            icon: <RocketOutlined />,
            label: t('menu.recruitment_jobs'),
            onClick: () => navigate(RouteConfig.RecruitmentJobList.path)
        },
        {
            key: 'rec-cvs',
            icon: <SolutionOutlined />,
            label: t('menu.cv_management'),
            onClick: () => navigate(RouteConfig.CVList.path)
        },
        {
            key: 'rec-interviews',
            icon: <TeamOutlined />,
            label: t('menu.interviews'),
            onClick: () => navigate(RouteConfig.InterviewSchedule.path)
        },
        {
            key: 'rec-interns',
            icon: <UserOutlined />,
            label: t('menu.intern_list'),
            onClick: () => navigate(RouteConfig.InternList.path)
        }
    ];

    const trainingItems: MenuItem[] = [
        {
            key: 'mentor',
            icon: <SolutionOutlined />,
            label: t('menu.mentor_portal'),
            children: [
                {
                    key: 'train-interns',
                    label: t('menu.intern_list'),
                    onClick: () => navigate(RouteConfig.TrainingInternList.path)
                },
                {
                    key: 'mentor-path',
                    label: t('menu.learning_path'),
                    onClick: () => navigate(RouteConfig.MentorLearningPath.path)
                },
                {
                    key: 'mentor-eval',
                    label: t('menu.evaluations'),
                    onClick: () => navigate(RouteConfig.MentorInternList.path)
                },
                {
                    key: 'mentor-tasks',
                    label: t('menu.task_management'),
                    onClick: () => navigate(RouteConfig.MentorTaskManagement.path)
                }
            ]
        },
        ...(isIntern
            ? [
                  {
                      key: 'intern',
                      icon: <BookOutlined />,
                      label: t('menu.intern_portal'),
                      children: [
                          {
                              key: 'intern-dash',
                              label: 'Bài giảng',
                              onClick: () => navigate(RouteConfig.InternDashboard.path)
                          },
                          {
                              key: 'intern-tasks',
                              label: t('menu.task_board'),
                              onClick: () => navigate(RouteConfig.InternTaskBoard.path)
                          }
                      ]
                  }
              ]
            : [])
    ];

    const directorItems: MenuItem[] = [
        {
            key: 'director',
            icon: <FileProtectOutlined />,
            label: t('menu.director_portal'),
            children: [
                {
                    key: 'dir-approvals',
                    label: t('menu.plan_approvals'),
                    onClick: () => navigate(RouteConfig.DirectorApprovals.path)
                }
            ]
        }
    ];

    const adminItems: MenuItem[] = [
        {
            key: 'user-management',
            icon: <UserOutlined />,
            label: 'Quản lý người dùng',
            onClick: () => navigate(RouteConfig.UserManagement.path)
        }
    ];

    const getMenuItems = (): MenuItem[] => {
        switch (currentModule) {
            case 'recruitment':
                return recruitmentItems;
            case 'training':
                return trainingItems;
            case 'director':
                return directorItems;
            case 'admin':
                return adminItems;
            default:
                return [
                    {
                        key: 'dashboard',
                        icon: <DashboardOutlined />,
                        label: t('menu.dashboard'),
                        onClick: () => navigate(RouteConfig.ModuleSelection.path)
                    }
                ];
        }
    };

    const getSelectedKeys = (): string[] => {
        const path = location.pathname;
        if (path.includes('/recruitment/dashboard')) return ['rec-dashboard'];
        if (path.includes('/recruitment/plans')) return ['rec-plans'];
        if (path.includes('/recruitment/jobs')) return ['rec-jobs'];
        if (path.includes('/recruitment/cvs')) return ['rec-cvs'];
        if (path.includes('/recruitment/interviews')) return ['rec-interviews'];
        if (path.includes('/recruitment/onboarding')) return ['rec-onboarding'];
        if (path.includes('/recruitment/interns')) return ['rec-interns'];

        if (path.includes('/training/interns')) return ['train-interns'];
        if (path.includes('/training/mentor/learning-paths')) return ['mentor', 'mentor-path'];
        if (path.includes('/training/mentor/interns')) return ['mentor', 'mentor-eval'];
        if (path.includes('/training/mentor/evaluations')) return ['mentor', 'mentor-eval'];
        if (path.includes('/training/mentor/tasks')) return ['mentor', 'mentor-tasks'];

        if (isIntern && path.includes('/training/intern/dashboard')) return ['intern', 'intern-dash'];
        if (isIntern && path.includes('/training/intern/test')) return ['intern', 'intern-dash'];
        if (isIntern && path.includes('/training/intern/tasks')) return ['intern', 'intern-tasks'];

        if (path.includes('/director/approvals')) return ['director', 'dir-approvals'];
        if (path.includes('/admin/users')) return ['user-management'];

        return ['dashboard'];
    };

    const siderWidth = isLaptop ? 240 : 260;

    const sideContent = (
        <>
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
                        background: `linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)`,
                        borderRadius: '8px',
                        marginRight: collapsed ? 0 : '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        flexShrink: 0,
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate(RouteConfig.ModuleSelection.path)}
                >
                    {currentModule === 'recruitment'
                        ? 'T'
                        : currentModule === 'training'
                          ? 'Đ'
                          : currentModule === 'director'
                            ? 'G'
                            : currentModule === 'admin'
                              ? 'Q'
                              : 'A'}
                </div>
                {!collapsed && (
                    <span
                        style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', cursor: 'pointer' }}
                        onClick={() => navigate(RouteConfig.ModuleSelection.path)}
                    >
                        {currentModule === 'recruitment'
                            ? 'Tuyển dụng'
                            : currentModule === 'training'
                              ? 'Đào tạo'
                              : currentModule === 'director'
                                ? 'Giám đốc'
                                : currentModule === 'admin'
                                  ? 'Quản trị'
                                  : 'Admin'}
                    </span>
                )}
                <div style={{ marginLeft: 'auto', paddingRight: collapsed ? 0 : '12px' }}>
                    <LanguageSwitcher />
                </div>
            </div>

            <div style={{ padding: collapsed ? '12px 8px' : '16px 12px' }}>
                <Button
                    type='default'
                    block={!collapsed}
                    icon={<DashboardOutlined />}
                    onClick={() => navigate(RouteConfig.ModuleSelection.path)}
                    style={{
                        borderRadius: '8px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        border: '1px dashed #E2E8F0'
                    }}
                >
                    {!collapsed && 'Đổi phân hệ'}
                </Button>
            </div>

            <div style={{ height: 'calc(100vh - 64px - 70px - 72px)', overflowY: 'auto' }}>
                <Menu
                    theme='light'
                    mode='inline'
                    selectedKeys={getSelectedKeys()}
                    defaultOpenKeys={['mentor', 'intern', 'director']}
                    items={getMenuItems()}
                    style={{
                        borderRight: 0,
                        fontSize: isLaptop ? '14px' : '15px',
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
                    background: '#F8FAFC'
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
                                Quản trị viên
                            </Text>
                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                admin@example.com
                            </Text>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <Button type='text' icon={<LogoutOutlined />} onClick={logout} style={{ color: '#64748B' }} />
                )}
            </div>
        </>
    );

    if (isMobile) {
        return (
            <Drawer
                open={mobileOpen}
                onClose={onMobileClose}
                width={280}
                placement='left'
                title={null}
                styles={{ body: { padding: 0 } }}
                closable={false}
            >
                {sideContent}
            </Drawer>
        );
    }

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
            width={siderWidth}
            theme='light'
        >
            {sideContent}
        </Sider>
    );
};

export default NavbarDashboard;
