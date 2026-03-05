import { FC } from 'react';
import { Row, Col, Card, Typography, Space } from 'antd';
import { TeamOutlined, BookOutlined, SettingOutlined, RightOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';

const { Title, Text } = Typography;

interface ModuleCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}

const ModuleCard: FC<ModuleCardProps> = ({ title, description, icon, color, onClick }) => (
    <Card
        hoverable
        onClick={onClick}
        style={{
            height: '100%',
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            overflow: 'hidden'
        }}
        bodyStyle={{ padding: '32px' }}
        className='group'
    >
        <div
            style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: color,
                marginBottom: '24px'
            }}
        >
            {icon}
        </div>
        <Title level={3} style={{ marginBottom: '12px' }}>
            {title}
        </Title>
        <Text type='secondary' style={{ fontSize: '15px', display: 'block', marginBottom: '24px', minHeight: '44px' }}>
            {description}
        </Text>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                color: color,
                fontWeight: 600,
                fontSize: '16px'
            }}
        >
            <span>Truy cập hệ thống</span>
            <RightOutlined
                style={{ marginLeft: '8px', fontSize: '12px', transition: 'transform 0.3s' }}
                className='group-hover:translate-x-1'
            />
        </div>
    </Card>
);

export const ModuleSelectionPage: FC = () => {
    const navigate = useNavigate();

    const modules = [
        {
            title: 'Tuyển dụng',
            description: 'Quản lý kế hoạch, tin tuyển dụng, sàng lọc CV và lịch phỏng vấn ứng viên.',
            icon: <TeamOutlined />,
            color: '#1E40AF',
            path: RouteConfig.RecruitmentDashboard.path
        },
        {
            title: 'Đào tạo',
            description: 'Quản lý lộ trình học tập, giao task thực tế và đánh giá thực tập sinh.',
            icon: <BookOutlined />,
            color: '#0D9488',
            path: RouteConfig.InternDashboard.path
        },
        {
            title: 'Quản trị',
            description: 'Cấu hình hệ thống, phê duyệt ngân sách và quản lý định hướng nhân sự.',
            icon: <SettingOutlined />,
            color: '#F59E0B',
            path: RouteConfig.DirectorApprovals.path
        },
        {
            title: 'Trang tuyển dụng',
            description: 'Xem giao diện trang tin tuyển dụng công khai dành cho ứng viên.',
            icon: <GlobalOutlined />,
            color: '#10B981',
            path: RouteConfig.PublicJobBoard.path
        }
    ];

    return (
        <div
            style={{
                minHeight: 'calc(100vh - 120px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '40px 24px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >
            <div style={{ marginBottom: '64px', textAlign: 'center' }}>
                <Title level={1} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px' }}>
                    Chào mừng bạn quay lại!
                </Title>
                <Text type='secondary' style={{ fontSize: '18px' }}>
                    Vui lòng chọn phân hệ làm việc để bắt đầu.
                </Text>
            </div>

            <Row gutter={[32, 32]}>
                {modules.map((m) => (
                    <Col xs={24} md={12} lg={6} key={m.title}>
                        <ModuleCard {...m} onClick={() => navigate(m.path)} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};
