import {
    SearchOutlined,
    EditOutlined,
    EyeOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    StarOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Input,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
    Breadcrumb,
    Progress,
    Tooltip
} from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInterns } from '../../../hooks/Internship/useInterns';
import { RouteConfig } from '../../../constants';

import { InternModal } from './components/InternModal';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const InternList = () => {
    // ... (rest of the component)
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIntern, setEditingIntern] = useState<any>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);

    const {
        data: internsData,
        isLoading,
        refetch
    } = useInterns({
        search: searchText,
        status: statusFilter
    });

    const handleCreate = () => {
        setEditingIntern(null);
        setIsViewOnly(false);
        setIsModalOpen(true);
    };

    const handleEdit = (record: any) => {
        setEditingIntern(record);
        setIsViewOnly(false);
        setIsModalOpen(true);
    };

    const handleView = (record: any) => {
        setEditingIntern(record);
        setIsViewOnly(true);
        setIsModalOpen(true);
    };

    const dataSource = internsData?.data?.hits || [];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[{ title: t('menu.recruitment_management') }, { title: t('internship.intern_list') }]}
                />
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}
            >
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        {t('internship.management')}
                    </Title>
                    <Text type='secondary'>{t('internship.management_desc')}</Text>
                </div>
                <Space>
                    <Button icon={<PlusOutlined />} type='primary' onClick={handleCreate}>
                        {t('internship.add_intern')}
                    </Button>
                    <Button>{t('internship.export_list')}</Button>
                </Space>
            </div>

            <Card bordered={false} style={{ borderRadius: '12px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                    <Input
                        placeholder={t('internship.search_placeholder')}
                        prefix={<SearchOutlined />}
                        style={{ width: 350 }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        defaultValue='All'
                        style={{ width: 160 }}
                        onChange={setStatusFilter}
                        options={[
                            { value: 'All', label: t('internship.all_statuses') },
                            { value: 'Active', label: t('internship.active') },
                            { value: 'Completed', label: t('internship.completed') },
                            { value: 'Dropped', label: t('internship.dropped') }
                        ]}
                    />
                </div>

                <Table
                    columns={[
                        {
                            title: t('internship.intern_info'),
                            dataIndex: ['user', 'fullName'],
                            key: 'name',
                            render: (text, record: any) => (
                                <Space size='middle'>
                                    <Avatar size={40} src={record.user?.avatarUrl} icon={<UserOutlined />} />
                                    <div>
                                        <Text strong style={{ display: 'block' }}>
                                            {text}
                                        </Text>
                                        <Text type='secondary' style={{ fontSize: '12px' }}>
                                            {record.code}
                                        </Text>
                                    </div>
                                </Space>
                            )
                        },
                        {
                            title: t('internship.contact'),
                            key: 'contact',
                            render: (_, record: any) => (
                                <div>
                                    <div
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                                    >
                                        <MailOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />{' '}
                                        {record.user?.email}
                                    </div>
                                    <div
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                                    >
                                        <PhoneOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />{' '}
                                        {record.user?.phone}
                                    </div>
                                </div>
                            )
                        },
                        {
                            title: t('internship.track_mentor'),
                            key: 'track',
                            render: (_, record: any) => (
                                <div>
                                    <Tag color='purple'>{record.track}</Tag>
                                    <div style={{ marginTop: '4px', fontSize: '12px' }}>
                                        <Text type='secondary'>Mentor: </Text>
                                        <Text strong>{record.mentor?.fullName || 'N/A'}</Text>
                                    </div>
                                </div>
                            )
                        },
                        {
                            title: t('internship.duration'),
                            key: 'duration',
                            render: (_, record: any) => (
                                <div style={{ fontSize: '13px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CalendarOutlined style={{ color: '#8c8c8c' }} /> {record.startDate}
                                    </div>
                                    <Text type='secondary' style={{ fontSize: '11px', paddingLeft: '18px' }}>
                                        {t('internship.to')} {record.endDate}
                                    </Text>
                                </div>
                            )
                        },
                        {
                            title: t('internship.progress'),
                            dataIndex: 'overallProgress',
                            key: 'progress',
                            width: 180,
                            render: (progress) => (
                                <div style={{ width: '100%' }}>
                                    <Progress percent={progress} size='small' strokeColor='#136dec' />
                                </div>
                            )
                        },
                        {
                            title: t('common.status'),
                            dataIndex: 'status',
                            key: 'status',
                            render: (status) => {
                                let color = 'processing' as any;
                                if (status === 'Completed') color = 'success';
                                if (status === 'Dropped') color = 'error';
                                return (
                                    <Tag color={color} style={{ borderRadius: '10px' }}>
                                        {status}
                                    </Tag>
                                );
                            }
                        },
                        {
                            title: t('common.actions'),
                            key: 'action',
                            render: (_, record: any) => (
                                <Space>
                                    <Tooltip title={t('common.view')}>
                                        <Button type='text' icon={<EyeOutlined />} onClick={() => handleView(record)} />
                                    </Tooltip>
                                    <Tooltip title={t('menu.evaluations')}>
                                        <Button
                                            type='text'
                                            icon={<StarOutlined style={{ color: '#faad14' }} />}
                                            onClick={() => navigate(RouteConfig.MentorEvaluation.getPath(record.id))}
                                        />
                                    </Tooltip>
                                    <Tooltip title={t('common.edit')}>
                                        <Button
                                            type='text'
                                            icon={<EditOutlined />}
                                            onClick={() => handleEdit(record)}
                                        />
                                    </Tooltip>
                                </Space>
                            )
                        }
                    ]}
                    dataSource={dataSource}
                    loading={isLoading}
                    pagination={{
                        total: internsData?.data?.pagination?.totalRows || 0,
                        showTotal: (total, range) =>
                            `${t('common.showing')} ${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('internship.interns')}`,
                        pageSize: 10
                    }}
                    rowKey='id'
                />
            </Card>

            <InternModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    refetch();
                }}
                initialValues={editingIntern}
                viewOnly={isViewOnly}
            />
        </div>
    );
};
