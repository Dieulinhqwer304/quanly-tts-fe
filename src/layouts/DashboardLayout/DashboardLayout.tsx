import { useState } from 'react';
import { Layout } from 'antd';
import { HeaderDashboard } from './components/HeaderDashboard';
import { NavbarDashboard } from './components/NavbarDashboard';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

export const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ background: '#fff' }}>
            <Layout
                style={{
                    marginLeft: collapsed ? 80 : 260,
                    minHeight: '100vh',
                    transition: 'all 0.2s',
                    background: '#f8f8f8'
                }}
            >
                <HeaderDashboard collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: '#fff',
                        borderRadius: '4px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
            <NavbarDashboard collapsed={collapsed} />
        </Layout>
    );
};
