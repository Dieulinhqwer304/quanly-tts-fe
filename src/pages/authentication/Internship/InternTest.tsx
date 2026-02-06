import {
    LeftOutlined,
    RightOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    BulbOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Progress,
    Radio,
    Space,
    Typography,
    message,
    Modal,
    Result
} from 'antd';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
}

const questions: Question[] = [
    {
        id: 1,
        text: "What is the primary purpose of React's 'useEffect' hook?",
        options: [
            "To handle component styling",
            "To perform side effects in functional components",
            "To define global state",
            "To optimize rendering performance"
        ],
        correctAnswer: 1
    },
    {
        id: 2,
        text: "Which of the following is NOT a valid way to style a React component?",
        options: [
            "Inline styles",
            "CSS Modules",
            "Styled Components",
            "Native HTML style tags inside JSX"
        ],
        correctAnswer: 3
    },
    {
        id: 3,
        text: "What does JSX stand for?",
        options: [
            "JavaScript Extension",
            "JavaScript XML",
            "Java Standard Extension",
            "JSON Syntax Extension"
        ],
        correctAnswer: 1
    }
];

export const InternTest = () => {
    const { t } = useTranslation();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (timeLeft > 0 && !submitted) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !submitted) {
            handleSubmit();
        }
    }, [timeLeft, submitted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAnswerChange = (e: any) => {
        setAnswers({ ...answers, [currentQuestion]: e.target.value });
    };

    const handleSubmit = () => {
        let finalScore = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                finalScore += 1;
            }
        });
        setScore(finalScore);
        setSubmitted(true);
        message.success(t('common.success'));
    };

    if (submitted) {
        return (
            <div style={{ padding: '48px', textAlign: 'center' }}>
                <Result
                    status={score === questions.length ? "success" : "info"}
                    title={t('test.completed')}
                    subTitle={t('test.score_msg', { score, total: questions.length })}
                    extra={[
                        <Button type="primary" key="dashboard" onClick={() => window.location.reload()}>
                            {t('test.try_another')}
                        </Button>,
                        <Button key="back">{t('test.view_feedback')}</Button>,
                    ]}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Card bordered={false} style={{ borderRadius: '16px', marginBottom: '24px', position: 'sticky', top: '24px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="large">
                        <div>
                            <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>{t('test.progress')}</Text>
                            <Text strong>{currentQuestion + 1} / {questions.length} {t('test.questions')}</Text>
                        </div>
                        <Progress
                            type="circle"
                            percent={((currentQuestion + 1) / questions.length) * 100}
                            size={40}
                            strokeColor="#136dec"
                        />
                    </Space>
                    <div style={{ textAlign: 'right' }}>
                        <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>{t('test.time_remaining')}</Text>
                        <Space>
                            <ClockCircleOutlined style={{ color: timeLeft < 60 ? '#ff4d4f' : '#136dec' }} />
                            <Text strong style={{ fontSize: '18px', color: timeLeft < 60 ? '#ff4d4f' : 'inherit' }}>
                                {formatTime(timeLeft)}
                            </Text>
                        </Space>
                    </div>
                </div>
            </Card>

            <Card
                bordered={false}
                style={{ borderRadius: '16px', minHeight: '400px' }}
                title={
                    <Space>
                        <BulbOutlined style={{ color: '#136dec' }} />
                        <Title level={4} style={{ margin: 0 }}>Fundamental React Knowledge Test</Title>
                    </Space>
                }
            >
                <div style={{ marginBottom: '32px' }}>
                    <Paragraph style={{ fontSize: '18px', fontWeight: 500 }}>
                        {questions[currentQuestion].text}
                    </Paragraph>
                    <Radio.Group
                        onChange={handleAnswerChange}
                        value={answers[currentQuestion]}
                        style={{ width: '100%' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {questions[currentQuestion].options.map((option, index) => (
                                <Radio.Button
                                    key={index}
                                    value={index}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        textAlign: 'left'
                                    }}
                                >
                                    {String.fromCharCode(65 + index)}. {option}
                                </Radio.Button>
                            ))}
                        </Space>
                    </Radio.Group>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
                    <Button
                        icon={<LeftOutlined />}
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                    >
                        Previous
                    </Button>
                    {currentQuestion === questions.length - 1 ? (
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={() => Modal.confirm({
                                title: t('test.submit_confirm'),
                                content: t('test.submit_desc'),
                                onOk: handleSubmit
                            })}
                        >
                            {t('test.finish_submit')}
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                        >
                            {t('test.next')} <RightOutlined />
                        </Button>
                    )}
                </div>
            </Card>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <Text type="secondary">
                    {t('test.instruction')}
                </Text>
            </div>
        </div>
    );
};
