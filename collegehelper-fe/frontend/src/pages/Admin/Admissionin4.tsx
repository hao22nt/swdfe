import React, { useState, useEffect } from 'react';
import { Table, Button, message, Card, Modal, Descriptions, List, Form, Input, InputNumber, Select } from 'antd';
import {CreateAdmissionRequest, getAdmissionList, getAdmissionDetail, createAdmission, getAcademicYears, getAdmissionMethod, UniMajor, getUniMajors, deleteAdmissionInfo } from '../../api/ApiCollection';
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
      // Format datetime fields to ISO string
      const admissionDate = new Date(values.admissionDate).toISOString();
      const deadline = new Date(values.deadline).toISOString();
  
      const newAdmission: CreateAdmissionRequest = {
        uniMajorId: values.uniMajorId,
        academicYearId: values.academicYearId,
        deadline: deadline,
        admisstionDate: admissionDate, // Đã sửa từ admisstionDate
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
            const updatedAdmissions = await getAdmissionList(); // Làm mới danh sách từ server
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
        <div>
          <Button type="link" onClick={() => handleView(record.id)}>Xem chi tiết</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-admissions-page">
      <Card
        title="Quản lý thông tin tuyển sinh"
        extra={<Button type="primary" onClick={() => setCreateModalVisible(true)}>Tạo mới</Button>}
      >
        <Table columns={columns} dataSource={admissionData} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="Chi tiết thông tin tuyển sinh" open={detailModalVisible} onCancel={() => setDetailModalVisible(false)} footer={null} width={600}>
        {detailLoading ? (
          <div>Đang tải...</div>
        ) : selectedAdmission ? (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Trường">{selectedAdmission.universityName}</Descriptions.Item>
              <Descriptions.Item label="Ngành">{selectedAdmission.majorName}</Descriptions.Item>
              <Descriptions.Item label="Chỉ tiêu">{selectedAdmission.quota}</Descriptions.Item>
              <Descriptions.Item label="Thời gian xét tuyển">{selectedAdmission.admisstionDate === 'N/A' ? 'Chưa xác định' : new Date(selectedAdmission.admisstionDate).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Hạn nộp hồ sơ">{selectedAdmission.deadline === 'N/A' ? 'Chưa xác định' : new Date(selectedAdmission.deadline).toLocaleDateString()}</Descriptions.Item>
            </Descriptions>
            {selectedAdmission.inforMethods.length > 0 && (
              <List
                dataSource={selectedAdmission.inforMethods}
                renderItem={(method) => (
                  <List.Item>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Phương thức">{method.methodName}</Descriptions.Item>
                      <Descriptions.Item label="Khối">{method.scoreType}</Descriptions.Item>
                      <Descriptions.Item label="Điểm yêu cầu">{method.scoreRequirement}</Descriptions.Item>
                      <Descriptions.Item label="Tỷ lệ chỉ tiêu">{method.percentageOfQuota}%</Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              />
            )}
          </div>
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Modal>

      <Modal
        title="Tạo thông tin tuyển sinh mới"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="uniMajorId"
            label="Ngành - Trường"
            rules={[{ required: true, message: 'Vui lòng chọn ngành - trường!' }]}
          >
            <Select placeholder="Chọn ngành và trường">
              {uniMajors.map((item) => (
                <Option key={item.id} value={item.id}>{`${item.universityName} - ${item.majorName}`}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="academicYearId"
            label="Năm học"
            rules={[{ required: true, message: 'Vui lòng chọn năm học!' }]}
          >
            <Select placeholder="Chọn năm học">
              {academicYears.map((item) => (
                <Option key={item.id} value={item.id}>{item.year === 0 ? "Không xác định" : item.year}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="admissionDate"
            label="Thời gian xét tuyển"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian xét tuyển!' }]}
          >
            <Input
              type="datetime-local"
              step="1" // Cho phép chọn đến giây
            />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Hạn nộp hồ sơ"
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
            />
          </Form.Item>

          <Form.Item
            name="quota"
            label="Chỉ tiêu"
            rules={[
              { required: true, message: 'Vui lòng nhập chỉ tiêu!' },
              { type: 'number', min: 1, message: 'Chỉ tiêu phải lớn hơn 0!' }
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="admissionMethodId"
            label="Phương thức xét tuyển"
            rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
          >
            <Select placeholder="Chọn phương thức xét tuyển">
              {admissionMethods.map((item) => (
                <Option key={item.id} value={item.id}>{item.methodName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="scoreType"
            label="Khối"
            rules={[{ required: true, message: 'Vui lòng nhập khối!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="scoreRequirement"
            label="Điểm yêu cầu"
            rules={[
              { required: true, message: 'Vui lòng nhập điểm yêu cầu!' },
              { type: 'number', min: 0, message: 'Điểm phải lớn hơn hoặc bằng 0!' }
            ]}
          >
            <InputNumber min={0} max={30} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="percentageOfQuota"
            label="Tỷ lệ chỉ tiêu (%)"
            rules={[
              { required: true, message: 'Vui lòng nhập tỷ lệ chỉ tiêu!' },
              { type: 'number', min: 1, max: 100, message: 'Tỷ lệ phải từ 1-100%!' }
            ]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdmissionsPage1;