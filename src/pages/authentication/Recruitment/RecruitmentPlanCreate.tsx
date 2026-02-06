import {
    LeftOutlined,
    SaveOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    Typography,
    message,
    Breadcrumb,
    Divider
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { RouteConfig } from '../../../constants';
import { useState } from 'react';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const RecruitmentPlanCreate = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        setLoading(true);
        console.log('Form values:', values);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            message.success('Recruitment plan created successfully!');
            navigate(RouteConfig.RecruitmentPlanList.path);
        }, 1500);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    items={[
                        { title: 'Recruitment', onClick: () => navigate(RouteConfig.RecruitmentPlanList.path) },
                        { title: 'Plans', onClick: () => navigate(RouteConfig.RecruitmentPlanList.path) },
                        { title: 'Create New Plan' },
                    ]}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Space align="center">
                    <Button
                        icon={<LeftOutlined />}
                        onClick={() => navigate(RouteConfig.RecruitmentPlanList.path)}
                        type="text"
                    />
                    <Title level={3} style={{ margin: 0 }}>Create New Recruitment Plan</Title>
                </Space>
                <Space>
                    <Button onClick={() => navigate(RouteConfig.RecruitmentPlanList.path)}>Cancel</Button>
                    <Button
                        type="primary"
                        icon={loading ? <LoadingOutlined /> : <SaveOutlined />}
                        onClick={() => form.submit()}
                        loading={loading}
                    >
                        Save Plan
                    </Button>
                </Space>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    status: 'Active',
                    department: 'Engineering'
                }}
            >
                <Row gutter={24}>
                    <Col xs={24} lg={16}>
                        <Card title="General Information" bordered={false} style={{ borderRadius: '12px', marginBottom: '24px' }}>
                            <Form.Item
                                label="Campaign Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter the campaign name' }]}
                            >
                                <Input placeholder="e.g. Summer 2024 Engineering Internship" size="large" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Batch/Batch Name"
                                        name="batch"
                                        rules={[{ required: true, message: 'Please enter the batch name' }]}
                                    >
                                        <Input placeholder="e.g. Batch A" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Department"
                                        name="department"
                                        rules={[{ required: true, message: 'Please select a department' }]}
                                    >
                                        <Select
                                            options={[
                                                { value: 'Engineering', label: 'Engineering' },
                                                { value: 'Marketing', label: 'Marketing' },
                                                { value: 'Design', label: 'Design' },
                                                { value: 'Data', label: 'Data Science' },
                                                { value: 'HR', label: 'Human Resources' }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Campaign Description"
                                name="description"
                            >
                                <Input.TextArea rows={4} placeholder="Describe the goals and requirements of this campaign..." />
                            </Form.Item>
                        </Card>

                        <Card title="Positions & Requirements" bordered={false} style={{ borderRadius: '12px' }}>
                            <Form.List name="positions">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} style={{ marginBottom: '16px', padding: '16px', background: '#fafafa', borderRadius: '8px', position: 'relative' }}>
                                                <Row gutter={16}>
                                                    <Col span={14}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'title']}
                                                            label="Job Title"
                                                            rules={[{ required: true, message: 'Missing title' }]}
                                                        >
                                                            <Input placeholder="e.g. Frontend Intern" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={10}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'count']}
                                                            label="Quantity"
                                                            rules={[{ required: true, message: 'Missing quantity' }]}
                                                        >
                                                            <InputNumber min={1} style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'requirements']}
                                                    label="Key Requirements"
                                                >
                                                    <Input.TextArea rows={2} placeholder="Briefly list key requirements..." />
                                                </Form.Item>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="text"
                                                        danger
                                                        onClick={() => remove(name)}
                                                        style={{ position: 'absolute', top: 8, right: 8 }}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<SaveOutlined />}>
                                            Add Another Position
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title="Timeline & Status" bordered={false} style={{ borderRadius: '12px', marginBottom: '24px' }}>
                            <Form.Item
                                label="Campaign Period"
                                name="period"
                                rules={[{ required: true, message: 'Please select the period' }]}
                            >
                                <RangePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Status"
                                name="status"
                            >
                                <Select
                                    options={[
                                        { value: 'Active', label: 'Active (Hiring)' },
                                        { value: 'Pending', label: 'Pending Approval' },
                                        { value: 'Closed', label: 'Closed' }
                                    ]}
                                />
                            </Form.Item>

                            <Divider />

                            <div style={{ background: '#e6f7ff', padding: '16px', borderRadius: '8px' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Tip: Once active, the campaign will be visible on the public job board.
                                </Text>
                            </div>
                        </Card>

                        <Card title="Approval Workflow" bordered={false} style={{ borderRadius: '12px' }}>
                            <Form.Item
                                label="Assign Approver"
                                name="approver"
                            >
                                <Select
                                    placeholder="Select Director"
                                    options={[
                                        { value: 'dir1', label: 'John Director (CTO)' },
                                        { value: 'dir2', label: 'Jane Director (CEO)' }
                                    ]}
                                />
                            </Form.Item>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Notifications will be sent to the approver upon submission.
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};
