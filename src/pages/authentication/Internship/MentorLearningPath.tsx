import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, List, Modal, Row, Select, Space, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { http } from '../../../utils/http';

const { Title, Text } = Typography;

interface ModuleContentItem {
  id: string;
  title: string;
  type: string;
  contentUrl?: string;
  metadata?: { durationMinutes?: number };
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
  const [selectedPath, setSelectedPath] = useState<LearningPathItem | null>(null);

  const [modules, setModules] = useState<LearningModuleItem[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPath, setIsSavingPath] = useState(false);

  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<LearningModuleItem | null>(null);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ModuleContentItem | null>(null);

  const [pathForm] = Form.useForm();
  const [moduleForm] = Form.useForm();
  const [contentForm] = Form.useForm();

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

      const nextId = selectedPathId || records[0]?.id;
      if (nextId) {
        setSelectedPathId(nextId);
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
      setSelectedPath(detail);
      setModules((detail?.modules || []).sort((a: LearningModuleItem, b: LearningModuleItem) => a.orderIndex - b.orderIndex));
      setSelectedModuleId((detail?.modules || [])[0]?.id || '');

      pathForm.setFieldsValue({
        title: detail?.title,
        track: detail?.track,
        description: detail?.description,
      });
    } catch {
      message.error('Không tải được chi tiết lộ trình đào tạo');
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
    } catch {
      message.error('Không thể lưu học phần');
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
    } catch {
      message.error('Không thể lưu bài giảng');
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
            <Col span={8}>
              <Text strong>Chọn lộ trình</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                value={selectedPathId}
                onChange={setSelectedPathId}
                options={paths.map((path) => ({
                  value: path.id,
                  label: `${path.title} (${path.track})`,
                }))}
              />
            </Col>
            <Col span={16}>
              <Form form={pathForm} layout='vertical'>
                <Row gutter={12}>
                  <Col span={10}>
                    <Form.Item label='Tên lộ trình' name='title' rules={[{ required: true, message: 'Bắt buộc' }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label='Track' name='track' rules={[{ required: true, message: 'Bắt buộc' }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='Mô tả' name='description'>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Button type='primary' icon={<SaveOutlined />} onClick={savePathMetadata} loading={isSavingPath}>
                  Lưu thông tin lộ trình
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          <Col span={10}>
            <Card
              title='Danh sách học phần'
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
                      <Button size='small' onClick={() => moveModule(module.id, 'up')} disabled={index === 0}>
                        Up
                      </Button>,
                      <Button size='small' onClick={() => moveModule(module.id, 'down')} disabled={index === modules.length - 1}>
                        Down
                      </Button>,
                      <Button type='text' icon={<EditOutlined />} onClick={() => openEditModule(module)} />,
                      <Button danger type='text' icon={<DeleteOutlined />} onClick={() => removeModule(module.id)} />,
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

          <Col span={14}>
            <Card
              title={selectedModule ? `Bài giảng của: ${selectedModule.title}` : 'Bài giảng'}
              extra={
                <Button icon={<PlusOutlined />} type='primary' onClick={openCreateContent} disabled={!selectedModuleId}>
                  Thêm bài giảng
                </Button>
              }
              loading={isLoading}
            >
              <List
                dataSource={selectedModule?.contents || []}
                locale={{ emptyText: 'Chưa có bài giảng trong học phần này' }}
                renderItem={(content) => (
                  <List.Item
                    actions={[
                      <Button type='text' icon={<EditOutlined />} onClick={() => openEditContent(content)} />,
                      <Button danger type='text' icon={<DeleteOutlined />} onClick={() => removeContent(content.id)} />,
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
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Space>

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
            <Input type='number' min={1} />
          </Form.Item>
          <Form.Item label='Điểm qua môn' name='passingScore' initialValue={80}>
            <Input type='number' min={0} max={100} />
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
            <Input type='number' min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
