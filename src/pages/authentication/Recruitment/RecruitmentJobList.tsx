import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FilterOutlined,
    MoreOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Input,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
    Dropdown,
    MenuProps,
    Breadcrumb
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { http } from '../../../utils/http';
import { JobPosition } from '../../../services/Recruitment/jobPositions';
import { RecruitmentJobModal } from './components/RecruitmentJobModal';
import { Modal } from 'antd';

const { Title, Text } = Typography;

export const RecruitmentJobList = () => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);

    const [jobPositionsData, setJobPositionsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const params: any = {};
            if (searchText) {
                params.searcher = JSON.stringify({ keyword: searchText, field: 'title' });
            }
            if (departmentFilter !== 'All') {
                params.department = departmentFilter;
            }
            const res = await http.get('/job-positions', { params });
            setJobPositionsData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [searchText, departmentFilter]);

    const handleStatusChange = async (record: JobPosition) => {
        const currentStatus = record.status?.toLowerCase();
        const newStatus = currentStatus === 'open' ? 'closed' : 'open';

        try {
            await http.patch(`/job-positions/${record.id}`, { status: newStatus });
            Modal.success({
                title: t('common.success'),
                content: `${t('recruitment.status_change_success')} (${record.title}: ${newStatus === 'open' ? t('recruitment.status_published') : t('recruitment.status_stopped')})`,
                centered: true,
                okText: t('common.ok')
            });
            fetchJobs();
        } catch (error) {
            console.error(error);
            message.error(t('common.error'));
        }
    };

    const handleCreate = () => {
        setEditingJob(null);
        setIsViewOnly(false);
        setIsModalOpen(true);
    };

    const handleEdit = (record: JobPosition) => {
        setEditingJob(record);
        setIsViewOnly(false);
        setIsModalOpen(true);
    };

    const handleView = (record: JobPosition) => {
        setEditingJob(record);
        setIsViewOnly(true);
        setIsModalOpen(true);
    };

    const handleMenuClick = (key: string, record: JobPosition) => {
        if (key === 'view') {
            handleView(record);
        } else if (key === 'edit') {
            handleEdit(record);
        } else if (key === 'delete') {
            // ... (keep delete logic)
            Modal.confirm({
                title: t('common.delete_confirm'),
                content: `${t('common.delete_confirm_desc')} ${record.title}?`,
                onOk: () => {
                    message.success(t('common.success'));
                }
            });
        }
    };

    const getActionMenu = (record: JobPosition): MenuProps => ({
        items: [
            { key: 'view', label: t('recruitment.view_details'), icon: <EyeOutlined /> },
            { key: 'edit', label: t('common.edit'), icon: <EditOutlined /> },
            { type: 'divider' },
            { key: 'delete', label: t('common.delete'), icon: <DeleteOutlined />, danger: true }
        ],
        onClick: ({ key }) => handleMenuClick(key, record)
    });

    const columns: ColumnsType<JobPosition> = [
        {
            title: t('recruitment.job_title'),
            dataIndex: 'title',
            key: 'title',
            render: (text: any, record: any) => (
                <div>
                    <Text strong style={{ display: 'block', color: '#1E40AF' }}>
                        {text}
                    </Text>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                        {record.id}
                    </Text>
                </div>
            )
        },
        {
            title: t('recruitment.campaigns'),
            dataIndex: 'campaign',
            key: 'campaign',
            render: (text: any) => <Text style={{ fontSize: '13px' }}>{text}</Text>
        },
        {
            title: t('common.department'),
            dataIndex: 'department',
            key: 'department',
            render: (text: any) => <Tag color='blue'>{text}</Tag>
        },

        {
            title: t('recruitment.fulfillment'),
            key: 'fulfillment',
            render: (_: any, record: any) => (
                <div style={{ minWidth: '100px' }}>
                    <Text strong>{record.filled}</Text> / <Text type='secondary'>{record.required}</Text>
                    <div
                        style={{
                            width: '100%',
                            height: '4px',
                            background: '#E2E8F0',
                            marginTop: '4px',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                width: `${(record.filled / record.required) * 100}%`,
                                height: '100%',
                                background: record.filled >= record.required ? '#10B981' : '#1E40AF'
                            }}
                        />
                    </div>
                </div>
            )
        },
        {
            title: t('common.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status: any, record: JobPosition) => {
                let color = 'default';
                let label = status;
                if (status === 'Open') {
                    color = 'success';
                    label = t('recruitment.status_published');
                } else {
                    color = 'error';
                    label = t('recruitment.status_stopped');
                }

                return (
                    <Tag
                        color={color}
                        style={{ cursor: 'pointer', borderRadius: '4px', padding: '0 8px' }}
                        onClick={() => handleStatusChange(record)}
                    >
                        {label}
                    </Tag>
                );
            }
        },
        {
            title: t('recruitment.posted'),
            dataIndex: 'postedDate',
            key: 'postedDate',
            render: (text: any) => (
                <Text type='secondary' style={{ fontSize: '12px' }}>
                    {text}
                </Text>
            )
        },
        {
            title: t('common.actions'),
            key: 'action',
            width: 80,
            fixed: 'right',
            render: (_: any, record: any) => (
                <Dropdown menu={getActionMenu(record)} trigger={['click']}>
                    <Button type='text' icon={<MoreOutlined />} />
                </Dropdown>
            )
        }
    ];

    const dataSource = jobPositionsData?.data || [];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[{ title: t('menu.recruitment_management') }, { title: t('recruitment.job_management') }]}
                />
            </div>

            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
            >
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        {t('recruitment.job_management')}
                    </Title>
                    <Text type='secondary'>{t('recruitment.job_management_desc')}</Text>
                </div>
                <Button type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
                    {t('recruitment.create_job_post')}
                </Button>
            </div>

            <Card bordered={false} style={{ borderRadius: '12px' }}>
                <div
                    style={{
                        marginBottom: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}
                >
                    <Space size='middle'>
                        <Input
                            placeholder={t('recruitment.search_job_placeholder')}
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            defaultValue='All'
                            style={{ width: 160 }}
                            onChange={setDepartmentFilter}
                            options={[
                                { value: 'All', label: t('common.all_departments') },
                                { value: 'Engineering', label: 'Engineering' },
                                { value: 'Marketing', label: 'Marketing' },
                                { value: 'Design', label: 'Design' },
                                { value: 'Data', label: 'Data Science' }
                            ]}
                        />
                        <Button icon={<FilterOutlined />}>{t('common.more_filters')}</Button>
                    </Space>
                    <Space>
                        <Text type='secondary'>
                            {dataSource.length} {t('recruitment.jobs_found')}
                        </Text>
                    </Space>
                </div>

                <Table
                    columns={columns as any}
                    dataSource={dataSource}
                    scroll={{ x: 'max-content' }}
                    loading={isLoading}
                    pagination={{
                        total: jobPositionsData?.pagination?.totalRows || 0,
                        pageSize: 10
                    }}
                    rowKey='id'
                />
            </Card>

            <RecruitmentJobModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchJobs();
                }}
                initialValues={editingJob}
                viewOnly={isViewOnly}
            />
        </div>
    );
};
