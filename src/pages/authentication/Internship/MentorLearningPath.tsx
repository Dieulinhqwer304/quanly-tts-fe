import {
    DeleteOutlined,
    DragOutlined,
    EditOutlined,
    FilePdfOutlined,
    FileTextOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Input, Layout, Row, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

export const MentorLearningPath = () => {
    const { t } = useTranslation();
    const [selectedModule, setSelectedModule] = useState(1);

    const modules = [
        { id: 1, title: 'Company Culture', status: 'Ready', count: 2, active: true },
        { id: 2, title: 'Git & Version Control', status: 'Draft', count: 3, active: false },
        { id: 3, title: 'React Fundamentals', status: 'Empty', count: 0, active: false }
    ];

    const contentItems = [
        {
            id: 1,
            type: 'video',
            title: 'CEO Welcome Video',
            meta: 'External Link • 5 mins',
            icon: <VideoCameraOutlined />,
            color: 'red'
        },
        {
            id: 2,
            type: 'file',
            title: 'Employee Handbook 2024',
            meta: 'PDF Document • 2.4 MB',
            icon: <FilePdfOutlined />,
            color: 'blue'
        }
    ];

    return (
        <Layout style={{ height: 'calc(100vh - 64px)', background: '#f6f7f8' }}>
            <Sider width={320} theme='light' style={{ borderRight: '1px solid #e5e7eb', overflowY: 'auto' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <Text strong style={{ fontSize: '12px', textTransform: 'uppercase', color: '#6b7280' }}>
                            {t('learning_path.path_title')}
                        </Text>
                        <Input
                            defaultValue='Frontend Development Internship - Q3'
                            style={{ marginTop: '8px', fontWeight: 500 }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={5} style={{ margin: 0 }}>
                            {t('learning_path.modules')}
                        </Title>
                        <Button type='link' icon={<PlusOutlined />} size='small'>
                            {t('learning_path.add_module')}
                        </Button>
                    </div>
                </div>

                <div style={{ padding: '16px', background: '#f9fafb', minHeight: '100%' }}>
                    <Space direction='vertical' style={{ width: '100%' }}>
                        {modules.map((module) => (
                            <Card
                                key={module.id}
                                hoverable
                                style={{
                                    borderRadius: '8px',
                                    border: selectedModule === module.id ? '2px solid #136dec' : '1px solid #e5e7eb',
                                    borderLeft:
                                        selectedModule === module.id ? '2px solid #136dec' : '4px solid transparent',
                                    cursor: 'pointer'
                                }}
                                bodyStyle={{ padding: '12px' }}
                                onClick={() => setSelectedModule(module.id)}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '8px'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <DragOutlined style={{ color: '#d1d5db', cursor: 'grab' }} />
                                        <Text strong>
                                            {module.id}. {module.title}
                                        </Text>
                                    </div>
                                    <Tag
                                        color={
                                            module.status === 'Ready'
                                                ? 'green'
                                                : module.status === 'Draft'
                                                    ? 'orange'
                                                    : 'default'
                                        }
                                    >
                                        {module.status === 'Ready' ? t('learning_path.ready') : module.status === 'Draft' ? t('learning_path.draft') : t('learning_path.empty')}
                                    </Tag>
                                </div>
                                <div style={{ paddingLeft: '24px', fontSize: '12px', color: '#6b7280' }}>
                                    {module.count > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {module.id === 1 && (
                                                <>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <VideoCameraOutlined /> CEO Welcome
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <FileTextOutlined /> Handbook
                                                    </span>
                                                </>
                                            )}
                                            {module.id === 2 && <span>{module.count} {t('learning_path.items_configured')}</span>}
                                        </div>
                                    ) : (
                                        <span style={{ fontStyle: 'italic' }}>{t('learning_path.no_content')}</span>
                                    )}
                                </div>
                            </Card>
                        ))}

                        <Card
                            hoverable
                            style={{
                                borderRadius: '8px',
                                border: '1px solid #c7d2fe',
                                background: '#eef2ff'
                            }}
                            bodyStyle={{ padding: '12px' }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4338ca' }}>
                                    <CheckCircleOutlined />
                                    <Text strong style={{ color: '#4338ca' }}>
                                        {t('learning_path.final_assessment')}
                                    </Text>
                                </div>
                                <Tag color='geekblue'>Quiz</Tag>
                            </div>
                            <div style={{ paddingLeft: '24px', fontSize: '12px', color: '#6366f1' }}>
                                {t('learning_path.passing_score')}: 80%
                            </div>
                        </Card>
                    </Space>
                </div>
            </Sider>

            {/* Main Content: Editor Panel */}
            <Content style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
                <div
                    style={{
                        padding: '0 32px',
                        height: '64px',
                        borderBottom: '1px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div>
                        <Title level={4} style={{ margin: 0 }}>
                            {t('learning_path.modules')} {selectedModule}: Company Culture
                        </Title>
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            {t('learning_path.desc')}
                        </Text>
                    </div>
                    <Space>
                        <Button icon={<SettingOutlined />}>{t('menu.settings')}</Button>
                        <Button danger icon={<DeleteOutlined />}>
                            {t('learning_path.delete_module')}
                        </Button>
                    </Space>
                </div>

                <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <Text
                            type='secondary'
                            style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                marginBottom: '16px',
                                display: 'block'
                            }}
                        >
                            {t('learning_path.module_content')}
                        </Text>
                        <Space direction='vertical' style={{ width: '100%' }}>
                            {contentItems.map((item) => (
                                <Card key={item.id} style={{ borderRadius: '12px' }} bodyStyle={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                background: item.color === 'red' ? '#fef2f2' : '#eff6ff',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: item.color === 'red' ? '#ef4444' : '#3b82f6'
                                            }}
                                        >
                                            {item.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'start'
                                                }}
                                            >
                                                <div>
                                                    <Text strong style={{ display: 'block' }}>
                                                        {item.title}
                                                    </Text>
                                                    <Text type='secondary' style={{ fontSize: '12px' }}>
                                                        {item.meta}
                                                    </Text>
                                                </div>
                                                <Space>
                                                    <Button type='text' icon={<EditOutlined />} />
                                                    <Button type='text' icon={<DragOutlined />} />
                                                </Space>
                                            </div>
                                            {item.type === 'video' && (
                                                <div
                                                    style={{
                                                        marginTop: '12px',
                                                        background: '#000',
                                                        borderRadius: '8px',
                                                        height: '160px',
                                                        width: '280px',
                                                        position: 'relative',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            background: 'rgba(255,255,255,0.2)',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 0,
                                                                height: 0,
                                                                borderTop: '8px solid transparent',
                                                                borderBottom: '8px solid transparent',
                                                                borderLeft: '14px solid white',
                                                                marginLeft: '4px'
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </Space>
                    </div>

                    <Card style={{ borderRadius: '12px', border: '1px dashed #d9d9d9', background: '#fafafa' }}>
                        <Title level={5} style={{ marginTop: 0 }}>
                            {t('learning_path.add_resource')}
                        </Title>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            <Button
                                style={{
                                    flex: 1,
                                    height: '80px',
                                    borderColor: '#136dec',
                                    color: '#136dec',
                                    background: '#fff'
                                }}
                                icon={
                                    <VideoCameraOutlined
                                        style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}
                                    />
                                }
                            >
                                {t('learning_path.video_link')}
                            </Button>
                            <Button
                                style={{ flex: 1, height: '80px' }}
                                icon={
                                    <FileTextOutlined
                                        style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}
                                    />
                                }
                            >
                                {t('learning_path.file_upload')}
                            </Button>
                            <Button
                                style={{ flex: 1, height: '80px' }}
                                icon={
                                    <QuestionCircleOutlined
                                        style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}
                                    />
                                }
                            >
                                {t('learning_path.add_quiz')}
                            </Button>
                        </div>

                        <div
                            style={{
                                background: '#fff',
                                padding: '24px',
                                borderRadius: '12px',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            <Row gutter={16} style={{ marginBottom: '16px' }}>
                                <Col span={12}>
                                    <Text strong>{t('learning_path.resource_title')}</Text>
                                    <Input placeholder='e.g. Introduction Video' style={{ marginTop: '8px' }} />
                                </Col>
                                <Col span={12}>
                                    <Text strong>{t('learning_path.video_url')}</Text>
                                    <Input placeholder='https://youtube.com/...' style={{ marginTop: '8px' }} />
                                </Col>
                            </Row>
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>{t('learning_path.description_optional')}</Text>
                                <TextArea rows={3} style={{ marginTop: '8px' }} />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Button type='primary' icon={<PlusOutlined />}>
                                    {t('learning_path.add_video')}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #f0f0f0' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}
                        >
                            <div>
                                <Text
                                    type='secondary'
                                    style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}
                                >
                                    {t('learning_path.checkpoints')}
                                </Text>
                                <Text type='secondary' style={{ display: 'block', fontSize: '12px' }}>
                                    {t('learning_path.checkpoints_desc')}
                                </Text>
                            </div>
                            <Button type='link' icon={<PlusOutlined />}>
                                {t('learning_path.new_question')}
                            </Button>
                        </div>

                        <Card style={{ borderRadius: '12px', border: '1px solid #e0e7ff', background: '#eef2ff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Text strong>Q1: What is the primary mission of our company?</Text>
                                <Space>
                                    <EditOutlined style={{ color: '#6b7280', cursor: 'pointer' }} />
                                    <DeleteOutlined style={{ color: '#6b7280', cursor: 'pointer' }} />
                                </Space>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div
                                    style={{
                                        background: '#fff',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #52c41a',
                                        display: 'flex',
                                        gap: '8px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <CheckCircleOutlined style={{ color: '#52c41a' }} /> To enable digital
                                    transformation for everyone.
                                </div>
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.6)',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid transparent',
                                        display: 'flex',
                                        gap: '8px',
                                        alignItems: 'center',
                                        color: '#6b7280'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 14,
                                            height: 14,
                                            borderRadius: '50%',
                                            border: '1px solid #d9d9d9'
                                        }}
                                    ></div>{' '}
                                    To sell software.
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};
