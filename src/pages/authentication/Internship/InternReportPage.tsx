import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, message, Spin, Empty } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useReports, useCreateReport, useUpdateReport, useDeleteReport } from '../../../hooks/Internship/useReports';
import { Report } from '../../../services/Internship/reports';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const InternReportPage = () => {
    const [typeFilter, setTypeFilter] = useState<'All' | 'Weekly' | 'Monthly'>('All');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Submitted' | 'Approved' | 'Rejected'>('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);
    const [editingReport, setEditingReport] = useState<Report | null>(null);
    const [form] = Form.useForm();

    const { data: reportsRes, isLoading } = useReports({
        internId: 'ITS-001', // Mocked ID
        type: typeFilter,
        status: statusFilter
    });

    const createReportMutation = useCreateReport();
    const updateReportMutation = useUpdateReport();
    const deleteReportMutation = useDeleteReport();

    const reports = reportsRes?.data?.hits || [];

    const handleOpenCreate = () => {
        setEditingReport(null);
        setViewOnly(false);
        form.resetFields();
        setModalOpen(true);
    };

    const handleOpenView = (report: Report) => {
        setEditingReport(report);
        setViewOnly(true);
        form.setFieldsValue(report);
        setModalOpen(true);
    };

    const handleOpenEdit = (report: Report) => {
        setEditingReport(report);
        setViewOnly(false);
        form.setFieldsValue(report);
        setModalOpen(true);
    };

    const handleDelete = (report: Report) => {
        Modal.confirm({
            title: 'Xóa báo cáo này?'.toUpperCase(),
            content: `Báo cáo "${report.title}" sẽ bị xóa vĩnh viễn.`,
            okText: 'Xóa báo cáo',
            okButtonProps: { danger: true },
            cancelText: 'Hủy',
            onOk: async () => {
                await deleteReportMutation.mutateAsync(report.id);
                message.success('Báo cáo đã được xóa');
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
                await updateReportMutation.mutateAsync({
                    id: editingReport.id,
                    ...values
                });
                message.success('Báo cáo đã được cập nhật');
                setModalOpen(false);
            } else {
                await createReportMutation.mutateAsync({
                    internId: 'ITS-001',
                    title: values.title,
                    type: values.type,
                    period: values.period,
                    content: values.content,
                    challenges: values.challenges,
                    nextPlan: values.nextPlan
                });
                message.success('Báo cáo mới đã được tạo');
                setModalOpen(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'Report Title',
            dataIndex: 'title',
            key: 'title',
            render: (value: string, record: Report) => (
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
            render: (value: string) => <Tag color={value === 'Weekly' ? 'blue' : 'purple'}>{value}</Tag>
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
            render: (value: string) => {
                const color = value === 'Approved' ? 'green' : value === 'Rejected' ? 'red' : 'gold';
                return <Tag color={color}>{value}</Tag>;
            }
        },
        {
            title: 'Score / Feedback',
            key: 'score',
            render: (_: unknown, record: Report) => (
                <div>
                    <Text strong>{record.score || '--'}</Text>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.feedback || 'No feedback yet'}</div>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Report) => (
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
                        Báo cáo thực tập
                    </Title>
                    <Text type='secondary'>Quản lý báo cáo hàng tuần và hàng tháng</Text>
                </div>
                <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreate}>
                    Tạo báo cáo mới
                </Button>
            </div>

            <Card
                style={{ marginBottom: '24px', borderRadius: '12px' }}
                bodyStyle={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
            >
                <div style={{ minWidth: '200px' }}>
                    <Text type='secondary'>Loại báo cáo</Text>
                    <Select
                        style={{ width: '100%' }}
                        value={typeFilter}
                        onChange={(value) => setTypeFilter(value)}
                        options={[
                            { value: 'All', label: 'Tất cả' },
                            { value: 'Weekly', label: 'Weekly' },
                            { value: 'Monthly', label: 'Monthly' }
                        ]}
                    />
                </div>
                <div style={{ minWidth: '200px' }}>
                    <Text type='secondary'>Trạng thái</Text>
                    <Select
                        style={{ width: '100%' }}
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        options={[
                            { value: 'All', label: 'Tất cả' },
                            { value: 'Submitted', label: 'Submitted' },
                            { value: 'Approved', label: 'Approved' },
                            { value: 'Rejected', label: 'Rejected' }
                        ]}
                    />
                </div>
            </Card>

            <Card style={{ borderRadius: '12px' }}>
                <Table
                    columns={columns}
                    dataSource={reports}
                    loading={isLoading}
                    rowKey='id'
                    pagination={{ pageSize: 6 }}
                    locale={{ emptyText: isLoading ? <Spin indicator={<LoadingOutlined />} /> : <Empty /> }}
                />
            </Card>

            <Modal
                title={viewOnly ? 'Chi tiết báo cáo' : editingReport ? 'Chỉnh sửa báo cáo' : 'Tạo báo cáo mới'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                okText={viewOnly ? 'Đóng' : 'Lưu'}
                cancelText='Hủy'
                width={720}
                confirmLoading={createReportMutation.isPending || updateReportMutation.isPending}
            >
                <Form layout='vertical' form={form} initialValues={{ type: 'Weekly' }} style={{ marginTop: '16px' }}>
                    <Form.Item label='Report Title' name='title' rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
                        <Input placeholder='Week 35 - Weekly Report' disabled={viewOnly} />
                    </Form.Item>
                    <Form.Item label='Report Type' name='type' rules={[{ required: true, message: 'Chọn loại' }]}>
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
                        rules={[{ required: true, message: 'Chọn kỳ báo cáo' }]}
                    >
                        <Select
                            disabled={viewOnly}
                            options={[
                                { value: 'Week 34', label: 'Week 34' },
                                { value: 'Week 35', label: 'Week 35' },
                                { value: 'Week 36', label: 'Week 36' },
                                { value: 'Aug 2025', label: 'Aug 2025' },
                                { value: 'Sep 2025', label: 'Sep 2025' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label='Content' name='content' rules={[{ required: true, message: 'Nhập nội dung' }]}>
                        <TextArea rows={4} placeholder='Tóm tắt những việc đã làm' readOnly={viewOnly} />
                    </Form.Item>
                    <Form.Item
                        label='Issues / Challenges'
                        name='challenges'
                        rules={[{ required: true, message: 'Nhập khó khăn' }]}
                    >
                        <TextArea rows={3} placeholder='Khó khăn gặp phải trong tuần' readOnly={viewOnly} />
                    </Form.Item>
                    <Form.Item
                        label='Next Week Plan'
                        name='nextPlan'
                        rules={[{ required: true, message: 'Nhập kế hoạch' }]}
                    >
                        <TextArea rows={3} placeholder='Kế hoạch tiếp theo' readOnly={viewOnly} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
