import {
    BoldOutlined,
    ClockCircleOutlined,
    CodeOutlined,
    FileTextOutlined,
    ItalicOutlined,
    OrderedListOutlined,
    PlusOutlined,
    SaveOutlined,
    SearchOutlined,
    SettingOutlined,
    TeamOutlined,
    UnderlineOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Input, Layout, List, Row, Space, Tabs, Tag, Typography } from 'antd';
import { useState } from 'react';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Paragraph } = Typography;

export default function SettingPage() {
    const [activeTab, setActiveTab] = useState('1');

    return (
        <Layout style={{ minHeight: '100vh', background: '#f6f7f8' }}>
            <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <div style={{ marginBottom: '24px' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        Cấu hình hệ thống
                    </Title>
                    <Text type='secondary'>
                        Quản lý cài đặt toàn cục, mẫu giao tiếp và cơ cấu tổ chức.
                    </Text>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: '1',
                            label: (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileTextOutlined /> Mẫu email
                                </span>
                            ),
                            children: (
                                <Row gutter={24} style={{ height: '600px' }}>
                                    <Col xs={24} md={8} lg={6}>
                                        <Card
                                            bordered={false}
                                            style={{
                                                height: '100%',
                                                borderRadius: '12px',
                                                border: '1px solid #E2E8F0',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                            bodyStyle={{
                                                padding: 0,
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0' }}>
                                                <Input prefix={<SearchOutlined />} placeholder='Search templates...' />
                                            </div>
                                            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                                                <List
                                                    dataSource={[
                                                        {
                                                            id: 1,
                                                            title: 'Thư mời phỏng vấn',
                                                            subject: 'Chủ đề: Mời tham gia phỏng vấn tại [Tên công ty]',
                                                            color: 'green',
                                                            active: true
                                                        },
                                                        {
                                                            id: 2,
                                                            title: 'Thư chào mừng',
                                                            subject: 'Chủ đề: Đề nghị thực tập - Chào mừng!',
                                                            color: 'green',
                                                            active: false
                                                        },
                                                        {
                                                            id: 3,
                                                            title: 'Email từ chối',
                                                            subject: 'Chủ đề: Thông tin về đơn ứng tuyển của bạn',
                                                            color: 'default',
                                                            active: false
                                                        },
                                                        {
                                                            id: 4,
                                                            title: 'Hướng dẫn nhận việc',
                                                            subject: 'Chủ đề: Hướng dẫn ngày đầu và quyền truy cập',
                                                            color: 'default',
                                                            active: false
                                                        }
                                                    ]}
                                                    renderItem={(item) => (
                                                        <div
                                                            style={{
                                                                padding: '12px',
                                                                marginBottom: '8px',
                                                                borderRadius: '8px',
                                                                background: item.active ? '#e6f7ff' : 'transparent',
                                                                border: item.active
                                                                    ? '1px solid #1E40AF'
                                                                    : '1px solid transparent',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    marginBottom: '4px'
                                                                }}
                                                            >
                                                                <Text
                                                                    strong
                                                                    style={{
                                                                        color: item.active ? '#1E40AF' : '#1E293B'
                                                                    }}
                                                                >
                                                                    {item.title}
                                                                </Text>
                                                                <div
                                                                    style={{
                                                                        width: 8,
                                                                        height: 8,
                                                                        borderRadius: '50%',
                                                                        background:
                                                                            item.color === 'green'
                                                                                ? '#10B981'
                                                                                : '#E2E8F0'
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <Text
                                                                type='secondary'
                                                                style={{
                                                                    fontSize: '12px',
                                                                    display: 'block',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}
                                                            >
                                                                {item.subject}
                                                            </Text>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            <div style={{ padding: '12px', borderTop: '1px solid #E2E8F0' }}>
                                                <Button type='dashed' block icon={<PlusOutlined />}>
                                                    Mẫu mới
                                                </Button>
                                            </div>
                                        </Card>
                                    </Col>

                                    <Col xs={24} md={16} lg={18}>
                                        <Card
                                            bordered={false}
                                            style={{
                                                height: '100%',
                                                borderRadius: '12px',
                                                border: '1px solid #E2E8F0',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                            bodyStyle={{
                                                padding: 0,
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0' }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '16px'
                                                    }}
                                                >
                                                    <Title level={4} style={{ margin: 0 }}>
                                                        Chỉnh sửa mẫu
                                                    </Title>
                                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                                        <ClockCircleOutlined /> Chỉnh sửa lần cuối: Hôm nay, 10:23 SA
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Text
                                                        strong
                                                        style={{
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            color: '#64748B'
                                                        }}
                                                    >
                                                        Tiêu đề email
                                                    </Text>
                                                    <Input
                                                        defaultValue='Mời phỏng vấn - {{position_name}}'
                                                        style={{ marginTop: '8px' }}
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#fafafa',
                                                    borderBottom: '1px solid #E2E8F0',
                                                    display: 'flex',
                                                    gap: '8px',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Button type='text' icon={<BoldOutlined />} size='small' />
                                                <Button type='text' icon={<ItalicOutlined />} size='small' />
                                                <Button type='text' icon={<UnderlineOutlined />} size='small' />
                                                <Divider type='vertical' />
                                                <Button type='text' icon={<UnorderedListOutlined />} size='small' />
                                                <Button type='text' icon={<OrderedListOutlined />} size='small' />
                                                <Divider type='vertical' />
                                                <Button size='small' icon={<CodeOutlined />}>
                                                    Chèn biến
                                                </Button>
                                            </div>

                                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                                                <Paragraph>
                                                    Kính gửi <Tag>{'{candidate_name}'}</Tag>,
                                                </Paragraph>
                                                <Paragraph>
                                                    Cảm ơn bạn đã ứng tuyển vị trí <Tag>{'{position_name}'}</Tag>{' '}
                                                    tại InternshipOS. Chúng tôi ấn tượng với hồ sơ của bạn và muốn mời bạn tham gia phỏng vấn.
                                                </Paragraph>
                                                <Paragraph>
                                                    Buổi phỏng vấn sẽ do <Tag>{'{interviewer_name}'}</Tag>{' '}
                                                    thực hiện và dự kiến kéo dài khoảng 45 phút.
                                                </Paragraph>
                                                <Paragraph>
                                                    Vui lòng sử dụng đường dẫn sau để chọn thời gian phù hợp với bạn:{' '}
                                                    <a href='#'>Đặt lịch phỏng vấn</a>
                                                </Paragraph>
                                                <Paragraph>
                                                    Trân trọng,
                                                    <br />
                                                    Bộ phẫn Tuyển dụng
                                                </Paragraph>
                                            </div>

                                            <div
                                                style={{
                                                    padding: '16px 24px',
                                                    background: '#fcfcfd',
                                                    borderTop: '1px solid #E2E8F0',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Button>Gửi email thử</Button>
                                                <Space>
                                                    <Button>Hủy thay đổi</Button>
                                                    <Button type='primary' icon={<SaveOutlined />}>
                                                        Lưu mẫu
                                                    </Button>
                                                </Space>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            )
                        },
                        {
                            key: '2',
                            label: (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <SettingOutlined /> Phòng ban
                                </span>
                            ),
                            children: (
                                <div style={{ padding: '24px', textAlign: 'center', color: '#8c8c8c' }}>
                                    Nội dung cấu hình phòng ban
                                </div>
                            )
                        },
                        {
                            key: '3',
                            label: (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TeamOutlined /> Vai trò người dùng
                                </span>
                            ),
                            children: (
                                <div style={{ padding: '24px', textAlign: 'center', color: '#8c8c8c' }}>
                                    Nội dung quản lý vai trò người dùng
                                </div>
                            )
                        }
                    ]}
                />
            </Content>
        </Layout>
    );
}
