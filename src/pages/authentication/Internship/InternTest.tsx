import {
    LeftOutlined,
    RightOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    BulbOutlined,
    DashboardOutlined,
    FileSearchOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { Button, Card, Progress, Radio, Space, Typography, message, Modal, Result, Spin, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
import { RouteConfig } from '../../../constants';
import dayjs from 'dayjs';

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
        text: "Mục đích chính của hook 'useEffect' trong React là gì?",
        options: [
            'Xử lý giao diện component',
            'Thực hiện các side effect trong functional components',
            'Định nghĩa trạng thái toàn cục',
            'Tối ưu hiệu suất rendering'
        ],
        correctAnswer: 1
    },
    {
        id: 2,
        text: 'Cách nào sau đây KHÔNG phải là cách hợp lệ để style một React component?',
        options: ['Inline styles', 'CSS Modules', 'Styled Components', 'Thẻ style HTML thuần trong JSX'],
        correctAnswer: 3
    },
    {
        id: 3,
        text: 'JSX viết tắt của gì?',
        options: ['JavaScript Extension', 'JavaScript XML', 'Java Standard Extension', 'JSON Syntax Extension'],
        correctAnswer: 1
    },
    {
        id: 4,
        text: 'Làm thế nào để thực hiện conditional rendering trong React?',
        options: [
            'Dùng if-else bên trong JSX',
            'Dùng toán tử ternary hoặc toán tử &&',
            'Dùng switch-case trực tiếp trong JSX',
            'React không hỗ trợ conditional rendering'
        ],
        correctAnswer: 1
    },
    {
        id: 5,
        text: 'Lợi ích của việc sử dụng React Query để fetch dữ liệu là gì?',
        options: [
            'Nó tự động style các component',
            'Nó cung cấp cơ chế cache và đồng bộ sẵn có',
            'Nó thay thế cho mọi backend API',
            'Nó chỉ hoạt động với GraphQL'
        ],
        correctAnswer: 1
    }
];

export const InternTest = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showAnswers, setShowAnswers] = useState(false);

    const [internRes, setInternRes] = useState<any>(null);
    const [isLoadingIntern, setIsLoadingIntern] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchIntern = async () => {
        setIsLoadingIntern(true);
        try {
            const res = await http.get('/interns/ITS-001'); // Mocked ID
            setInternRes(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingIntern(false);
        }
    };

    useEffect(() => {
        fetchIntern();
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && !submitted) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
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

    const handleSubmit = async () => {
        let finalScore = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                finalScore += 1;
            }
        });

        const calculatedScore = Math.round((finalScore / questions.length) * 100);
        setScore(calculatedScore);

        if (internRes?.data) {
            const intern = internRes.data;
            setIsSubmitting(true);
            try {
                await http.post('/evaluations', {
                    internId: intern.id,
                    mentorId: intern.mentorId || 'MT-001',
                    type: 'Knowledge-test',
                    technicalScore: calculatedScore,
                    feedback: `Completed Fundamental React Knowledge Test with ${finalScore}/${questions.length} correct answers.`
                });
                setSubmitted(true);
                message.success(t('test.submitted_success') || 'Nộp kết quả bài kiểm tra thành công!');
            } catch (err) {
                message.error('Nộp kết quả thất bại. Vui lòng thử lại.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setSubmitted(true);
            message.warning('Hoàn thành bài kiểm tra nhưng không tìm thấy hồ sơ thực tập sinh để lưu kết quả.');
        }
    };

    if (isLoadingIntern) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size='large' tip='Đang tải bài kiểm tra...' />
            </div>
        );
    }

    if (submitted) {
        return (
            <div style={{ padding: '48px', textAlign: 'center' }}>
                <Result
                    status={score >= 80 ? 'success' : 'info'}
                    title={t('test.completed')}
                    subTitle={`Bạn đạt ${score}% trong Bài kiểm tra kiến thức React cơ bản.`}
                    extra={[
                        <Button
                            type='primary'
                            key='dashboard'
                            icon={<DashboardOutlined />}
                            onClick={() => navigate(RouteConfig.InternDashboard.path)}
                        >
                            Quay lại trang cá nhân
                        </Button>,
                        <Button key='review' icon={<FileSearchOutlined />} onClick={() => setShowAnswers(true)}>
                            Xem lại đáp án
                        </Button>
                    ]}
                >
                    <div style={{ marginTop: '24px' }}>
                        <Card variant='borderless' style={{ background: '#f8fafc', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
                                <div>
                                    <Text type='secondary' style={{ display: 'block' }}>
                                        Câu trả lời đúng
                                    </Text>
                                    <Title level={3} style={{ margin: 0, color: '#10B981' }}>
                                        {Math.round((score / 100) * questions.length)} / {questions.length}
                                    </Title>
                                </div>
                                <Divider type='vertical' style={{ height: 'auto' }} />
                                <div>
                                    <Text type='secondary' style={{ display: 'block' }}>
                                        Tỷ lệ đúng
                                    </Text>
                                    <Title level={3} style={{ margin: 0, color: score >= 80 ? '#1E40AF' : '#f5222d' }}>
                                        {score}%
                                    </Title>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {showAnswers && (
                        <div style={{ marginTop: '32px', textAlign: 'left' }}>
                            <Title level={4}>Xem lại câu hỏi</Title>
                            {questions.map((q, index) => (
                                <Card
                                    key={q.id}
                                    variant='borderless'
                                    style={{
                                        marginBottom: '16px',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0'
                                    }}
                                >
                                    <Paragraph strong>
                                        {q.id}. {q.text}
                                    </Paragraph>
                                    <Space direction='vertical'>
                                        {q.options.map((option, optIdx) => (
                                            <div
                                                key={optIdx}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    color:
                                                        optIdx === q.correctAnswer
                                                            ? '#10B981'
                                                            : answers[index] === optIdx
                                                                ? '#EF4444'
                                                                : 'inherit'
                                                }}
                                            >
                                                {optIdx === q.correctAnswer ? (
                                                    <CheckCircleOutlined />
                                                ) : answers[index] === optIdx ? (
                                                    <CloseOutlined />
                                                ) : (
                                                    <div style={{ width: 14 }} />
                                                )}
                                                <Text
                                                    style={{
                                                        fontWeight: optIdx === q.correctAnswer ? 600 : 400,
                                                        color: 'inherit'
                                                    }}
                                                >
                                                    {option}
                                                </Text>
                                            </div>
                                        ))}
                                    </Space>
                                </Card>
                            ))}
                        </div>
                    )}
                </Result>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Card
                variant='borderless'
                style={{
                    borderRadius: '16px',
                    marginBottom: '24px',
                    position: 'sticky',
                    top: '24px',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size='large'>
                        <div>
                            <Text type='secondary' style={{ display: 'block', fontSize: '12px' }}>
                                {t('test.progress')}
                            </Text>
                            <Text strong>
                                {currentQuestion + 1} / {questions.length} {t('test.questions')}
                            </Text>
                        </div>
                        <Progress
                            type='circle'
                            percent={((currentQuestion + 1) / questions.length) * 100}
                            size={40}
                            strokeColor='#1E40AF'
                        />
                    </Space>
                    <div style={{ textAlign: 'right' }}>
                        <Text type='secondary' style={{ display: 'block', fontSize: '12px' }}>
                            {t('test.time_remaining')}
                        </Text>
                        <Space>
                            <ClockCircleOutlined style={{ color: timeLeft < 60 ? '#EF4444' : '#1E40AF' }} />
                            <Text strong style={{ fontSize: '18px', color: timeLeft < 60 ? '#EF4444' : 'inherit' }}>
                                {formatTime(timeLeft)}
                            </Text>
                        </Space>
                    </div>
                </div>
            </Card>

            <Card
                variant='borderless'
                style={{ borderRadius: '16px', minHeight: '400px' }}
                loading={isSubmitting}
                title={
                    <Space>
                        <BulbOutlined style={{ color: '#1E40AF' }} />
                        <Title level={4} style={{ margin: 0 }}>
                            Bài kiểm tra kiến thức React cơ bản
                        </Title>
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
                        <Space direction='vertical' style={{ width: '100%' }}>
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
                                        textAlign: 'left',
                                        whiteSpace: 'normal',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {String.fromCharCode(65 + index)}. {option}
                                </Radio.Button>
                            ))}
                        </Space>
                    </Radio.Group>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderTop: '1px solid #E2E8F0',
                        paddingTop: '24px'
                    }}
                >
                    <Button
                        icon={<LeftOutlined />}
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion((prev) => prev - 1)}
                    >
                        Quay lại
                    </Button>
                    {currentQuestion === questions.length - 1 ? (
                        <Button
                            type='primary'
                            icon={<CheckCircleOutlined />}
                            loading={isSubmitting}
                            onClick={() =>
                                Modal.confirm({
                                    title: t('test.submit_confirm') || 'Submit Test?',
                                    content:
                                        t('test.submit_desc') ||
                                        'Are you sure you want to finish and submit your answers?',
                                    onOk: handleSubmit
                                })
                            }
                        >
                            {t('test.finish_submit')}
                        </Button>
                    ) : (
                        <Button type='primary' onClick={() => setCurrentQuestion((prev) => prev + 1)}>
                            {t('test.next')} <RightOutlined />
                        </Button>
                    )}
                </div>
            </Card>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <Text type='secondary'>{t('test.instruction')}</Text>
            </div>
        </div>
    );
};
