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
  Upload,
  message,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { http } from '../../../utils/http';
import type { UploadFile } from 'antd/es/upload/interface';
import { getCompactFileLabel, getCompactLinkLabel } from '../../../utils';

const { Title, Text } = Typography;

interface ModuleContentItem {
  id: string;
  title: string;
  type: string;
  contentUrl?: string;
  metadata?: { assessmentFileUrl?: string; documentUrls?: string[] };
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
  const [documentFileList, setDocumentFileList] = useState<UploadFile[]>([]);
  const [existingDocumentUrls, setExistingDocumentUrls] = useState<string[]>([]);
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
    setDocumentFileList([]);
    setExistingDocumentUrls([]);
    setContentModalOpen(true);
  };

  const openEditContent = (content: ModuleContentItem) => {
    setEditingContent(content);
    contentForm.setFieldsValue({
      title: content.title,
      contentUrl: content.contentUrl,
      assessmentFileUrl: content.metadata?.assessmentFileUrl,
    });
    setDocumentFileList([]);
    setExistingDocumentUrls(Array.isArray(content.metadata?.documentUrls) ? content.metadata.documentUrls : []);
    setContentModalOpen(true);
  };

  const uploadDocumentFile = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const uploadResult = await http.post<{ fileName?: string; data?: { fileName?: string } }>(
      '/storage/upload',
      uploadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    const fileName = uploadResult?.fileName || uploadResult?.data?.fileName;
    if (!fileName) {
      throw new Error('Upload tài liệu thất bại');
    }

    const urlResult = await http.get<{ url?: string; data?: { url?: string } }>(`/storage/url/${encodeURIComponent(fileName)}`);
    const fileUrl = urlResult?.url || urlResult?.data?.url;
    return fileUrl || fileName;
  };

  const submitContent = async () => {
    if (!selectedModuleId) return;

    try {
      const values = await contentForm.validateFields();
      const uploadedDocumentUrls = await Promise.all(
        documentFileList
          .map((fileItem) => fileItem.originFileObj)
          .filter(Boolean)
          .map((file) => uploadDocumentFile(file as File)),
      );
      const documentUrls = Array.from(new Set([...existingDocumentUrls, ...uploadedDocumentUrls]));
      const payload = {
        moduleId: selectedModuleId,
        type: 'video',
        title: values.title,
        contentUrl: values.contentUrl,
        assessmentFileUrl: values.assessmentFileUrl,
        documentUrls,
      };

      if (editingContent) {
        await http.patch(`/training-content/contents/${editingContent.id}`, payload);
      } else {
        await http.post('/training-content/contents', payload);
      }
      message.success('Lưu bài giảng thành công');
      setContentModalOpen(false);
      setDocumentFileList([]);
      setExistingDocumentUrls([]);
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

        <Card loading={isLoading} bodyStyle={{ padding: 20 }}>
          <Form form={pathForm} layout='vertical'>
            <Row gutter={[20, 20]} align='top'>
              <Col xs={24} lg={8}>
                <div
                  style={{
                    height: '100%',
                    padding: 16,
                    border: '1px solid #eef2ff',
                    borderRadius: 12,
                    background: '#fafbff',
                  }}
                >
                  <Text strong style={{ display: 'block', marginBottom: 12 }}>
                    Chọn lộ trình
                  </Text>
                  <Space direction='vertical' size={12} style={{ width: '100%' }}>
                    <Select
                      style={{ width: '100%' }}
                      value={selectedPathId}
                      onChange={setSelectedPathId}
                      options={paths.map((path) => ({
                        value: path.id,
                        label: `${path.title} (${path.track})`,
                      }))}
                    />
                    <Button icon={<PlusOutlined />} type='primary' onClick={openCreatePath} block>
                      Thêm
                    </Button>
                  </Space>
                </div>
              </Col>
              <Col xs={24} lg={16}>
                <div
                  style={{
                    height: '100%',
                    padding: 16,
                    border: '1px solid #f1f5f9',
                    borderRadius: 12,
                    background: '#fff',
                  }}
                >
                  <Row gutter={[12, 0]}>
                    <Col xs={24} md={12} xl={10}>
                      <Form.Item label='Tên lộ trình' name='title' rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12} xl={6}>
                      <Form.Item label='Track' name='track' rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} xl={8}>
                      <Form.Item label='Mô tả' name='description'>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row justify='end' style={{ marginTop: 4 }}>
                    <Col xs={24} sm={14} md={10} xl={8}>
                      <Button
                        type='primary'
                        icon={<SaveOutlined />}
                        onClick={savePathMetadata}
                        loading={isSavingPath}
                        disabled={!selectedPathId}
                        style={{ width: '100%' }}
                      >
                        Lưu thông tin lộ trình
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={10}>
            <Card
              title={`Danh sách học phần (${modules.length})`}
              style={{ height: '100%' }}
              bodyStyle={{ minHeight: 220 }}
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
                      alignItems: 'center',
                    }}
                    actions={[
                      <Button type='text' icon={<EditOutlined />} onClick={() => openEditModule(module)} style={{ paddingInline: 6 }} />,
                      <Popconfirm
                        title='Xóa học phần này?'
                        description='Dữ liệu bài giảng trong học phần có thể bị ảnh hưởng.'
                        okText='Xóa'
                        cancelText='Hủy'
                        onConfirm={() => removeModule(module.id)}
                      >
                        <Button danger type='text' icon={<DeleteOutlined />} style={{ paddingInline: 6 }} />
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
              style={{ height: '100%' }}
              bodyStyle={{ minHeight: 220 }}
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
                        title={content.title}
                        description={
                          <Space direction='vertical' size={6} style={{ width: '100%' }}>
                            <Text type='secondary' style={{ wordBreak: 'break-all' }}>
                              Video: {content.contentUrl ? getCompactLinkLabel(content.contentUrl, 'Khong co URL') : 'Không có URL'}
                            </Text>
                            {content.metadata?.assessmentFileUrl ? (
                              <Text type='secondary' style={{ wordBreak: 'break-word' }}>
                                Đánh giá: {getCompactLinkLabel(content.metadata.assessmentFileUrl, 'Mo danh gia')}
                              </Text>
                            ) : null}
                            {Array.isArray(content.metadata?.documentUrls) && content.metadata.documentUrls.length > 0 ? (
                              <Text type='secondary'>
                                Tài liệu đính kèm:{' '}
                                {content.metadata.documentUrls
                                  .slice(0, 2)
                                  .map((url) => getCompactFileLabel(url))
                                  .join(', ')}
                                {content.metadata.documentUrls.length > 2
                                  ? ` +${content.metadata.documentUrls.length - 2} file`
                                  : ''}
                              </Text>
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
          <Form.Item label='URL link vid' name='contentUrl' rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Upload tài liệu'>
            <Upload
              multiple
              fileList={documentFileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setDocumentFileList(fileList)}
            >
              <Button>Chọn tài liệu</Button>
            </Upload>
          </Form.Item>
          <Form.Item label='URL link đánh giá' name='assessmentFileUrl'>
            <Input placeholder='Ví dụ: link Google Form/Quiz/Test đánh giá' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
