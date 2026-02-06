import { DashboardOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';

const { Title } = Typography;

export const DashboardPage = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={2} style={{ marginBottom: '24px' }}>
                Tổng quan hệ thống
            </Title>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={8}>
                    <Card>
                        <Statistic title='Tổng ngườii dùng' value={0} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title='Ngườii dùng hoạt động' value={0} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title='Lượt truy cập hôm nay' value={0} prefix={<DashboardOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title='Chào mừng đến với Base Admin Dashboard'>
                        <p>Đây là base dự án Admin Dashboard được xây dựng với:</p>
                        <ul>
                            <li>React 19 + TypeScript</li>
                            <li>Vite</li>
                            <li>Ant Design</li>
                            <li>Tailwind CSS</li>
                            <li>React Query</li>
                            <li>React Router v7</li>
                        </ul>
                        <p>Module mẫu CRUD: Quản lý ngườii dùng</p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
