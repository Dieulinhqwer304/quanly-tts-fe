import { TeamOutlined, UserOutlined, ArrowUpOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Card, Col, Row, Typography, Button, Dropdown } from 'antd';

const { Title, Text } = Typography;

const StatCard = ({ title, value, prefix, color, trend }: any) => (
    <Card
        bordered={false}
        style={{ height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)' }}
        bodyStyle={{ padding: '24px' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <Text type='secondary' style={{ fontSize: '14px', fontWeight: 500 }}>
                    {title}
                </Text>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937' }}>{value}</span>
                    {trend && (
                        <span
                            style={{
                                fontSize: '12px',
                                color: trend > 0 ? '#10b981' : '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: trend > 0 ? '#ecfdf5' : '#fef2f2',
                                padding: '2px 6px',
                                borderRadius: '999px',
                                fontWeight: 600
                            }}
                        >
                            {trend > 0 && <ArrowUpOutlined style={{ marginRight: '4px' }} />}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
            </div>
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${color}66`
                }}
            >
                <span style={{ fontSize: '20px', color: '#fff' }}>{prefix}</span>
            </div>
        </div>
        <div style={{ marginTop: '16px' }}>
            <Text type='secondary' style={{ fontSize: '12px' }}>
                Compared to last month
            </Text>
        </div>
    </Card>
);

export const DashboardPage = () => {
    return (
        <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
            <div
                style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <div>
                    <Title level={2} style={{ marginBottom: '4px', marginTop: 0 }}>
                        Tổng quan hệ thống
                    </Title>
                    <Text type='secondary'>Welcome back, Admin! Here's what's happening today.</Text>
                </div>
                <Button type='primary'>Download Report</Button>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard
                        title='Tổng người dùng'
                        value='1,234'
                        prefix={<UserOutlined />}
                        color='#6366f1'
                        trend={12.5}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard
                        title='Người dùng hoạt động'
                        value='845'
                        prefix={<TeamOutlined />}
                        color='#10b981'
                        trend={8.2}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard
                        title='Lượt truy cập hôm nay'
                        value='5,678'
                        prefix={<EyeOutlined />}
                        color='#f59e0b'
                        trend={-2.4}
                    />
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title='Welcome to Base Admin Dashboard'
                        bordered={false}
                        extra={
                            <Dropdown menu={{ items: [{ key: '1', label: 'Action 1' }] }}>
                                <Button type='text' icon={<MoreOutlined />} />
                            </Dropdown>
                        }
                        style={{ height: '100%', minHeight: '400px' }}
                    >
                        <div style={{ padding: '24px 0' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                    Đây là base dự án Admin Dashboard được xây dựng với công nghệ hiện đại nhất:
                                </Text>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '16px'
                                }}
                            >
                                {[
                                    'React 19 + TypeScript',
                                    'Vite',
                                    'Ant Design 5',
                                    'Tailwind CSS 4',
                                    'React Query',
                                    'React Router v7'
                                ].map((tech) => (
                                    <div
                                        key={tech}
                                        style={{
                                            padding: '16px',
                                            background: '#f9fafb',
                                            borderRadius: '8px',
                                            border: '1px solid #f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#6366f1'
                                            }}
                                        ></div>
                                        <Text strong>{tech}</Text>
                                    </div>
                                ))}
                            </div>

                            <div
                                style={{
                                    marginTop: '32px',
                                    padding: '20px',
                                    background: '#eef2ff',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e7ff'
                                }}
                            >
                                <Text strong style={{ color: '#4338ca', display: 'block', marginBottom: '8px' }}>
                                    Module mẫu CRUD hiện có:
                                </Text>
                                <Text>
                                    Quản lý người dùng (User Management) - Đầy đủ tính năng Xem, Thêm, Sửa, Xóa với Mock
                                    Data.
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title='Hoạt động gần đây' bordered={false} style={{ height: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#6b7280'
                                        }}
                                    >
                                        U{item}
                                    </div>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>
                                            User #{item} updated profile
                                        </Text>
                                        <Text type='secondary' style={{ fontSize: '12px' }}>
                                            2 hours ago
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
