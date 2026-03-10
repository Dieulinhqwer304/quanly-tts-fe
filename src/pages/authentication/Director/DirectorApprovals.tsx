import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    FileTextOutlined,
    HistoryOutlined,
    InfoCircleOutlined,
    LoadingOutlined,
    SearchOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Empty,
    Input,
    Layout,
    List,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Typography,
    message
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useApprovals, useUpdateApproval } from '../../../hooks/Recruitment/useApprovals';
import { useDebounce } from '../../../hooks/useDebounce';
import { useResponsive } from '../../../hooks/useResponsive';
import { Approval, ApprovalPositionDetail, ApprovalStatus, ApprovalType } from '../../../services/Recruitment/approvals';

dayjs.extend(relativeTime);

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const STATUS_OPTIONS: Array<ApprovalStatus | 'all'> = ['all', 'Pending', 'Approved', 'Rejected', 'Adjusting'];

const STATUS_LABELS: Record<ApprovalStatus | 'all', string> = {
    all: 'Tất cả',
    Pending: 'Chờ duyệt',
    Approved: 'Đã duyệt',
    Rejected: 'Đã từ chối',
    Adjusting: 'Yêu cầu chỉnh sửa'
};

const STATUS_COLORS: Record<ApprovalStatus, 'warning' | 'success' | 'error' | 'processing'> = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'error',
    Adjusting: 'processing'
};

const normalizeStatus = (status: string): ApprovalStatus | null => {
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'Pending';
    if (lower === 'approved') return 'Approved';
    if (lower === 'rejected') return 'Rejected';
    if (lower === 'adjusting') return 'Adjusting';
    return null;
};

const getStatusLabel = (status: string): string => {
    const normalized = normalizeStatus(status);
    return normalized ? STATUS_LABELS[normalized] : status;
};

const getStatusColor = (status: string): 'warning' | 'success' | 'error' | 'processing' | 'default' => {
    const normalized = normalizeStatus(status);
    return normalized ? STATUS_COLORS[normalized] : 'default';
};

const getSafeNumber = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};

const formatCurrency = (value: unknown): string => {
    const num = getSafeNumber(value);
    if (num === null) return 'N/A';
    return `$${num.toLocaleString()}`;
};

const formatDateTime = (value?: string): string => {
    if (!value) return 'N/A';
    return dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY HH:mm') : 'N/A';
};

const formatRelativeTime = (value?: string): string => {
    if (!value) return 'N/A';
    return dayjs(value).isValid() ? dayjs(value).fromNow() : 'N/A';
};

export const DirectorApprovals = () => {
    const { isMobile, isLaptop } = useResponsive();

    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [directorNote, setDirectorNote] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('Pending');

    const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

    const { data: approvalsRes, isLoading, refetch } = useApprovals({
        status: statusFilter === 'all' ? undefined : statusFilter,
        type: 'Recruitment',
        searcher: debouncedSearchKeyword ? { keyword: debouncedSearchKeyword, field: 'name' } : undefined
    });

    const updateApproval = useUpdateApproval();

    const queue = useMemo<Approval[]>(() => approvalsRes?.data || [], [approvalsRes?.data]);

    useEffect(() => {
        if (queue.length === 0) {
            setSelectedRequestId(null);
            return;
        }

        if (!selectedRequestId || !queue.some((item) => item.id === selectedRequestId)) {
            setSelectedRequestId(queue[0].id);
        }
    }, [queue, selectedRequestId]);

    const selectedRequest = useMemo<Approval | null>(
        () => queue.find((item) => item.id === selectedRequestId) || null,
        [queue, selectedRequestId]
    );

    const positions: ApprovalPositionDetail[] = selectedRequest?.details?.positions || [];
    const totalPositions =
        typeof selectedRequest?.details?.totalPositions === 'number'
            ? selectedRequest.details.totalPositions
            : positions.reduce((sum, item) => sum + (typeof item.count === 'number' ? item.count : 0), 0);

    const runAction = async (status: ApprovalStatus) => {
        if (!selectedRequest) return;

        try {
            await updateApproval.mutate({
                id: selectedRequest.id,
                status,
                notes: directorNote.trim() || undefined
            });
            message.success(`Đã cập nhật trạng thái: ${getStatusLabel(status)}`);
            setDirectorNote('');
            await refetch();
        } catch {
            message.error('Cập nhật yêu cầu thất bại. Vui lòng thử lại.');
        }
    };

    const selectedStatus = selectedRequest?.status ? normalizeStatus(selectedRequest.status) : null;
    const canTakeAction = selectedStatus === 'Pending' || selectedStatus === 'Adjusting';

    const salary = getSafeNumber(selectedRequest?.salary);
    const budget = getSafeNumber(selectedRequest?.budget);
    const exceedAmount = salary !== null && budget !== null ? salary - budget : null;

    return (
        <Layout
            style={{
                height: 'calc(100vh - 64px)',
                background: '#f6f7f8',
                flexDirection: isMobile ? 'column' : 'row'
            }}
        >
            <Sider
                width={isMobile ? '100%' : 380}
                theme='light'
                style={{
                    borderRight: isMobile ? 'none' : '1px solid #E2E8F0',
                    borderBottom: isMobile ? '1px solid #E2E8F0' : 'none',
                    overflowY: 'auto'
                }}
            >
                <div style={{ padding: 16, borderBottom: '1px solid #E2E8F0' }}>
                    <Title level={5} style={{ margin: 0, marginBottom: 12 }}>
                        Hàng đợi phê duyệt
                    </Title>

                    <Space wrap style={{ marginBottom: 12 }}>
                        {STATUS_OPTIONS.map((status) => (
                            <Button
                                key={status}
                                size='small'
                                type={statusFilter === status ? 'primary' : 'text'}
                                onClick={() => setStatusFilter(status)}
                            >
                                {getStatusLabel(status)}
                            </Button>
                        ))}
                    </Space>

                    <Input
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        prefix={<SearchOutlined />}
                        placeholder='Tìm theo tên hoặc tiêu đề'
                        style={{ marginBottom: 12 }}
                    />

                    <Select value={'Recruitment' as ApprovalType} disabled style={{ width: '100%' }} options={[{ value: 'Recruitment', label: 'Kế hoạch tuyển dụng' }]} />
                </div>

                {isLoading ? (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} style={{ marginTop: 64 }} />
                ) : (
                    <List
                        dataSource={queue}
                        locale={{ emptyText: <Empty description='Không có yêu cầu phù hợp' /> }}
                        renderItem={(item) => {
                            const active = item.id === selectedRequestId;

                            return (
                                <div
                                    style={{
                                        padding: 16,
                                        borderBottom: '1px solid #E2E8F0',
                                        borderLeft: active ? '4px solid #1E40AF' : '4px solid transparent',
                                        background: active ? 'rgba(30,64,175,0.06)' : '#fff',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setSelectedRequestId(item.id)}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 8
                                        }}
                                    >
                                        <Tag color='blue'>Recruitment</Tag>
                                        <Tag color={getStatusColor(item.status)}>{getStatusLabel(item.status)}</Tag>
                                    </div>

                                    <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                                        <FileTextOutlined style={{ color: '#1E40AF', marginTop: 2 }} />
                                        <div>
                                            <Text strong style={{ display: 'block' }}>{item.name}</Text>
                                            <Text type='secondary' style={{ fontSize: 12 }}>{item.title}</Text>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: 12
                                        }}
                                    >
                                        <Text type='secondary'>{formatRelativeTime(item.createdAt)}</Text>
                                        {item.priority === 'High' && (
                                            <Text style={{ color: '#d97706' }}>
                                                <WarningOutlined /> Ưu tiên cao
                                            </Text>
                                        )}
                                    </div>
                                </div>
                            );
                        }}
                    />
                )}
            </Sider>

            <Content style={{ padding: 0, overflowY: 'auto', position: 'relative' }}>
                {!selectedRequest ? (
                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Empty description='Chọn một yêu cầu ở danh sách bên trái' />
                    </div>
                ) : (
                    <>
                        <div
                            style={{
                                padding: isMobile ? 12 : isLaptop ? '18px 24px' : '24px 32px',
                                background: '#fff',
                                borderBottom: '1px solid #E2E8F0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: isMobile ? 'flex-start' : 'center',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: isMobile ? 8 : 0
                            }}
                        >
                            <div>
                                <Title level={3} style={{ margin: 0 }}>
                                    {selectedRequest.name}
                                </Title>
                                <Text type='secondary'>
                                    {selectedRequest.title} • Gửi lúc {formatDateTime(selectedRequest.createdAt)}
                                </Text>
                            </div>

                            <Tag color={getStatusColor(selectedRequest.status)} style={{ borderRadius: 16 }}>
                                {getStatusLabel(selectedRequest.status)}
                            </Tag>
                        </div>

                        <div
                            style={{
                                padding: isMobile ? 12 : isLaptop ? '18px 24px' : '24px 32px',
                                paddingBottom: canTakeAction ? 180 : 24,
                                maxWidth: 1100,
                                margin: '0 auto'
                            }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={16}>
                                    <Card bordered={false} style={{ border: '1px solid #E2E8F0' }}>
                                        <Title level={5} style={{ marginTop: 0 }}>
                                            <InfoCircleOutlined style={{ color: '#1E40AF' }} /> Thông tin kế hoạch
                                        </Title>

                                        <Space direction='vertical' size={10} style={{ width: '100%' }}>
                                            <Text>
                                                <strong>Tên kế hoạch:</strong> {selectedRequest.name}
                                            </Text>
                                            <Text>
                                                <strong>Đợt tuyển dụng:</strong> {selectedRequest.title || 'N/A'}
                                            </Text>
                                            <Text>
                                                <strong>Phòng ban:</strong> {selectedRequest.department || 'N/A'}
                                            </Text>
                                            <Text>
                                                <strong>Số vị trí:</strong> {totalPositions}
                                            </Text>
                                            <Text>
                                                <strong>Dự kiến bắt đầu:</strong>{' '}
                                                {formatDateTime(
                                                    typeof selectedRequest.details?.expectedStart === 'string'
                                                        ? selectedRequest.details.expectedStart
                                                        : undefined
                                                )}
                                            </Text>
                                        </Space>
                                    </Card>
                                </Col>

                                <Col xs={24} lg={8}>
                                    <Card bordered={false} style={{ border: '1px solid #E2E8F0', height: '100%' }}>
                                        <Title level={5} style={{ marginTop: 0 }}>
                                            <DollarOutlined style={{ color: '#1E40AF' }} /> Tài chính (nếu có)
                                        </Title>

                                        <Space direction='vertical' size={10} style={{ width: '100%' }}>
                                            <Text>
                                                <strong>Ngân sách:</strong> {formatCurrency(selectedRequest.budget)}
                                            </Text>
                                            <Text>
                                                <strong>Lương đề xuất:</strong> {formatCurrency(selectedRequest.salary)}
                                            </Text>

                                            {exceedAmount !== null && exceedAmount > 0 && (
                                                <div
                                                    style={{
                                                        background: '#fff7ed',
                                                        color: '#b45309',
                                                        border: '1px solid #fed7aa',
                                                        borderRadius: 8,
                                                        padding: '8px 10px'
                                                    }}
                                                >
                                                    <WarningOutlined /> Vượt ngân sách {formatCurrency(exceedAmount)}
                                                </div>
                                            )}
                                        </Space>
                                    </Card>
                                </Col>

                                <Col span={24}>
                                    <Card bordered={false} style={{ border: '1px solid #E2E8F0' }}>
                                        <Title level={5} style={{ marginTop: 0 }}>
                                            <FileTextOutlined style={{ color: '#1E40AF' }} /> Danh sách vị trí tuyển
                                        </Title>

                                        {positions.length === 0 ? (
                                            <Empty description='Chưa có thông tin vị trí' />
                                        ) : (
                                            <Table
                                                rowKey={(_, index) => String(index)}
                                                pagination={false}
                                                dataSource={positions}
                                                columns={[
                                                    {
                                                        title: 'Vị trí',
                                                        dataIndex: 'title',
                                                        key: 'title'
                                                    },
                                                    {
                                                        title: 'Số lượng',
                                                        dataIndex: 'count',
                                                        key: 'count',
                                                        width: 120
                                                    },
                                                    {
                                                        title: 'Yêu cầu',
                                                        dataIndex: 'requirements',
                                                        key: 'requirements',
                                                        render: (value?: string) => value || '—'
                                                    }
                                                ]}
                                            />
                                        )}
                                    </Card>
                                </Col>

                                <Col span={24}>
                                    <Card bordered={false} style={{ border: '1px solid #E2E8F0' }}>
                                        <Title level={5} style={{ marginTop: 0 }}>
                                            <InfoCircleOutlined style={{ color: '#1E40AF' }} /> Giải trình
                                        </Title>

                                        <Paragraph style={{ marginBottom: 8 }}>
                                            {(selectedRequest.details?.justification as string) ||
                                                selectedRequest.notes ||
                                                'Chưa có nội dung giải trình.'}
                                        </Paragraph>

                                        <Text type='secondary'>
                                            Cập nhật gần nhất: {formatDateTime(selectedRequest.updatedAt)}
                                        </Text>
                                    </Card>
                                </Col>
                            </Row>
                        </div>

                        {canTakeAction && (
                            <div style={{ padding: isMobile ? 12 : '0 24px 24px' }}>
                                <Card bordered={false} style={{ border: '1px solid #E2E8F0', maxWidth: 1100, margin: '0 auto' }}>
                                    <Text strong>Ghi chú của giám đốc</Text>
                                    <Input.TextArea
                                        rows={2}
                                        value={directorNote}
                                        onChange={(e) => setDirectorNote(e.target.value)}
                                        placeholder='Nhập ghi chú xử lý (bắt buộc khi từ chối/chỉnh sửa)'
                                        style={{ marginTop: 8, marginBottom: 12 }}
                                    />

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: isMobile ? 'flex-start' : 'center',
                                            flexDirection: isMobile ? 'column' : 'row',
                                            gap: 10
                                        }}
                                    >
                                        <Text type='secondary'>
                                            <InfoCircleOutlined /> Thao tác này sẽ cập nhật trực tiếp trạng thái đề xuất.
                                        </Text>

                                        <Space wrap>
                                            <Button
                                                danger
                                                icon={<CloseCircleOutlined />}
                                                loading={updateApproval.isLoading}
                                                onClick={() => void runAction('Rejected')}
                                            >
                                                Từ chối
                                            </Button>
                                            <Button
                                                icon={<HistoryOutlined />}
                                                loading={updateApproval.isLoading}
                                                onClick={() => void runAction('Adjusting')}
                                            >
                                                Yêu cầu chỉnh sửa
                                            </Button>
                                            <Button
                                                type='primary'
                                                icon={<CheckCircleOutlined />}
                                                loading={updateApproval.isLoading}
                                                onClick={() => void runAction('Approved')}
                                            >
                                                Phê duyệt
                                            </Button>
                                        </Space>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </>
                )}
            </Content>
        </Layout>
    );
};
