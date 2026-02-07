import {
    EnvironmentOutlined,
    SearchOutlined,
    GlobalOutlined,
    ArrowRightOutlined,
    DollarOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Input,
    Layout,
    Row,
    Space,
    Tag,
    Typography,
    Skeleton,
    Empty,
    Select
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useJobPositions } from '../../../hooks/Recruitment/useJobPositions';
import { RouteConfig } from '../../../constants';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export const JobBoardPage = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    const { data: jobPositionsData, isLoading } = useJobPositions({
        searcher: searchText ? { keyword: searchText, field: 'title' } : undefined,
        status: 'Open' // Only show open positions on public job board
    });

    const jobs = jobPositionsData?.data?.hits || [];

    return (
        <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <Header
                style={{
                    background: '#fff',
                    padding: '0 50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    height: '72px'
                }}
            >
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    <div style={{
                        width: 36,
                        height: 36,
                        background: '#136dec',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                    }}>
                        <GlobalOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <Title level={4} style={{ margin: 0, color: '#1e293b' }}>TTS-Learning</Title>
                </div>
                <Space size="large">
                    <Button type="text" style={{ fontWeight: 500 }}>Về chúng tôi</Button>
                    <Button type="text" style={{ fontWeight: 500 }}>Hướng dẫn</Button>
                    <Button type="primary" onClick={() => navigate('/login')}>Đăng nhập</Button>
                </Space>
            </Header>

            <Content style={{ paddingBottom: '60px' }}>
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #136dec 0%, #0a4da2 100%)',
                    padding: '80px 24px',
                    textAlign: 'center',
                    color: '#fff'
                }}>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        <Title level={1} style={{ color: '#fff', fontSize: '42px', fontWeight: 800, marginBottom: '16px' }}>
                            Khởi đầu sự nghiệp của bạn tại đây
                        </Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '40px' }}>
                            Khám phá hàng loạt cơ hội thực tập và học tập tại các doanh nghiệp hàng đầu.
                        </Paragraph>

                        <Card bordered={false} style={{
                            maxWidth: 700,
                            margin: '0 auto',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                            padding: '4px'
                        }}>
                            <Input
                                placeholder="Tìm kiếm vị trí, ngôn ngữ, hoặc kỹ năng..."
                                prefix={<SearchOutlined style={{ color: '#94a3b8', fontSize: '20px' }} />}
                                size="large"
                                style={{ border: 'none', borderRadius: '12px' }}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={(e: any) => setSearchText(e.target.value)}
                            />
                        </Card>
                    </div>
                </div>

                {/* Jobs Grid */}
                <div style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <Title level={3} style={{ margin: 0 }}>Vị trí đang tuyển ({jobs.length})</Title>
                        <Space>
                            <Text type="secondary">Sắp xếp theo:</Text>
                            <Select defaultValue="newest" style={{ width: 140 }} bordered={false} options={[
                                { value: 'newest', label: 'Mới nhất' },
                                { value: 'salary', label: 'Lương cao' }
                            ]} />
                        </Space>
                    </div>

                    {isLoading ? (
                        <Row gutter={[24, 24]}>
                            {[1, 2, 3, 4].map(i => (
                                <Col xs={24} md={12} key={i}>
                                    <Card style={{ borderRadius: '16px' }}><Skeleton active /></Card>
                                </Col>
                            ))}
                        </Row>
                    ) : jobs.length > 0 ? (
                        <Row gutter={[24, 24]}>
                            {jobs.map((job) => (
                                <Col xs={24} md={12} key={job.id}>
                                    <Card
                                        hoverable
                                        style={{
                                            borderRadius: '20px',
                                            border: '1px solid #e2e8f0',
                                            height: '100%',
                                            transition: 'all 0.3s'
                                        }}
                                        bodyStyle={{ padding: '28px' }}
                                        onClick={() => navigate(RouteConfig.PublicJobDetail.getPath(job.id))}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <Tag color="blue" style={{ borderRadius: '6px', fontWeight: 600 }}>{job.department}</Tag>
                                            <Text type="secondary" style={{ fontSize: '13px' }}>Đăng ngày {job.postedDate}</Text>
                                        </div>

                                        <Title level={4} style={{ marginBottom: '12px', color: '#1e293b' }}>{job.title}</Title>

                                        <Space wrap style={{ marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#f1f5f9', borderRadius: '6px', fontSize: '13px' }}>
                                                <EnvironmentOutlined /> {job.location}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#f1f5f9', borderRadius: '6px', fontSize: '13px' }}>
                                                <DollarOutlined /> {job.salary}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#f1f5f9', borderRadius: '6px', fontSize: '13px' }}>
                                                <FieldTimeOutlined /> {job.level}
                                            </div>
                                        </Space>

                                        <Paragraph
                                            ellipsis={{ rows: 2 }}
                                            type="secondary"
                                            style={{ marginBottom: '24px', fontSize: '14px', lineHeight: 1.6 }}
                                        >
                                            {job.description}
                                        </Paragraph>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                                            <Text style={{ color: '#6366f1', fontWeight: 600 }}>
                                                {job.filled} / {job.required} suất đã nhận
                                            </Text>
                                            <Button type="primary" shape="round" icon={<ArrowRightOutlined />}>
                                                Chi tiết
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty description="Không tìm thấy vị trí tuyển dụng phù hợp" />
                    )}
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #f1f5f9', padding: '40px 0' }}>
                <div style={{ marginBottom: '16px' }}>
                    <Title level={4} style={{ margin: 0 }}>TTS-Learning</Title>
                    <Text type="secondary">Nền tảng kết nối đào tạo thực tập sinh hàng đầu</Text>
                </div>
                <Text type="secondary">©2025 Created by InternFlow Team</Text>
            </Footer>
        </Layout>
    );
};
