import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

type ReportType = 'Weekly' | 'Monthly';
type ReportStatus = 'Submitted' | 'Approved' | 'Rejected';

interface ReportItem {
    id: number;
    title: string;
    type: ReportType;
    period: string;
    submittedAt: string;
    status: ReportStatus;
    score?: number;
    feedback?: string;
    content: string;
    challenges: string;
    nextPlan: string;
}

const initialReports: ReportItem[] = [
    {
        id: 1,
        title: 'Week 32 - Sprint Review',
        type: 'Weekly',
        period: 'Week 32',
        submittedAt: '2025-08-11',
        status: 'Approved',
        score: 92,
        feedback: 'Great clarity and actionable next steps.',
        content: 'Completed sprint backlog and documented API usage.',
        challenges: 'Time allocation for testing was tight.',
        nextPlan: 'Increase unit test coverage for edge cases.'
    },
    {
        id: 2,
        title: 'Week 33 - System Design Notes',
        type: 'Weekly',
        period: 'Week 33',
        submittedAt: '2025-08-18',
        status: 'Submitted',
        score: 0,
        feedback: 'Pending review by mentor.',
        content: 'Outlined database schema and service boundaries.',
        challenges: 'Need to finalize data flow for analytics.',
        nextPlan: 'Review with mentor and adjust diagram.'
    },
    {
        id: 3,
        title: 'Monthly Report - August',
        type: 'Monthly',
        period: 'Aug 2025',
        submittedAt: '2025-08-31',
        status: 'Rejected',
        score: 68,
        feedback: 'Missing detail on measurable outcomes.',
        content: 'Summarized learning and contributions for August.',
        challenges: 'Need more concrete KPI measurements.',
        nextPlan: 'Include metrics and links to deliverables.'
    }
];

export const InternReportPage = () => {
    const [reports, setReports] = useState<ReportItem[]>(initialReports);
    const [typeFilter, setTypeFilter] = useState<'All' | ReportType>('All');
    const [statusFilter, setStatusFilter] = useState<'All' | ReportStatus>('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);
    const [editingReport, setEditingReport] = useState<ReportItem | null>(null);
    const [form] = Form.useForm();

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const matchesType = typeFilter === 'All' || report.type === typeFilter;
            const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
            return matchesType && matchesStatus;
        });
    }, [reports, statusFilter, typeFilter]);

    const handleOpenCreate = () => {
        setEditingReport(null);
        setViewOnly(false);
        form.resetFields();
        setModalOpen(true);
    };

    const handleOpenView = (report: ReportItem) => {
        setEditingReport(report);
        setViewOnly(true);
        form.setFieldsValue(report);
        setModalOpen(true);
    };

    const handleOpenEdit = (report: ReportItem) => {
        setEditingReport(report);
        setViewOnly(false);
        form.setFieldsValue(report);
        setModalOpen(true);
    };

    const handleDelete = (report: ReportItem) => {
        Modal.confirm({
            title: 'Xoa bao cao nay?'.toUpperCase(),
            content: `Bao cao "${report.title}" se bi xoa vinh vien.`,
            okText: 'Xoa bao cao',
            okButtonProps: { danger: true },
            cancelText: 'Huy',
            onOk: () => {
                setReports((prev) => prev.filter((item) => item.id !== report.id));
                message.success('Bao cao da duoc xoa');
            }
        });
    };

    const handleSave = async () => {
        if (viewOnly) {
            setModalOpen(false);
            return;
        }

        try {
            const values = await form.validateFields();
            if (editingReport) {
                setReports((prev) =>
                    prev.map((item) => (item.id === editingReport.id ? { ...item, ...values } : item))
                );
                message.success('Cap nhat bao cao thanh cong');
            } else {
                const newReport: ReportItem = {
                    id: Date.now(),
                    title: values.title,
                    type: values.type,
                    period: values.period,
                    submittedAt: new Date().toISOString().slice(0, 10),
                    status: 'Submitted',
                    score: 0,
                    feedback: 'Pending review by mentor.',
                    content: values.content,
                    challenges: values.challenges,
                    nextPlan: values.nextPlan
                };
                setReports((prev) => [newReport, ...prev]);
                message.success('Bao cao moi da duoc tao');
            }
            setModalOpen(false);
        } catch (error) {
            return;
        }
    };

    const columns = [
        {
            title: 'Report Title',
            dataIndex: 'title',
            key: 'title',
            render: (value: string, record: ReportItem) => (
                <div>
                    <Text strong>{value}</Text>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.period}</div>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (value: ReportType) => <Tag color={value === 'Weekly' ? 'blue' : 'purple'}>{value}</Tag>
        },
        {
            title: 'Submission Date',
            dataIndex: 'submittedAt',
            key: 'submittedAt'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value: ReportStatus) => {
                const color = value === 'Approved' ? 'green' : value === 'Rejected' ? 'red' : 'gold';
                return <Tag color={color}>{value}</Tag>;
            }
        },
        {
            title: 'Score / Feedback',
            key: 'score',
            render: (_: unknown, record: ReportItem) => (
                <div>
                    <Text strong>{record.score || '--'}</Text>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.feedback}</div>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: ReportItem) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => handleOpenView(record)} />
                    <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px'
                }}
            >
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        Bao cao thuc tap
                    </Title>
                    <Text type='secondary'>Quan ly bao cao hang tuan va hang thang</Text>
                </div>
                <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreate}>
                    Tao bao cao moi
                </Button>
            </div>

            <Card
                style={{ marginBottom: '24px', borderRadius: '12px' }}
                bodyStyle={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
            >
                <div style={{ minWidth: '200px' }}>
                    <Text type='secondary'>Loai bao cao</Text>
                    <Select
                        style={{ width: '100%' }}
                        value={typeFilter}
                        onChange={(value) => setTypeFilter(value)}
                        options={[
                            { value: 'All', label: 'Tat ca' },
                            { value: 'Weekly', label: 'Weekly' },
                            { value: 'Monthly', label: 'Monthly' }
                        ]}
                    />
                </div>
                <div style={{ minWidth: '200px' }}>
                    <Text type='secondary'>Trang thai</Text>
                    <Select
                        style={{ width: '100%' }}
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        options={[
                            { value: 'All', label: 'Tat ca' },
                            { value: 'Submitted', label: 'Submitted' },
                            { value: 'Approved', label: 'Approved' },
                            { value: 'Rejected', label: 'Rejected' }
                        ]}
                    />
                </div>
            </Card>

            <Card style={{ borderRadius: '12px' }}>
                <Table columns={columns} dataSource={filteredReports} rowKey='id' pagination={{ pageSize: 6 }} />
            </Card>

            <Modal
                title={viewOnly ? 'Chi tiet bao cao' : editingReport ? 'Chinh sua bao cao' : 'Tao bao cao moi'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                okText={viewOnly ? 'Dong' : 'Luu'}
                cancelText='Huy'
                width={720}
            >
                <Form layout='vertical' form={form} initialValues={{ type: 'Weekly' }} style={{ marginTop: '16px' }}>
                    <Form.Item label='Report Title' name='title' rules={[{ required: true, message: 'Nhap tieu de' }]}>
                        <Input placeholder='Week 35 - Weekly Report' disabled={viewOnly} />
                    </Form.Item>
                    <Form.Item label='Report Type' name='type' rules={[{ required: true, message: 'Chon loai' }]}>
                        <Select
                            disabled={viewOnly}
                            options={[
                                { value: 'Weekly', label: 'Weekly' },
                                { value: 'Monthly', label: 'Monthly' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Week / Month'
                        name='period'
                        rules={[{ required: true, message: 'Chon ky bao cao' }]}
                    >
                        <Select
                            disabled={viewOnly}
                            options={[
                                { value: 'Week 34', label: 'Week 34' },
                                { value: 'Week 35', label: 'Week 35' },
                                { value: 'Aug 2025', label: 'Aug 2025' },
                                { value: 'Sep 2025', label: 'Sep 2025' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label='Content' name='content' rules={[{ required: true, message: 'Nhap noi dung' }]}>
                        <TextArea rows={4} placeholder='Tom tat nhung viec da lam' readOnly={viewOnly} />
                    </Form.Item>
                    <Form.Item
                        label='Issues / Challenges'
                        name='challenges'
                        rules={[{ required: true, message: 'Nhap kho khan' }]}
                    >
                        <TextArea rows={3} placeholder='Kho khan gap phai trong tuan' readOnly={viewOnly} />
                    </Form.Item>
                    <Form.Item
                        label='Next Week Plan'
                        name='nextPlan'
                        rules={[{ required: true, message: 'Nhap ke hoach' }]}
                    >
                        <TextArea rows={3} placeholder='Ke hoach tiep theo' readOnly={viewOnly} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
