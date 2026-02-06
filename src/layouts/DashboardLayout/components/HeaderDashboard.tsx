import {
    LogoutOutlined,
    // Icon Antd
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, MenuProps, message, Modal, Space, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useAuth } from '../../../contexts/AuthContext';

const { Header } = Layout;
const { Text } = Typography;
interface HeaderDashboardProps {
    collapsed: boolean; // Trạng thái đóng/mở sidebar
    toggleCollapsed: () => void; // Hàm để đóng/mở sidebar
}

export const HeaderDashboard = ({ collapsed, toggleCollapsed }: HeaderDashboardProps) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Thông tin cá nhân',
            icon: <UserOutlined />,
            onClick: () => navigate(RouteConfig.ProfilePage.path)
        },
        {
            key: 'settings',
            label: 'Cài đặt',
            icon: <SettingOutlined />,
            onClick: () => navigate(RouteConfig.SettingPage.path)
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: () => setShowModal(true)
        }
    ];

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            // Gọi hàm logout từ context để xóa accessToken
            logout();
            message.success('Đăng xuất thành công!');
            navigate(RouteConfig.LoginPage.path);
        } catch (error) {
            message.error('Có lỗi xảy ra khi đăng xuất!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <Header style={styles.header}>
            {/* Bên trái header  */}
            <div style={styles.leftSection}>
                <Button // Nút toggle sidebar
                    type='text'
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={toggleCollapsed}
                    style={styles.triggerButton}
                />
            </div>
            {/* bên phải header  */}
            <div style={styles.rightSection}>
                <Dropdown
                    menu={{ items: userMenuItems as MenuProps['items'] }}
                    placement='bottomRight'
                    arrow
                    trigger={['click']}
                >
                    <Space style={styles.userInfo}>
                        <Avatar icon={<UserOutlined />} />
                        <span style={styles.userName}>Admin</span>
                    </Space>
                </Dropdown>
                <Modal
                    title={
                        <Space>
                            <QuestionCircleOutlined style={{ color: '#f59e0b' }} />
                            <span>Xác nhận đăng xuất</span>
                        </Space>
                    }
                    open={showModal}
                    onCancel={handleCancel}
                    footer={[
                        <Button key='cancel' onClick={handleCancel}>
                            Hủy
                        </Button>,
                        <Button
                            key='logout'
                            type='primary'
                            danger
                            loading={isLoading}
                            onClick={handleLogout}
                            icon={<LogoutOutlined />}
                        >
                            Đăng xuất
                        </Button>
                    ]}
                    centered
                    width={400}
                    style={{ borderRadius: '8px' }}
                >
                    <div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
                        <Text style={{ fontSize: '16px' }}>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?</Text>
                        <div
                            style={{
                                marginTop: '12px',
                                padding: '12px',
                                background: '#fef3c7',
                                borderRadius: '8px',
                                border: '1px solid #fde68a'
                            }}
                        >
                            <Text type='secondary' style={{ fontSize: '14px' }}>
                                💡 Sau khi đăng xuất, bạn sẽ cần đăng nhập lại để tiếp tục sử dụng hệ thống.
                            </Text>
                        </div>
                    </div>
                </Modal>
            </div>
        </Header>
    );
};

const styles = {
    header: {
        padding: 0,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        zIndex: 1,
        borderBottom: '1px solid #f0f0f0'
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center'
    },
    rightSection: {
        paddingRight: '24px'
    },
    triggerButton: {
        fontSize: '16px',
        width: 64,
        height: 64
    },
    searchInput: {
        width: '300px',
        marginLeft: '24px'
    },
    userInfo: {
        cursor: 'pointer'
    },
    userName: {
        marginLeft: '8px'
    }
} as const;
