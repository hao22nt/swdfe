import React, { useState, useEffect } from 'react';
import { Table, Button, message, Card, Modal, Descriptions, List, Form, Input, InputNumber, Select } from 'antd';
import { CreateAdmissionRequest, getAdmissionList, getAdmissionDetail, createAdmission, getAcademicYears, getAdmissionMethod, UniMajor, getUniMajors, deleteAdmissionInfo } from '../../api/ApiCollection';
import type { AdmissionInfo, AdmissionDetail, AcademicYear, AdmissionMethod } from '../User/types';

const { Option } = Select;

const AdmissionsPage1: React.FC = () => {
  const [admissionData, setAdmissionData] = useState<AdmissionInfo[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [admissionMethods, setAdmissionMethods] = useState<AdmissionMethod[]>([]);
  const [uniMajors, setUniMajors] = useState<UniMajor[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<(AdmissionDetail & { universityName?: string; majorName?: string }) | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [admissions, years, methods, majors] = await Promise.all([
          getAdmissionList(),
          getAcademicYears(),
          getAdmissionMethod(),
          getUniMajors(),
        ]);
        setAdmissionData(admissions);
        setAcademicYears(years);
        setAdmissionMethods(methods);
        setUniMajors(majors);
      } catch (error) {
        const err = error as Error;
        message.error('Failed to load data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleView = async (id: string) => {
    setDetailLoading(true);
    try {
      const response = await getAdmissionDetail(id) as AdmissionDetail | { message: AdmissionDetail };
      const detail = 'message' in response ? response.message : response;
      const admission = admissionData.find((item) => item.id === id);
      const universityName = admission ? admission.universityName : 'N/A';
      const majorName = admission ? admission.majorName : 'N/A';

      const formattedDetail = {
        id: detail.id || 'N/A',
        quota: detail.quota ?? 'N/A',
        admisstionDate: detail.admisstionDate || 'N/A',
        deadline: detail.deadline || 'N/A',
        inforMethods: detail.inforMethods || [],
        universityName,
        majorName,
      };

      setSelectedAdmission(formattedDetail);
      setDetailModalVisible(true);
    } catch (error) {
      const err = error as Error;
      message.error('Failed to load details: ' + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const admissionDate = new Date(values.admissionDate).toISOString();
      const deadline = new Date(values.deadline).toISOString();

      const newAdmission: CreateAdmissionRequest = {
        uniMajorId: values.uniMajorId,
        academicYearId: values.academicYearId,
        deadline: deadline,
        admisstionDate: admissionDate,
        quota: values.quota,
        inforMethods: [
          {
            admissionMethodId: values.admissionMethodId,
            scoreType: values.scoreType,
            scoreRequirement: values.scoreRequirement,
            percentageOfQuota: values.percentageOfQuota,
          },
        ],
      };

      const createdAdmission = await createAdmission(newAdmission);
      message.success('Admission info created successfully!');

      const selectedUniMajor = uniMajors.find((item) => item.id === values.uniMajorId);
      setAdmissionData((prev) => [
        ...prev,
        {
          id: createdAdmission.uniMajorId,
          universityName: selectedUniMajor?.universityName || "N/A",
          majorName: selectedUniMajor?.majorName || "N/A",
          admissionDate: createdAdmission.admisstionDate,
          deadline: createdAdmission.deadline,
          quota: createdAdmission.quota,
          isBookmarked: false,
          baseScore: 0,
        },
      ]);

      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      const err = error as Error;
      message.error('Failed to create admission info: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this admission info?',
      onOk: async () => {
        try {
          const success = await deleteAdmissionInfo(id);
          if (success) {
            const updatedAdmissions = await getAdmissionList();
            setAdmissionData(updatedAdmissions);
            message.success('Admission info deleted successfully!');
          }
        } catch (error) {
          const err = error as Error;
          message.error('Failed to delete admission info: ' + err.message);
        }
      },
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const columns = [
    { title: 'University', dataIndex: 'universityName', key: 'universityName', sorter: (a: AdmissionInfo, b: AdmissionInfo) => a.universityName.localeCompare(b.universityName) },
    { title: 'Major', dataIndex: 'majorName', key: 'majorName' },
    { title: 'Quota', dataIndex: 'quota', key: 'quota', render: (text: string | number | undefined) => (text ?? 'N/A') },
    { title: 'Admission Date', dataIndex: 'admissionDate', key: 'admissionDate', render: (text: string) => (!text || text === '0001-01-01T00:00:00' ? 'Not Specified' : new Date(text).toLocaleDateString()) },
    { title: 'Deadline', dataIndex: 'deadline', key: 'deadline', render: (text: string | undefined) => (!text || text === '0001-01-01T00:00:00' ? 'Not Specified' : new Date(text).toLocaleDateString()) },
    {
      title: 'Actions',
      key: 'action',
      render: (_: React.ReactNode, record: AdmissionInfo) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => handleView(record.id)} className="text-blue-600 hover:text-blue-800">View Details</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-800">Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Card with Tailwind */}
      <Card
        title={<h1 className="text-2xl font-bold text-gray-800">Admission Management</h1>}
        extra={
          <Button
            type="primary"
            onClick={() => setCreateModalVisible(true)}
            className="bg-blue-600 hover:bg-blue-700 border-none"
          >
            Create New
          </Button>
        }
        className="shadow-lg rounded-lg"
      >
        <Table
          columns={columns}
          dataSource={admissionData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="border rounded-lg"
        />
      </Card>

      {/* Detail Modal with Tailwind */}
      <Modal
        title={<h2 className="text-xl font-semibold text-gray-800">Admission Details</h2>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-lg"
      >
        {detailLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : selectedAdmission ? (
          <div className="space-y-4">
            <Descriptions bordered column={1} className="bg-white rounded-lg shadow-sm">
              <Descriptions.Item label={<span className="font-semibold">University</span>}>
                {selectedAdmission.universityName}
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-semibold">Major</span>}>
                {selectedAdmission.majorName}
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-semibold">Quota</span>}>
                {selectedAdmission.quota}
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-semibold">Admission Date</span>}>
                {selectedAdmission.admisstionDate === 'N/A' ? 'Not Specified' : new Date(selectedAdmission.admisstionDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-semibold">Deadline</span>}>
                {selectedAdmission.deadline === 'N/A' ? 'Not Specified' : new Date(selectedAdmission.deadline).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
            {selectedAdmission.inforMethods.length > 0 && (
              <List
                dataSource={selectedAdmission.inforMethods}
                renderItem={(method) => (
                  <List.Item>
                    <Descriptions bordered column={1} className="bg-white rounded-lg shadow-sm">
                      <Descriptions.Item label={<span className="font-semibold">Method</span>}>
                        {method.methodName}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span className="font-semibold">Score Type</span>}>
                        {method.scoreType}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span className="font-semibold">Score Requirement</span>}>
                        {method.scoreRequirement}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span className="font-semibold">Quota Percentage</span>}>
                        {method.percentageOfQuota}%
                      </Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
                className="mt-4"
              />
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">No data available</div>
        )}
      </Modal>

      {/* Create Modal with Tailwind */}
      <Modal
        title={<h2 className="text-xl font-semibold text-gray-800">Create New Admission</h2>}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-lg"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="space-y-4">
          <Form.Item
            name="uniMajorId"
            label={<span className="font-semibold">Major - University</span>}
            rules={[{ required: true, message: 'Please select a major and university!' }]}
          >
            <Select placeholder="Select major and university" className="rounded-md">
              {uniMajors.map((item) => (
                <Option key={item.id} value={item.id}>{`${item.universityName} - ${item.majorName}`}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="academicYearId"
            label={<span className="font-semibold">Academic Year</span>}
            rules={[{ required: true, message: 'Please select an academic year!' }]}
          >
            <Select placeholder="Select academic year" className="rounded-md">
              {academicYears.map((item) => (
                <Option key={item.id} value={item.id}>{item.year === 0 ? "Not Specified" : item.year}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="admissionDate"
            label={<span className="font-semibold">Admission Date</span>}
            rules={[{ required: true, message: 'Please enter the admission date!' }]}
          >
            <Input
              type="datetime-local"
              step="1"
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </Form.Item>

          <Form.Item
            name="deadline"
            label={<span className="font-semibold">Deadline</span>}
            rules={[
              { required: true, message: 'Please enter the deadline!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || new Date(value) > new Date(getFieldValue('admissionDate'))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Deadline must be after admission date!'));
                },
              }),
            ]}
          >
            <Input
              type="datetime-local"
              step="1"
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </Form.Item>

          <Form.Item
            name="quota"
            label={<span className="font-semibold">Quota</span>}
            rules={[
              { required: true, message: 'Please enter the quota!' },
              { type: 'number', min: 1, message: 'Quota must be greater than 0!' }
            ]}
          >
            <InputNumber min={1} className="w-full rounded-md" />
          </Form.Item>

          <Form.Item
            name="admissionMethodId"
            label={<span className="font-semibold">Admission Method</span>}
            rules={[{ required: true, message: 'Please select an admission method!' }]}
          >
            <Select placeholder="Select admission method" className="rounded-md">
              {admissionMethods.map((item) => (
                <Option key={item.id} value={item.id}>{item.methodName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="scoreType"
            label={<span className="font-semibold">Score Type</span>}
            rules={[{ required: true, message: 'Please enter the score type!' }]}
          >
            <Input className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </Form.Item>

          <Form.Item
            name="scoreRequirement"
            label={<span className="font-semibold">Score Requirement</span>}
            rules={[
              { required: true, message: 'Please enter the score requirement!' },
              { type: 'number', min: 0, message: 'Score must be greater than or equal to 0!' }
            ]}
          >
            <InputNumber min={0} max={30} className="w-full rounded-md" />
          </Form.Item>

          <Form.Item
            name="percentageOfQuota"
            label={<span className="font-semibold">Quota Percentage (%)</span>}
            rules={[
              { required: true, message: 'Please enter the quota percentage!' },
              { type: 'number', min: 1, max: 100, message: 'Percentage must be between 1-100%!' }
            ]}
          >
            <InputNumber min={1} max={100} className="w-full rounded-md" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700 border-none w-full rounded-md"
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdmissionsPage1;