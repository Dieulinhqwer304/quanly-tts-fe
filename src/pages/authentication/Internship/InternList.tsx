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
    Tooltip
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RouteConfig } from '../../../constants';
import { http } from '../../../utils/http';
import { getProfile } from '../../../services/auth/profile';

import { InternModal } from './components/InternModal';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const InternList = () => {
    // ... (rest of the component)
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIntern, setEditingIntern] = useState<any>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [currentRole, setCurrentRole] = useState<string>('');

    const [internsData, setInternsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchInterns = async () => {
        setIsLoading(true);
        try {
            const params: any = {};
            if (searchText) {
                params.searcher = JSON.stringify({ keyword: searchText, field: 'fullName' });
            }
            if (statusFilter !== 'All') {
                params.status = statusFilter;
            }
            const res = await http.get('/interns', { params });
            setInternsData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInterns();
    }, [searchText, statusFilter]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                const profileData = (response as any)?.data || {};
                const roleFromSingleField = String(profileData.role || '').toLowerCase();
                const roleFromRolesArray = Array.isArray(profileData.roles)
                    ? String(profileData.roles[0]?.name || '').toLowerCase()
                    : '';
                setCurrentRole(roleFromSingleField || roleFromRolesArray);
            } catch {
                setCurrentRole('');
            }
        };

        void fetchProfile();
    }, []);

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

    const isMentorModule = location.pathname.startsWith('/training/mentor');
    const isMentorRole = currentRole === 'mentor';
    const canManageInterns = currentRole === 'admin' || currentRole === 'super_admin';
    const isMentorView = isMentorModule || isMentorRole;
    const dataSource = internsData?.hits || internsData?.data || [];

    return (
        <div style={{ padding: '24px' }}>
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
                        {isMentorView ? t('menu.evaluations') : t('internship.management')}
                    </Title>
                    <Text type='secondary'>
                        {isMentorView ? t('internship.eval_desc') : t('internship.management_desc')}
                    </Text>
                </div>
                <Space>
                    {canManageInterns && (
                        <Button icon={<PlusOutlined />} type='primary' onClick={handleCreate}>
                            {t('internship.add_intern')}
                        </Button>
                    )}
                    {/* <Button>{t('internship.export_list')}</Button> */}
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
                            { value: 'active', label: t('internship.active') },
                            { value: 'completed', label: t('internship.completed') },
                            { value: 'terminated', label: t('internship.dropped') },
                            { value: 'on_hold', label: t('internship.on_hold') }
                        ]}
                    />
                </div>

                <Table
                    scroll={{ x: 'max-content' }}
                    columns={
                        [
                            {
                                title: t('internship.intern_info'),
                                dataIndex: 'user',
                                key: 'user',
                                render: (user: any, record: any) => (
                                    <Space size='middle'>
                                        <Avatar size={40} src={user?.avatarUrl} icon={<UserOutlined />} />
                                        <div>
                                            <Text strong style={{ display: 'block' }}>
                                                {user?.fullName}
                                            </Text>
                                            <Text type='secondary' style={{ fontSize: '12px' }}>
                                                {record.code || record.id}
                                            </Text>
                                        </div>
                                    </Space>
                                )
                            },
                            !isMentorView
                                ? {
                                      title: t('internship.contact'),
                                      key: 'contact',
                                      render: (_: any, record: any) => (
                                          <div>
                                              <div
                                                  style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: '4px',
                                                      fontSize: '13px'
                                                  }}
                                              >
                                                  <MailOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />{' '}
                                                  {record.user?.email}
                                              </div>
                                              <div
                                                  style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: '4px',
                                                      fontSize: '13px'
                                                  }}
                                              >
                                                  <PhoneOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />{' '}
                                                  {record.user?.phone}
                                              </div>
                                          </div>
                                      )
                                  }
                                : null,
                            {
                                title: t('internship.track_mentor'),
                                key: 'track',
                                render: (_: any, record: any) => (
                                    <div>
                                        <Tag color='purple'>{record.track}</Tag>
                                        <div style={{ marginTop: '4px', fontSize: '12px' }}>
                                            <Text type='secondary'>Mentor: </Text>
                                            <Text strong>{record.mentor?.fullName || 'TBD'}</Text>
                                        </div>
                                    </div>
                                )
                            },
                            !isMentorView
                                ? {
                                      title: t('internship.duration'),
                                      key: 'duration',
                                      render: (_: any, record: any) => (
                                          <div style={{ fontSize: '13px' }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                  <CalendarOutlined style={{ color: '#8c8c8c' }} /> {record.startDate}
                                              </div>
                                              <Text type='secondary' style={{ fontSize: '11px', paddingLeft: '18px' }}>
                                                  {t('internship.to')} {record.endDate}
                                              </Text>
                                          </div>
                                      )
                                  }
                                : null,
                            isMentorView
                                ? {
                                      title: 'GĐ 1 (Thử việc)',
                                      key: 'eval_phase1',
                                      render: (_: any, record: any) => {
                                          const e = record.evaluations?.find((x: any) => x.type === 'Probation');
                                          if (e) {
                                              return (
                                                  <div
                                                      onClick={() =>
                                                          navigate(RouteConfig.MentorEvaluation.getPath(record.id))
                                                      }
                                                      style={{ cursor: 'pointer' }}
                                                  >
                                                      <Text strong style={{ color: '#1E40AF' }}>
                                                          {e.overallScore}/10
                                                      </Text>
                                                      <br />
                                                      <Text type='secondary' style={{ fontSize: '11px' }}>
                                                          {new Date(e.evaluationDate).toLocaleDateString('vi-VN')}
                                                      </Text>
                                                  </div>
                                              );
                                          }
                                          return (
                                              <Button
                                                  size='small'
                                                  type='dashed'
                                                  onClick={() =>
                                                      navigate(RouteConfig.MentorEvaluation.getPath(record.id))
                                                  }
                                              >
                                                  Đánh giá
                                              </Button>
                                          );
                                      }
                                  }
                                : null,
                            isMentorView
                                ? {
                                      title: 'GĐ 2 (Dự án)',
                                      key: 'eval_phase2',
                                      render: (_: any, record: any) => {
                                          const e = record.evaluations?.find((x: any) => x.type === 'Mid-term');
                                          if (e) {
                                              return (
                                                  <div
                                                      onClick={() =>
                                                          navigate(RouteConfig.MentorEvaluation.getPath(record.id))
                                                      }
                                                      style={{ cursor: 'pointer' }}
                                                  >
                                                      <Text strong style={{ color: '#059669' }}>
                                                          {e.overallScore}/10
                                                      </Text>
                                                      <br />
                                                      <Text type='secondary' style={{ fontSize: '11px' }}>
                                                          {new Date(e.evaluationDate).toLocaleDateString('vi-VN')}
                                                      </Text>
                                                  </div>
                                              );
                                          }
                                          return (
                                              <Button
                                                  size='small'
                                                  type='dashed'
                                                  onClick={() =>
                                                      navigate(RouteConfig.MentorEvaluation.getPath(record.id))
                                                  }
                                              >
                                                  Đánh giá
                                              </Button>
                                          );
                                      }
                                  }
                                : null,
                            isMentorView
                                ? {
                                      title: 'GĐ Cuối',
                                      key: 'eval_final',
                                      render: (_: any, record: any) => {
                                          const e = record.evaluations?.find((x: any) => x.type === 'Final');
                                          if (e) {
                                              return (
                                                  <div
                                                      onClick={() =>
                                                          navigate(RouteConfig.MentorEvaluation.getPath(record.id))
                                                      }
                                                      style={{ cursor: 'pointer' }}
                                                  >
                                                      <Text strong style={{ color: '#D97706' }}>
                                                          {e.overallScore}/10
                                                      </Text>
                                                      <br />
                                                      <Text type='secondary' style={{ fontSize: '11px' }}>
                                                          {new Date(e.evaluationDate).toLocaleDateString('vi-VN')}
                                                      </Text>
                                                  </div>
                                              );
                                          }
                                          return (
                                              <Button
                                                  size='small'
                                                  type='dashed'
                                                  onClick={() =>
                                                      navigate(RouteConfig.MentorEvaluation.getPath(record.id))
                                                  }
                                              >
                                                  Đánh giá
                                              </Button>
                                          );
                                      }
                                  }
                                : null,
                            !isMentorView
                                ? {
                                      title: t('common.status'),
                                      dataIndex: 'status',
                                      key: 'status',
                                      render: (status: string) => {
                                          let color = 'processing';
                                          let label = status;
                                          if (status === 'active') {
                                              color = 'processing';
                                              label = t('internship.active');
                                          } else if (status === 'completed') {
                                              color = 'success';
                                              label = t('internship.completed');
                                          } else if (status === 'terminated') {
                                              color = 'error';
                                              label = t('internship.dropped');
                                          } else if (status === 'on_hold') {
                                              color = 'warning';
                                              label = t('internship.on_hold');
                                          }
                                          return (
                                              <Tag color={color} style={{ borderRadius: '10px' }}>
                                                  {label}
                                              </Tag>
                                          );
                                      }
                                  }
                                : null,
                            {
                                title: t('common.actions'),
                                key: 'action',
                                width: 100,
                                fixed: 'right',
                                render: (_: any, record: any) => (
                                    <Space>
                                        <Tooltip title={t('common.view')}>
                                            <Button
                                                type='text'
                                                icon={<EyeOutlined />}
                                                onClick={() => handleView(record)}
                                            />
                                        </Tooltip>
                                        {isMentorView && (
                                            <Tooltip title={t('menu.evaluations')}>
                                                <Button
                                                    type='text'
                                                    icon={<StarOutlined style={{ color: '#F59E0B' }} />}
                                                    onClick={() =>
                                                        navigate(RouteConfig.MentorEvaluation.getPath(record.id))
                                                    }
                                                />
                                            </Tooltip>
                                        )}
                                        {canManageInterns && (
                                            <Tooltip title={t('common.edit')}>
                                                <Button
                                                    type='text'
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEdit(record)}
                                                />
                                            </Tooltip>
                                        )}
                                    </Space>
                                )
                            }
                        ].filter(Boolean) as any[]
                    }
                    dataSource={dataSource}
                    loading={isLoading}
                    pagination={{
                        total: internsData?.pagination?.totalRows || 0,
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
                    fetchInterns();
                }}
                initialValues={editingIntern}
                viewOnly={isViewOnly}
            />
        </div>
    );
};
