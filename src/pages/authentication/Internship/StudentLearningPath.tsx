import {
    BookOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    FilePdfOutlined,
    LockOutlined,
    PlayCircleOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { Button, Card, Collapse, Layout, List, Modal, Progress, Radio, Result, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLearningPath } from '../../../hooks/Internship/useLearningPath';
import { useQuiz } from '../../../hooks/Internship/useQuizzes';
import { useResponsive } from '../../../hooks/useResponsive';

const { Title, Text, Paragraph } = Typography;
const { Sider, Content } = Layout;
const { Panel } = Collapse;

interface LearningItemView {
    id: string | number;
    type: string;
    title: string;
    meta: string;
}

export const StudentLearningPath = () => {
    const { t } = useTranslation();
    const { isMobile, isLaptop } = useResponsive();
    const [selectedItem, setSelectedItem] = useState<LearningItemView | null>(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
    const [quizResult, setQuizResult] = useState<number | null>(null);

    // Mock data fetching
    const { data: lpData } = useLearningPath('Frontend Development');
    const { data: quizData } = useQuiz(selectedItem?.type === 'quiz' ? String(selectedItem.id) : '');

    const learningPath = lpData?.data;
    const modules = learningPath?.modules || [];

    // Calculate progress
    const totalItems = modules.reduce((acc, m) => acc + m.items.length, 0);
    const completedItems = 5; // Mock completed count
    const progressPercent = Math.round((completedItems / totalItems) * 100);

    const handleItemClick = (item: LearningItemView) => {
        if (item.type === 'quiz') {
            setSelectedItem(item);
            setIsQuizModalOpen(true);
            setQuizResult(null);
            setQuizAnswers({});
        } else {
            setSelectedItem(item);
        }
    };

    const handleQuizSubmit = () => {
        // Mock scoring logic
        let score = 0;
        const questions = quizData?.data?.questions || [];
        questions.forEach((q, index) => {
            if (quizAnswers[q.id || index] === q.correct) {
                score++;
            }
        });
        const percentage = Math.round((score / questions.length) * 100);
        setQuizResult(percentage);
    };

    return (
        <Layout
            style={{ height: 'calc(100vh - 64px)', background: '#f0f2f5', flexDirection: isMobile ? 'column' : 'row' }}
        >
            <Sider
                width={isMobile ? '100%' : 350}
                theme='light'
                style={{
                    borderRight: isMobile ? 'none' : '1px solid #e8e8e8',
                    borderBottom: isMobile ? '1px solid #e8e8e8' : 'none',
                    overflowY: 'auto'
                }}
            >
                <div style={{ padding: isMobile ? '12px' : '24px' }}>
                    <Title level={4}>{t('student_learning_path.title')}</Title>
                    <Card
                        size='small'
                        style={{
                            background: '#e6f7ff',
                            borderColor: '#91d5ff',
                            marginBottom: 24
                        }}
                    >
                        <Space direction='vertical' style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text strong>{t('student_learning_path.progress')}</Text>
                                <Text strong>{progressPercent}%</Text>
                            </div>
                            <Progress percent={progressPercent} showInfo={false} strokeColor='#1890ff' />
                            <Text type='secondary' style={{ fontSize: 12 }}>
                                {completedItems}/{totalItems} {t('student_learning_path.modules')}{' '}
                                {t('student_learning_path.status_completed')}
                            </Text>
                        </Space>
                    </Card>

                    <Collapse
                        defaultActiveKey={['1']}
                        ghost
                        accordion
                        expandIconPosition='end'
                        style={{ background: 'transparent' }}
                    >
                        {modules.map((module) => (
                            <Panel
                                header={
                                    <Space>
                                        {module.status === 'Locked' ? (
                                            <LockOutlined style={{ color: '#d9d9d9' }} />
                                        ) : module.status === 'Ready' ? (
                                            <CheckCircleFilled style={{ color: '#52c41a' }} />
                                        ) : (
                                            <PlayCircleOutlined style={{ color: '#1890ff' }} />
                                        )}
                                        <Text
                                            style={{
                                                color: module.status === 'Locked' ? '#d9d9d9' : undefined,
                                                fontWeight: 500
                                            }}
                                        >
                                            {module.title}
                                        </Text>
                                    </Space>
                                }
                                key={module.id}
                                disabled={module.status === 'Locked'}
                            >
                                <List
                                    dataSource={module.items}
                                    renderItem={(item) => (
                                        <List.Item
                                            style={{
                                                padding: '12px 16px',
                                                cursor: 'pointer',
                                                background: selectedItem?.id === item.id ? '#e6f7ff' : '#fff',
                                                borderRadius: 6,
                                                marginBottom: 8,
                                                border:
                                                    selectedItem?.id === item.id
                                                        ? '1px solid #1890ff'
                                                        : '1px solid #f0f0f0',
                                                transition: 'all 0.3s'
                                            }}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <Space>
                                                {String(item.type) === 'video' && (
                                                    <PlayCircleOutlined style={{ color: '#ff4d4f' }} />
                                                )}
                                                {String(item.type) === 'document' && (
                                                    <FilePdfOutlined style={{ color: '#fa8c16' }} />
                                                )}
                                                {String(item.type) === 'quiz' && (
                                                    <QuestionCircleOutlined style={{ color: '#722ed1' }} />
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Text strong={selectedItem?.id === item.id}>{item.title}</Text>
                                                    <Text type='secondary' style={{ fontSize: 11 }}>
                                                        <ClockCircleOutlined style={{ fontSize: 10, marginRight: 4 }} />
                                                        {item.meta}
                                                    </Text>
                                                </div>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            </Sider>

            <Content style={{ padding: isMobile ? '12px' : isLaptop ? '18px' : '24px', overflowY: 'auto' }}>
                {selectedItem ? (
                    <Card
                        style={{ height: '100%', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                        bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ marginBottom: 24, borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
                            <Tag
                                color={
                                    String(selectedItem.type) === 'video'
                                        ? 'red'
                                        : String(selectedItem.type) === 'quiz'
                                          ? 'purple'
                                          : 'orange'
                                }
                            >
                                {selectedItem.type.toUpperCase()}
                            </Tag>
                            <Title level={3} style={{ marginTop: 12, marginBottom: 0 }}>
                                {selectedItem.title}
                            </Title>
                        </div>

                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: '#fafafa',
                                borderRadius: 8
                            }}
                        >
                            {String(selectedItem.type) === 'video' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <PlayCircleOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                                    <Title level={4} style={{ color: '#8c8c8c' }}>
                                        {t('student_learning_path.view_content')}
                                    </Title>
                                    <Text type='secondary'>Video Player Placeholder</Text>
                                </div>
                            ) : String(selectedItem.type) === 'quiz' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <QuestionCircleOutlined
                                        style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }}
                                    />
                                    <Title level={4} style={{ color: '#8c8c8c' }}>
                                        {t('student_learning_path.start_quiz')}
                                    </Title>
                                    <Button type='primary' size='large' onClick={() => setIsQuizModalOpen(true)}>
                                        {t('student_learning_path.start_quiz')}
                                    </Button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <FilePdfOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                                    <Title level={4} style={{ color: '#8c8c8c' }}>
                                        {t('student_learning_path.view_content')}
                                    </Title>
                                    <Text type='secondary'>Document Viewer Placeholder</Text>
                                </div>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#bfbfbf'
                        }}
                    >
                        <BookOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                        <Title level={4} style={{ color: '#bfbfbf' }}>
                            {t('student_learning_path.modules')}
                        </Title>
                        <Text type='secondary'>Select an item from the sidebar to start learning</Text>
                    </div>
                )}
            </Content>

            <Modal
                title={
                    <Space>
                        <QuestionCircleOutlined /> {quizData?.data?.title}
                    </Space>
                }
                open={isQuizModalOpen}
                onCancel={() => setIsQuizModalOpen(false)}
                footer={null}
                width={isMobile ? 'calc(100vw - 24px)' : 700}
                centered
                destroyOnClose
            >
                {quizResult !== null ? (
                    <Result
                        status={quizResult >= 80 ? 'success' : 'warning'}
                        title={quizResult >= 80 ? 'Passed!' : 'Try Again'}
                        subTitle={`${t('student_learning_path.your_score')}: ${quizResult}%`}
                        extra={[
                            <Button type='primary' key='close' onClick={() => setIsQuizModalOpen(false)}>
                                {t('common.close')}
                            </Button>,
                            <Button
                                key='retry'
                                onClick={() => {
                                    setQuizResult(null);
                                    setQuizAnswers({});
                                }}
                            >
                                {t('common.retry')}
                            </Button>
                        ]}
                    />
                ) : (
                    <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }}>
                        {quizData?.data?.questions?.map((q, qIndex) => (
                            <Card
                                key={q.id || qIndex}
                                size='small'
                                title={`${t('quiz.question')} ${qIndex + 1}`}
                                style={{ marginBottom: 16, background: '#fafafa' }}
                            >
                                <Paragraph strong>{q.text}</Paragraph>
                                <Radio.Group
                                    onChange={(e) =>
                                        setQuizAnswers({ ...quizAnswers, [q.id || qIndex]: e.target.value })
                                    }
                                    value={quizAnswers[q.id || qIndex]}
                                    style={{ width: '100%' }}
                                >
                                    <Space direction='vertical' style={{ width: '100%' }}>
                                        {q.options.map((opt, oIndex) => (
                                            <Radio key={oIndex} value={oIndex} style={{ padding: '8px 0' }}>
                                                {opt}
                                            </Radio>
                                        ))}
                                    </Space>
                                </Radio.Group>
                            </Card>
                        ))}
                        <div style={{ textAlign: 'center', marginTop: 24 }}>
                            <Button
                                type='primary'
                                size='large'
                                icon={<CheckCircleFilled />}
                                onClick={handleQuizSubmit}
                                disabled={Object.keys(quizAnswers).length < (quizData?.data?.questions?.length || 0)}
                            >
                                {t('common.submit')}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};
