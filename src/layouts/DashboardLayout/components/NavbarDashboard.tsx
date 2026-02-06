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
            key: 'recruitment',
            icon: <TeamOutlined />,
            label: 'Tuyển dụng (HR)',
            children: [
                {
                    key: 'rec-plans',
                    label: 'Kế hoạch tuyển dụng',
                    onClick: () => navigate(RouteConfig.RecruitmentPlanList.path)
                },
                {
                    key: 'rec-jobs',
                    label: 'Tin tuyển dụng',
                    onClick: () => navigate(RouteConfig.RecruitmentJobList.path)
                },
                { key: 'rec-cvs', label: 'Quản lý CV', onClick: () => navigate(RouteConfig.CVList.path) },
                {
                    key: 'rec-interviews',
                    label: 'Lịch phỏng vấn',
                    onClick: () => navigate(RouteConfig.InterviewSchedule.path)
                },
                {
                    key: 'rec-onboarding',
                    label: 'Onboarding',
                    onClick: () => navigate(RouteConfig.OnboardingList.path)
                },
                { key: 'rec-interns', label: 'Danh sách TTS', onClick: () => navigate(RouteConfig.InternList.path) }
            ]
        },
        {
            key: 'mentor',
            icon: <SolutionOutlined />,
            label: 'Mentor Portal',
            children: [
                {
                    key: 'mentor-req',
                    label: 'Đề xuất tuyển dụng',
                    onClick: () => navigate(RouteConfig.MentorRequestList.path)
                },
                {
                    key: 'mentor-path',
                    label: 'Lộ trình đào tạo',
                    onClick: () => navigate(RouteConfig.MentorLearningPath.path)
                },
                {
                    key: 'mentor-eval1',
                    label: 'Đánh giá GĐ1',
                    onClick: () => navigate(RouteConfig.MentorEvalPhase1.path)
                },
                {
                    key: 'mentor-tasks',
                    label: 'Quản lý Task',
                    onClick: () => navigate(RouteConfig.MentorTaskManagement.path)
                },
                {
                    key: 'mentor-eval2',
                    label: 'Đánh giá GĐ2',
                    onClick: () => navigate(RouteConfig.MentorEvalPhase2.path)
                },
                {
                    key: 'mentor-final',
                    label: 'Đánh giá cuối kỳ',
                    onClick: () => navigate(RouteConfig.MentorEvalFinal.path)
                }
            ]
        },
        {
            key: 'intern',
            icon: <BookOutlined />,
            label: 'Intern Portal',
            children: [
                { key: 'intern-dash', label: 'Góc học tập', onClick: () => navigate(RouteConfig.InternDashboard.path) },
                { key: 'intern-test', label: 'Bài kiểm tra', onClick: () => navigate(RouteConfig.InternTest.path) },
                { key: 'intern-tasks', label: 'Task Board', onClick: () => navigate(RouteConfig.InternTaskBoard.path) },
                { key: 'intern-reports', label: 'Báo cáo', onClick: () => navigate(RouteConfig.InternReports.path) },
                { key: 'intern-cert', label: 'Chứng chỉ', onClick: () => navigate(RouteConfig.InternCertificate.path) }
            ]
        },
        {
            key: 'director',
            icon: <FileProtectOutlined />,
            label: 'Director Portal',
            children: [
                {
                    key: 'dir-approvals',
                    label: 'Phê duyệt kế hoạch',
                    onClick: () => navigate(RouteConfig.DirectorApprovals.path)
                }
            ]
        },
        {
            key: 'public',
            icon: <RocketOutlined />,
            label: 'Public Pages',
            children: [
                { key: 'pub-jobs', label: 'Job Board', onClick: () => navigate(RouteConfig.PublicJobBoard.path) }
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
