import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { http } from '../../../utils/http';

const { Title, Text } = Typography;

interface ModuleContentItem {
  id: string;
  title: string;
  type: string;
  contentUrl?: string;
  metadata?: { durationMinutes?: number; assessmentFileUrl?: string };
}

interface LearningModuleItem {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  contents?: ModuleContentItem[];
}

interface LearningPathItem {
  id: string;
  title: string;
  track: string;
  description?: string;
}

export const MentorLearningPath = () => {
  const [paths, setPaths] = useState<LearningPathItem[]>([]);
  const [selectedPathId, setSelectedPathId] = useState<string>('');

  const [modules, setModules] = useState<LearningModuleItem[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPath, setIsSavingPath] = useState(false);
  const [isCreatingPath, setIsCreatingPath] = useState(false);

  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<LearningModuleItem | null>(null);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ModuleContentItem | null>(null);
  const [pathModalOpen, setPathModalOpen] = useState(false);

  const [pathForm] = Form.useForm();
  const [moduleForm] = Form.useForm();
  const [contentForm] = Form.useForm();
  const [createPathForm] = Form.useForm();

  const selectedModule = useMemo(
    () => modules.find((module) => module.id === selectedModuleId) || null,
    [modules, selectedModuleId],
  );

  const loadPaths = async () => {
    setIsLoading(true);
    try {
      const res = await http.get<{ hits?: LearningPathItem[]; data?: LearningPathItem[] }>('/learning-paths');
      const records = res?.hits || res?.data || [];
      setPaths(records);

      const hasCurrentPath = records.some((path) => path.id === selectedPathId);
      const nextId = hasCurrentPath ? selectedPathId : records[0]?.id;
      if (nextId) {
        setSelectedPathId(nextId);
      } else {
        setSelectedPathId('');
        setModules([]);
        setSelectedModuleId('');
        pathForm.resetFields();
      }
    } catch {
      message.error('Không tải được danh sách lộ trình đào tạo');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPathDetail = async (pathId: string) => {
    if (!pathId) return;
    setIsLoading(true);
    try {
      const detail = await http.get<any>(`/learning-paths/${pathId}`);
      setModules((detail?.modules || []).sort((a: LearningModuleItem, b: LearningModuleItem) => a.orderIndex - b.orderIndex));
      setSelectedModuleId((detail?.modules || [])[0]?.id || '');

      pathForm.setFieldsValue({
        title: detail?.title,
        track: detail?.track,
        description: detail?.description,
      });
    } catch {
      message.error('Không tải được chi tiết lộ trình đào tạo');
      setModules([]);
      setSelectedModuleId('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPaths();
  }, []);

  useEffect(() => {
    if (!selectedPathId) return;
    loadPathDetail(selectedPathId);
  }, [selectedPathId]);

  const savePathMetadata = async () => {
    if (!selectedPathId) return;
    try {
      const values = await pathForm.validateFields();
      setIsSavingPath(true);
      await http.patch(`/learning-paths/${selectedPathId}`, values);
      message.success('Cập nhật thông tin lộ trình thành công');
      await loadPaths();
      await loadPathDetail(selectedPathId);
    } catch {
      message.error('Không thể cập nhật lộ trình');
    } finally {
      setIsSavingPath(false);
    }
  };

  const openCreatePath = () => {
    createPathForm.resetFields();
    setPathModalOpen(true);
  };

  const submitCreatePath = async () => {
    try {
      const values = await createPathForm.validateFields();
      setIsCreatingPath(true);
      const created = await http.post<{ id?: string; data?: { id?: string } }>('/learning-paths', values);
      const createdId = created?.id || created?.data?.id;

      message.success('Tạo lộ trình đào tạo thành công');
      setPathModalOpen(false);
      await loadPaths();

      if (createdId) {
        setSelectedPathId(createdId);
      }
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('Không thể tạo lộ trình đào tạo');
      }
    } finally {
      setIsCreatingPath(false);
    }
  };

  const openCreateModule = () => {
    setEditingModule(null);
    moduleForm.resetFields();
    moduleForm.setFieldValue('orderIndex', modules.length + 1);
    setModuleModalOpen(true);
  };

  const openEditModule = (module: LearningModuleItem) => {
    setEditingModule(module);
    moduleForm.setFieldsValue(module);
    setModuleModalOpen(true);
  };

  const submitModule = async () => {
    if (!selectedPathId) return;

    try {
      const values = await moduleForm.validateFields();
      if (editingModule) {
        await http.patch(`/modules/${editingModule.id}`, { ...values, learningPathId: selectedPathId });
      } else {
        await http.post('/modules', { ...values, learningPathId: selectedPathId });
      }

      message.success('Lưu học phần thành công');
      setModuleModalOpen(false);
      await loadPathDetail(selectedPathId);
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('Không thể lưu học phần');
      }
    }
  };

  const removeModule = async (moduleId: string) => {
    try {
      await http.delete(`/modules/${moduleId}`);
      message.success('Đã xóa học phần');
      await loadPathDetail(selectedPathId);
    } catch {
      message.error('Không thể xóa học phần');
    }
  };

  const moveModule = async (moduleId: string, direction: 'up' | 'down') => {
    const currentIndex = modules.findIndex((module) => module.id === moduleId);
    if (currentIndex < 0) return;

    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0 || nextIndex >= modules.length) return;

    const reordered = [...modules];
    const [item] = reordered.splice(currentIndex, 1);
    reordered.splice(nextIndex, 0, item);

    const payload = reordered.map((module, index) => ({
      id: module.id,
      orderIndex: index + 1,
    }));

    try {
      await http.put(`/modules/learning-path/${selectedPathId}/order`, { modules: payload });
      setModules(
        reordered.map((module, index) => ({
          ...module,
          orderIndex: index + 1,
        })),
      );
      message.success('Đã cập nhật thứ tự học phần');
    } catch {
      message.error('Không thể cập nhật thứ tự học phần');
    }
  };

  const openCreateContent = () => {
    setEditingContent(null);
    contentForm.resetFields();
    contentForm.setFieldValue('type', 'video');
    setContentModalOpen(true);
  };

  const openEditContent = (content: ModuleContentItem) => {
    setEditingContent(content);
    contentForm.setFieldsValue({
      title: content.title,
      type: content.type,
      contentUrl: content.contentUrl,
      durationMinutes: content.metadata?.durationMinutes,
      assessmentFileUrl: content.metadata?.assessmentFileUrl,
    });
    setContentModalOpen(true);
  };

  const submitContent = async () => {
    if (!selectedModuleId) return;

    try {
      const values = await contentForm.validateFields();
      if (editingContent) {
        await http.patch(`/training-content/contents/${editingContent.id}`, { ...values, moduleId: selectedModuleId });
      } else {
        await http.post('/training-content/contents', { ...values, moduleId: selectedModuleId });
      }
      message.success('Lưu bài giảng thành công');
      setContentModalOpen(false);
      await loadPathDetail(selectedPathId);
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('Không thể lưu bài giảng');
      }
    }
  };

  const removeContent = async (contentId: string) => {
    try {
      await http.delete(`/training-content/contents/${contentId}`);
      message.success('Đã xóa bài giảng');
      await loadPathDetail(selectedPathId);
    } catch {
      message.error('Không thể xóa bài giảng');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Space direction='vertical' style={{ width: '100%' }} size={16}>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý lộ trình đào tạo
        </Title>

        <Card loading={isLoading}>
          <Row gutter={16}>
            <Col xs={24} md={10} lg={8}>
              <Text strong>Chọn lộ trình</Text>
              <Space.Compact style={{ width: '100%', marginTop: 8 }}>
                <Select
                  style={{ width: '100%' }}
                  value={selectedPathId}
                  onChange={setSelectedPathId}
                  options={paths.map((path) => ({
                    value: path.id,
                    label: `${path.title} (${path.track})`,
                  }))}
                />
                <Button icon={<PlusOutlined />} type='primary' onClick={openCreatePath}>
                  Thêm
                </Button>
              </Space.Compact>
            </Col>
            <Col xs={24} md={14} lg={16}>
              <Form form={pathForm} layout='vertical'>
                <Row gutter={12}>
                  <Col xs={24} md={10}>
                    <Form.Item label='Tên lộ trình' name='title' rules={[{ required: true, message: 'Bắt buộc' }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item label='Track' name='track' rules={[{ required: true, message: 'Bắt buộc' }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label='Mô tả' name='description'>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Button
                  type='primary'
                  icon={<SaveOutlined />}
                  onClick={savePathMetadata}
                  loading={isSavingPath}
                  disabled={!selectedPathId}
                >
                  Lưu thông tin lộ trình
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          <Col xs={24} lg={10}>
            <Card
              title={`Danh sách học phần (${modules.length})`}
              extra={
                <Button icon={<PlusOutlined />} type='primary' onClick={openCreateModule} disabled={!selectedPathId}>
                  Thêm học phần
                </Button>
              }
              loading={isLoading}
            >
              <List
                dataSource={modules}
                locale={{ emptyText: 'Chưa có học phần' }}
                renderItem={(module, index) => (
                  <List.Item
                    onClick={() => setSelectedModuleId(module.id)}
                    style={{
                      cursor: 'pointer',
                      background: selectedModuleId === module.id ? '#f0f5ff' : 'transparent',
                      borderRadius: 8,
                      paddingLeft: 12,
                    }}
                    actions={[
                      <Button type='text' icon={<EditOutlined />} onClick={() => openEditModule(module)} />,
                      <Popconfirm
                        title='Xóa học phần này?'
                        description='Dữ liệu bài giảng trong học phần có thể bị ảnh hưởng.'
                        okText='Xóa'
                        cancelText='Hủy'
                        onConfirm={() => removeModule(module.id)}
                      >
                        <Button danger type='text' icon={<DeleteOutlined />} />
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      title={`#${module.orderIndex} - ${module.title}`}
                      description={module.description || 'Không có mô tả'}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card
              title={selectedModule ? `Bài giảng của: ${selectedModule.title}` : 'Bài giảng'}
              extra={
                <Button icon={<PlusOutlined />} type='primary' onClick={openCreateContent} disabled={!selectedModuleId}>
                  Thêm bài giảng
                </Button>
              }
              loading={isLoading}
            >
              {!selectedModule ? (
                <Empty description='Hãy chọn học phần để quản lý bài giảng' />
              ) : (
                <List
                  dataSource={selectedModule.contents || []}
                  locale={{ emptyText: 'Chưa có bài giảng trong học phần này' }}
                  renderItem={(content) => (
                    <List.Item
                      actions={[
                        <Button type='text' icon={<EditOutlined />} onClick={() => openEditContent(content)} />,
                        <Popconfirm
                          title='Xóa bài giảng này?'
                          okText='Xóa'
                          cancelText='Hủy'
                          onConfirm={() => removeContent(content.id)}
                        >
                          <Button danger type='text' icon={<DeleteOutlined />} />
                        </Popconfirm>,
                      ]}
                    >
                      <List.Item.Meta
                        title={`${content.title} (${content.type})`}
                        description={
                          <Space direction='vertical' size={2}>
                            <Text type='secondary'>{content.contentUrl || 'Không có URL'}</Text>
                            {content.metadata?.durationMinutes ? (
                              <Text type='secondary'>Thời lượng: {content.metadata.durationMinutes} phút</Text>
                            ) : null}
                            {content.metadata?.assessmentFileUrl ? (
                              <Text type='secondary'>File đánh giá: {content.metadata.assessmentFileUrl}</Text>
                            ) : null}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Space>

      <Modal
        title='Thêm lộ trình đào tạo'
        open={pathModalOpen}
        onCancel={() => setPathModalOpen(false)}
        onOk={submitCreatePath}
        confirmLoading={isCreatingPath}
        destroyOnClose
      >
        <Form form={createPathForm} layout='vertical'>
          <Form.Item label='Tên lộ trình' name='title' rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input placeholder='Ví dụ: Lộ trình Backend' />
          </Form.Item>
          <Form.Item label='Track' name='track' rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input placeholder='Ví dụ: Backend Development' />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea rows={3} placeholder='Mô tả ngắn về mục tiêu đào tạo' />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingModule ? 'Cập nhật học phần' : 'Thêm học phần'}
        open={moduleModalOpen}
        onCancel={() => setModuleModalOpen(false)}
        onOk={submitModule}
        destroyOnClose
      >
        <Form form={moduleForm} layout='vertical'>
          <Form.Item label='Tên học phần' name='title' rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label='Thứ tự' name='orderIndex' rules={[{ required: true, message: 'Bắt buộc' }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item label='Điểm qua môn' name='passingScore' initialValue={80}>
            <InputNumber style={{ width: '100%' }} min={0} max={100} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingContent ? 'Cập nhật bài giảng' : 'Thêm bài giảng'}
        open={contentModalOpen}
        onCancel={() => setContentModalOpen(false)}
        onOk={submitContent}
        destroyOnClose
      >
        <Form form={contentForm} layout='vertical'>
          <Form.Item label='Tên bài giảng' name='title' rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Loại nội dung' name='type' rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Select
              options={[
                { value: 'video', label: 'Video' },
                { value: 'document', label: 'Document' },
                { value: 'file', label: 'File' },
              ]}
            />
          </Form.Item>
          <Form.Item label='URL nội dung' name='contentUrl' rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Thời lượng (phút)' name='durationMinutes'>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label='File bài đánh giá (URL)' name='assessmentFileUrl'>
            <Input placeholder='Ví dụ: link Google Drive/PDF/Doc cho bài đánh giá' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
