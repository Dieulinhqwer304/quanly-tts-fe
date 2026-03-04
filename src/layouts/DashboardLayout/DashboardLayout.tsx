import { useState } from 'react';
import { Layout } from 'antd';
import { HeaderDashboard } from './components/HeaderDashboard';
import { NavbarDashboard } from './components/NavbarDashboard';
import { Outlet } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';

const { Content } = Layout;

export const DashboardLayout = () => {
    const { isMobile, isLaptop } = useResponsive();
    const sidebarExpandedWidth = isLaptop ? 240 : 260;
    const sidebarCollapsedWidth = isLaptop ? 72 : 80;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleCollapsed = () => {
        if (isMobile) {
            setMobileMenuOpen((prev) => !prev);
            return;
        }
        setCollapsed((prev) => !prev);
    };

    return (
        <Layout style={{ background: '#fff' }}>
            <Layout
                style={{
                    marginLeft: isMobile ? 0 : collapsed ? sidebarCollapsedWidth : sidebarExpandedWidth,
                    minHeight: '100vh',
                    transition: 'all 0.2s',
                    background: '#F8FAFC'
                }}
            >
                <HeaderDashboard
                    collapsed={collapsed}
                    toggleCollapsed={toggleCollapsed}
                    isMobile={isMobile}
                    isLaptop={isLaptop}
                />
                <Content
                    style={{
                        margin: isMobile ? '12px 8px' : '24px 16px',
                        padding: isMobile ? 12 : isLaptop ? 18 : 24,
                        background: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
            <NavbarDashboard
                collapsed={collapsed}
                isMobile={isMobile}
                isLaptop={isLaptop}
                mobileOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />
        </Layout>
    );
};
