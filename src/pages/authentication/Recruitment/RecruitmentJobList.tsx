import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FilterOutlined
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
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJobPositions } from '../../../hooks/Recruitment/useJobPositions';
import { JobPosition } from '../../../services/Recruitment/jobPositions';

const { Title, Text } = Typography;

export const RecruitmentJobList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All');

    const { data: jobPositionsData, isLoading } = useJobPositions({
        searcher: searchText ? { keyword: searchText, field: 'title' } : undefined,
        department: departmentFilter !== 'All' ? departmentFilter : undefined
    });

    const handleMenuClick = (key: string, record: JobPosition) => {
        if (key === 'view') {
            message.info(`Viewing ${record.title}`);
        } else if (key === 'edit') {
            message.info(`Editing ${record.title}`);
        } else if (key === 'delete') {
            message.warning(`Deleted ${record.title}`);
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
                    <Text strong style={{ display: 'block', color: '#136dec' }}>
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
            title: t('recruitment.level'),
            dataIndex: 'level',
            key: 'level'
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
                            background: '#f0f0f0',
                            marginTop: '4px',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                width: `${(record.filled / record.required) * 100}%`,
                                height: '100%',
                                background: record.filled >= record.required ? '#52c41a' : '#1890ff'
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
            render: (status: any) => {
                let color = 'default';
                let label = status;
                if (status === 'Open') {
                    color = 'success';
                    label = t('common.open');
                }
                if (status === 'On Hold') {
                    color = 'warning';
                    label = t('recruitment.on_hold');
                }
                if (status === 'Closed') {
                    color = 'error';
                    label = t('common.closed');
                }
                return <Tag color={color}>{label}</Tag>;
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
            render: (_: any, record: any) => (
                <Dropdown menu={getActionMenu(record)} trigger={['click']}>
                    <Button type='text' icon={<EditOutlined />} />
                </Dropdown>
            )
        }
    ];

    const dataSource = jobPositionsData?.data?.hits || [];

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
                <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => navigate(RouteConfig.RecruitmentPlanCreate.path)}
                >
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
                    columns={columns}
                    dataSource={dataSource}
                    loading={isLoading}
                    pagination={{
                        total: jobPositionsData?.data?.pagination?.totalRows || 0,
                        pageSize: 10
                    }}
                    rowKey='id'
                />
            </Card>
        </div>
    );
};
