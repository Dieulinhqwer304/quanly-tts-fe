import { Layout, Menu, Avatar, Typography, theme, Button } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    TeamOutlined,
    SolutionOutlined,
    BookOutlined,
    FileProtectOutlined,
    RocketOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { ReactNode } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../../components';

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

export const NavbarDashboard = ({ collapsed }: NavbarDashboardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { token } = theme.useToken();
    const { t } = useTranslation();

    const menuItems: MenuItem[] = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: t('menu.dashboard'),
            onClick: () => navigate(RouteConfig.DashBoardPage.path)
        },
        {
            key: 'recruitment',
            icon: <TeamOutlined />,
            label: t('menu.recruitment_management'),
            children: [
                {
                    key: 'rec-plans',
                    label: t('menu.recruitment_plans'),
                    onClick: () => navigate(RouteConfig.RecruitmentPlanList.path)
                },
                {
                    key: 'rec-jobs',
                    label: t('menu.recruitment_jobs'),
                    onClick: () => navigate(RouteConfig.RecruitmentJobList.path)
                },
                { key: 'rec-cvs', label: t('menu.cv_management'), onClick: () => navigate(RouteConfig.CVList.path) },
                {
                    key: 'rec-interviews',
                    label: t('menu.interviews'),
                    onClick: () => navigate(RouteConfig.InterviewSchedule.path)
                },
                {
                    key: 'rec-onboarding',
                    label: t('menu.onboarding'),
                    onClick: () => navigate(RouteConfig.OnboardingList.path)
                },
                { key: 'rec-interns', label: t('menu.intern_list'), onClick: () => navigate(RouteConfig.InternList.path) }
            ]
        },
        {
            key: 'mentor',
            icon: <SolutionOutlined />,
            label: t('menu.mentor_portal'),
            children: [
                {
                    key: 'mentor-req',
                    label: t('menu.recruitment_requests'),
                    onClick: () => navigate(RouteConfig.MentorRequestList.path)
                },
                {
                    key: 'mentor-path',
                    label: t('menu.learning_path'),
                    onClick: () => navigate(RouteConfig.MentorLearningPath.path)
                },
                {
                    key: 'mentor-eval1',
                    label: t('menu.eval_phase_1'),
                    onClick: () => navigate(RouteConfig.MentorEvalPhase1.path)
                },
                {
                    key: 'mentor-tasks',
                    label: t('menu.task_management'),
                    onClick: () => navigate(RouteConfig.MentorTaskManagement.path)
                },
                {
                    key: 'mentor-eval2',
                    label: t('menu.eval_phase_2'),
                    onClick: () => navigate(RouteConfig.MentorEvalPhase2.path)
                },
                {
                    key: 'mentor-final',
                    label: t('menu.final_eval'),
                    onClick: () => navigate(RouteConfig.MentorEvalFinal.path)
                }
            ]
        },
        {
            key: 'intern',
            icon: <BookOutlined />,
            label: t('menu.intern_portal'),
            children: [
                { key: 'intern-dash', label: t('menu.intern_dashboard'), onClick: () => navigate(RouteConfig.InternDashboard.path) },
                { key: 'intern-test', label: t('menu.knowledge_test'), onClick: () => navigate(RouteConfig.InternTest.path) },
                { key: 'intern-tasks', label: t('menu.task_board'), onClick: () => navigate(RouteConfig.InternTaskBoard.path) }
            ]
        },
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
        },
        {
            key: 'public',
            icon: <RocketOutlined />,
            label: t('menu.public_pages'),
            children: [
                { key: 'pub-jobs', label: t('menu.job_board'), onClick: () => navigate(RouteConfig.PublicJobBoard.path) }
            ]
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: t('menu.settings'),
            onClick: () => navigate(RouteConfig.SettingPage.path)
        }
    ];

    const getSelectedKeys = (): string[] => {
        const path = location.pathname;
        if (path.includes('/recruitment/plans')) return ['recruitment', 'rec-plans'];
        if (path.includes('/recruitment/jobs')) return ['recruitment', 'rec-jobs'];
        if (path.includes('/recruitment/cvs')) return ['recruitment', 'rec-cvs'];
        if (path.includes('/recruitment/interviews')) return ['recruitment', 'rec-interviews'];
        if (path.includes('/recruitment/onboarding')) return ['recruitment', 'rec-onboarding'];
        if (path.includes('/recruitment/interns')) return ['recruitment', 'rec-interns'];

        if (path.includes('/mentor/requests')) return ['mentor', 'mentor-req'];
        if (path.includes('/mentor/learning-paths')) return ['mentor', 'mentor-path'];
        if (path.includes('/mentor/eval-phase1')) return ['mentor', 'mentor-eval1'];
        if (path.includes('/mentor/tasks')) return ['mentor', 'mentor-tasks'];
        if (path.includes('/mentor/eval-phase2')) return ['mentor', 'mentor-eval2'];
        if (path.includes('/mentor/eval-final')) return ['mentor', 'mentor-final'];

        if (path.includes('/intern/dashboard')) return ['intern', 'intern-dash'];
        if (path.includes('/intern/test')) return ['intern', 'intern-test'];
        if (path.includes('/intern/tasks')) return ['intern', 'intern-tasks'];
        if (path.includes('/intern/reports')) return ['intern', 'intern-reports'];
        if (path.includes('/intern/certificate')) return ['intern', 'intern-cert'];

        if (path.includes('/director/approvals')) return ['director', 'dir-approvals'];

        if (path.includes('/jobs')) return ['public', 'pub-jobs'];

        if (path.match(/\/users\/[^/]+\/update$/)) return ['users', 'users-list'];
        if (path === '/users') return ['users', 'users-list'];

        if (path === '/setting') return ['settings'];

        return ['dashboard'];
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
                <div style={{ marginLeft: 'auto', paddingRight: collapsed ? 0 : '12px' }}>
                    <LanguageSwitcher />
                </div>
            </div>

            <div style={{ height: 'calc(100vh - 64px - 70px)', overflowY: 'auto', paddingTop: '16px' }}>
                <Menu
                    theme='light'
                    mode='inline'
                    selectedKeys={getSelectedKeys()}
                    defaultOpenKeys={['recruitment', 'mentor', 'intern', 'director']}
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
