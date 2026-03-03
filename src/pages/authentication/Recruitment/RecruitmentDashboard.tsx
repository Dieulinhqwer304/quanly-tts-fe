import {
    TeamOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    ArrowUpOutlined,
    MoreOutlined,
    CalendarOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Typography, Button, Dropdown, Space, Avatar, Tag, Progress } from 'antd';
import { http } from '../../../utils/http';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../../../hooks/useResponsive';
import { useEffect, useState } from 'react';

const { Title, Text, Paragraph } = Typography;

const StatCard = ({ title, value, prefix, color, subValue, loading }: any) => (
    <Card
        bordered={false}
        loading={loading}
        style={{
            height: '100%',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f0f0f0'
        }}
        bodyStyle={{ padding: '24px' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <Text type='secondary' style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>
                    {title}
                </Text>
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>{value}</span>
                    {subValue && (
                        <span
                            style={{
                                fontSize: '13px',
                                color: '#10b981',
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 600
                            }}
                        >
                            <ArrowUpOutlined style={{ marginRight: '4px' }} />
                            {subValue}%
                        </span>
                    )}
                </div>
            </div>
            <div
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    fontSize: '24px'
                }}
            >
                {prefix}
            </div>
        </div>
    </Card>
);

export const RecruitmentDashboard = () => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [statsRes, setStatsRes] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            try {
                const res = await http.get('/dashboard/stats');
                setStatsRes(res);
            } catch (error) {
                console.error(error);
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = statsRes?.data;

    const recentInterviews = [
        { id: 1, name: 'Nguyễn Văn Nam', time: '09:00 - 10:00', type: 'Technical Round 1', status: 'Upcoming' },
        { id: 2, name: 'Trần Thị Bình', time: '14:30 - 15:30', type: 'HR Interview', status: 'Scheduled' },
        { id: 3, name: 'Hoàng Thu Hà', time: '11:00 - 12:00', type: 'Final Review', status: 'Ongoing' }
    ];

    return (
        <div style={{ padding: isMobile ? '16px' : '24px', maxWidth: '1600px', margin: '0 auto' }}>
            <div
                style={{
                    marginBottom: '32px',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: '16px'
                }}
            >
                <div>
                    <Title level={2} style={{ marginBottom: '4px', marginTop: 0, fontWeight: 800 }}>
                        Recruitment Dashboard
                    </Title>
                    <Text type='secondary' style={{ fontSize: '16px' }}>
                        Chào mừng trở lại! Dưới đây là tóm tắt tình hình tuyển dụng Trainee hôm nay.
                    </Text>
                </div>
                <Space>
                    <Button icon={<CalendarOutlined />}>Lịch trình</Button>
                    <Button type='primary' style={{ background: '#6366f1', height: '40px', borderRadius: '8px' }}>
                        Tạo kế hoạch mới
                    </Button>
                </Space>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard
                        title='Số vị trí đang tuyển'
                        value={stats?.openPositions || '0'}
                        prefix={<TeamOutlined />}
                        color='#6366f1'
                        subValue={12}
                        loading={statsLoading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard
                        title='Tổng số hồ sơ ứng viên'
                        value={stats?.pendingApplications ? stats.pendingApplications + 120 : '145'}
                        prefix={<FileTextOutlined />}
                        color='#10b981'
                        subValue={8}
                        loading={statsLoading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard
                        title='Hồ sơ chờ duyệt'
                        value={stats?.pendingReviews || '10'}
                        prefix={<ClockCircleOutlined />}
                        color='#f59e0b'
                        subValue={5}
                        loading={statsLoading}
                    />
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title={<span style={{ fontWeight: 700 }}>Tiến độ tuyển dụng theo phòng ban</span>}
                        bordered={false}
                        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
                        extra={<Button type='text' icon={<MoreOutlined />} />}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' }}>
                            {[
                                { dept: 'Engineering', filled: 12, target: 20, color: '#6366f1' },
                                { dept: 'Product', filled: 8, target: 10, color: '#10b981' },
                                { dept: 'Design', filled: 4, target: 5, color: '#f59e0b' },
                                { dept: 'Marketing', filled: 2, target: 8, color: '#ec4899' }
                            ].map((item) => (
                                <div key={item.dept}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        <Text strong>{item.dept}</Text>
                                        <Text type='secondary'>
                                            {item.filled} / {item.target} positions
                                        </Text>
                                    </div>
                                    <Progress
                                        percent={Math.round((item.filled / item.target) * 100)}
                                        strokeColor={item.color}
                                        strokeWidth={10}
                                        showInfo={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card
                        title={<span style={{ fontWeight: 700 }}>Lịch phỏng vấn sắp tới</span>}
                        bordered={false}
                        style={{ height: '100%', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {recentInterviews.map((interview) => (
                                <div
                                    key={interview.id}
                                    style={{
                                        display: 'flex',
                                        gap: '16px',
                                        padding: '12px',
                                        border: '1px solid #f9fafb',
                                        borderRadius: '12px',
                                        background: '#f9fafb'
                                    }}
                                >
                                    <Avatar size={40} style={{ background: '#6366f1' }}>
                                        {interview.name[0]}
                                    </Avatar>
                                    <div style={{ flex: 1 }}>
                                        <Text strong style={{ display: 'block' }}>
                                            {interview.name}
                                        </Text>
                                        <Text type='secondary' style={{ fontSize: '12px' }}>
                                            {interview.time} • {interview.type}
                                        </Text>
                                        <div style={{ marginTop: '4px' }}>
                                            <Tag color={interview.status === 'Ongoing' ? 'processing' : 'blue'}>
                                                {interview.status}
                                            </Tag>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button block type='dashed' style={{ height: '40px', borderRadius: '8px' }}>
                                Xem tất cả lịch hẹn
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card
                style={{
                    marginTop: '24px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    border: 'none'
                }}
                bodyStyle={{ padding: '32px' }}
            >
                <Row align='middle' gutter={24}>
                    <Col xs={24} md={16}>
                        <Title level={3} style={{ color: '#fff', marginBottom: '8px', marginTop: 0 }}>
                            Hệ thống tự động hóa tuyển dụng Trainee
                        </Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: 0 }}>
                            Sử dụng AI để sàng lọc hồ sơ và tự động gửi email mời phỏng vấn cho các ứng viên tiềm năng
                            nhất.
                        </Paragraph>
                    </Col>
                    <Col
                        xs={24}
                        md={8}
                        style={{ textAlign: isMobile ? 'left' : 'right', marginTop: isMobile ? '24px' : 0 }}
                    >
                        <Button size='large' style={{ borderRadius: '8px', fontWeight: 600, color: '#6366f1' }}>
                            Khám phá ngay
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};
