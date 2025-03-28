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
        message.error('Không thể tải dữ liệu: ' + err.message);
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
      message.error('Không thể tải thông tin chi tiết: ' + err.message);
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
      message.success('Tạo thông tin tuyển sinh thành công!');

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
      message.error('Không thể tạo thông tin tuyển sinh: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa thông tin tuyển sinh này?',
      onOk: async () => {
        try {
          const success = await deleteAdmissionInfo(id);
          if (success) {
            const updatedAdmissions = await getAdmissionList();
            setAdmissionData(updatedAdmissions);
            message.success('Xóa thông tin tuyển sinh thành công!');
          }
        } catch (error) {
          const err = error as Error;
          message.error('Không thể xóa thông tin tuyển sinh: ' + err.message);
        }
      },
    });
  };

  const columns = [
    { title: 'Trường', dataIndex: 'universityName', key: 'universityName', sorter: (a: AdmissionInfo, b: AdmissionInfo) => a.universityName.localeCompare(b.universityName) },
    { title: 'Ngành', dataIndex: 'majorName', key: 'majorName' },
    { title: 'Chỉ tiêu', dataIndex: 'quota', key: 'quota', render: (text: string | number | undefined) => (text ?? 'N/A') },
    { title: 'Thời gian xét tuyển', dataIndex: 'admissionDate', key: 'admissionDate', render: (text: string) => (!text || text === '0001-01-01T00:00:00' ? 'Chưa xác định' : new Date(text).toLocaleDateString()) },
    { title: 'Hạn nộp hồ sơ', dataIndex: 'deadline', key: 'deadline', render: (text: string | undefined) => (!text || text === '0001-01-01T00:00:00' ? 'Chưa xác định' : new Date(text).toLocaleDateString()) },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: React.ReactNode, record: AdmissionInfo) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => handleView(record.id)} className="text-blue-600 hover:text-blue-800">Xem chi tiết</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-800">Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Card with Tailwind */}
      <Card
        title={<h1 className="text-2xl font-bold text-gray-800">Quản lý thông tin tuyển sinh</h1>}
        extra={
          <Button
            type="primary"
            onClick={() => setCreateModalVisible(true)}
            className="bg-blue-600 hover:bg-blue-700 border-none"
          >
            Tạo mới
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
        title={<h2 className="text-xl font-semibold text-gray-800">Chi tiết thông tin tuyển sinh</h2>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-lg"
      >
        {detailLoading ? (
          <div className="text-center text-gray-500">Đang tải...</div>
        ) : selectedAdmission ? (
          <div className="space-y-4">
            <Descriptions bordered column={1} className="bg-white rounded-lg shadow-sm">
              <Descriptions.Item label={<span className="font-semibold">Trường</span>}>
                {selectedAdmission.universityName}
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-semibold">Ngành</span>}>
                {selectedAdmission.majorName}
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-semibold">Chỉ tiêu</span>}>
                {selectedAdmission.quota}
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-semibold">Thời gian xét tuyển</span>}>
                {selectedAdmission.admisstionDate === 'N/A' ? 'Chưa xác định' : new Date(selectedAdmission.admisstionDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-semibold">Hạn nộp hồ sơ</span>}>
                {selectedAdmission.deadline === 'N/A' ? 'Chưa xác định' : new Date(selectedAdmission.deadline).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
            {selectedAdmission.inforMethods.length > 0 && (
              <List
                dataSource={selectedAdmission.inforMethods}
                renderItem={(method) => (
                  <List.Item>
                    <Descriptions bordered column={1} className="bg-white rounded-lg shadow-sm">
                      <Descriptions.Item label={<span className="font-semibold">Phương thức</span>}>
                        {method.methodName}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span className="font-semibold">Khối</span>}>
                        {method.scoreType}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span className="font-semibold">Điểm yêu cầu</span>}>
                        {method.scoreRequirement}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span className="font-semibold">Tỷ lệ chỉ tiêu</span>}>
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
          <div className="text-center text-gray-500">Không có dữ liệu</div>
        )}
      </Modal>

      {/* Create Modal with Tailwind */}
      <Modal
        title={<h2 className="text-xl font-semibold text-gray-800">Tạo thông tin tuyển sinh mới</h2>}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-lg"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="space-y-4">
          <Form.Item
            name="uniMajorId"
            label={<span className="font-semibold">Ngành - Trường</span>}
            rules={[{ required: true, message: 'Vui lòng chọn ngành - trường!' }]}
          >
            <Select placeholder="Chọn ngành và trường" className="rounded-md">
              {uniMajors.map((item) => (
                <Option key={item.id} value={item.id}>{`${item.universityName} - ${item.majorName}`}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="academicYearId"
            label={<span className="font-semibold">Năm học</span>}
            rules={[{ required: true, message: 'Vui lòng chọn năm học!' }]}
          >
            <Select placeholder="Chọn năm học" className="rounded-md">
              {academicYears.map((item) => (
                <Option key={item.id} value={item.id}>{item.year === 0 ? "Không xác định" : item.year}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="admissionDate"
            label={<span className="font-semibold">Thời gian xét tuyển</span>}
            rules={[{ required: true, message: 'Vui lòng nhập thời gian xét tuyển!' }]}
          >
            <Input
              type="datetime-local"
              step="1"
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </Form.Item>

          <Form.Item
            name="deadline"
            label={<span className="font-semibold">Hạn nộp hồ sơ</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập hạn nộp hồ sơ!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || new Date(value) > new Date(getFieldValue('admissionDate'))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Hạn nộp phải sau thời gian xét tuyển!'));
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
            label={<span className="font-semibold">Chỉ tiêu</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập chỉ tiêu!' },
              { type: 'number', min: 1, message: 'Chỉ tiêu phải lớn hơn 0!' }
            ]}
          >
            <InputNumber min={1} className="w-full rounded-md" />
          </Form.Item>

          <Form.Item
            name="admissionMethodId"
            label={<span className="font-semibold">Phương thức xét tuyển</span>}
            rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
          >
            <Select placeholder="Chọn phương thức xét tuyển" className="rounded-md">
              {admissionMethods.map((item) => (
                <Option key={item.id} value={item.id}>{item.methodName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="scoreType"
            label={<span className="font-semibold">Khối</span>}
            rules={[{ required: true, message: 'Vui lòng nhập khối!' }]}
          >
            <Input className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200" />
          </Form.Item>

          <Form.Item
            name="scoreRequirement"
            label={<span className="font-semibold">Điểm yêu cầu</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập điểm yêu cầu!' },
              { type: 'number', min: 0, message: 'Điểm phải lớn hơn hoặc bằng 0!' }
            ]}
          >
            <InputNumber min={0} max={30} className="w-full rounded-md" />
          </Form.Item>

          <Form.Item
            name="percentageOfQuota"
            label={<span className="font-semibold">Tỷ lệ chỉ tiêu (%)</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập tỷ lệ chỉ tiêu!' },
              { type: 'number', min: 1, max: 100, message: 'Tỷ lệ phải từ 1-100%!' }
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
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdmissionsPage1;