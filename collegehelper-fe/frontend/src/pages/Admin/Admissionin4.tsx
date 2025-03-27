// pages/AdminAdmissionsPage.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, message, Card, Modal, Descriptions, List, Form, Input, InputNumber } from 'antd';
import { getAdmissionList, getAdmissionDetail, createAdmission } from '../../api/ApiCollection';
import type { AdmissionInfo, AdmissionDetail } from '../User/types';

const AdmissionsPage1: React.FC = () => {
  const [admissionData, setAdmissionData] = useState<AdmissionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false); // Thêm state cho modal tạo mới
  const [selectedAdmission, setSelectedAdmission] = useState<(AdmissionDetail & { universityName?: string; majorName?: string }) | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [form] = Form.useForm(); // Form instance để quản lý dữ liệu nhập

  useEffect(() => {
    const fetchAdmissions = async () => {
      setLoading(true);
      try {
        const data = await getAdmissionList();
        console.log('🔍 Fetched Admission Data:', JSON.stringify(data, null, 2));
        setAdmissionData(data);
      } catch (error) {
        const err = error as Error;
        message.error('Không thể tải thông tin tuyển sinh: ' + err.message);
        console.error('Fetch admission error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, []);

  const handleView = async (id: string) => {
    setDetailLoading(true);
    try {
      const response = await getAdmissionDetail(id);
      console.log('🔍 Fetched Admission Detail Response:', JSON.stringify(response, null, 2));

      const detail = response.message || response;
      const admission = admissionData.find((item) => item.id === id);
      const universityName = admission ? admission.universityName : 'N/A';
      const majorName = admission ? admission.majorName : 'N/A';

      const formattedDetail = {
        id: detail.id || 'N/A',
        quota: detail.quota ?? 'N/A',
        admissionDate: detail.admissionDate || detail.admisstionDate || 'N/A',
        deadline: detail.deadline || 'N/A',
        inforMethods: detail.inforMethods?.$values || detail.inforMethods || [],
        universityName,
        majorName,
      };

      console.log('🔍 Formatted Detail:', JSON.stringify(formattedDetail, null, 2));
      setSelectedAdmission(formattedDetail);
      setDetailModalVisible(true);
    } catch (error) {
      const err = error as Error;
      message.error('Không thể tải thông tin chi tiết: ' + err.message);
      console.error('Fetch admission detail error:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const newAdmission = {
        uniMajorId: values.uniMajorId,
        academicYearId: values.academicYearId,
        deadline: values.deadline,
        admissionDate: values.admissionDate,
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
      
      // Cập nhật danh sách sau khi tạo thành công (giả định API trả về dữ liệu tương thích với AdmissionInfo)
      setAdmissionData((prev) => [
        ...prev,
        {
          id: createdAdmission.uniMajorId, // Dùng uniMajorId làm id tạm thời
          universityName: "N/A", // Cần API trả về universityName nếu có
          majorName: "N/A", // Cần API trả về majorName nếu có
          admissionDate: createdAdmission.admissionDate,
          deadline: createdAdmission.deadline,
          quota: createdAdmission.quota,
          isBookmarked: false,
          baseScore: 0, // Giá trị mặc định
        },
      ]);

      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      const err = error as Error;
      message.error('Không thể tạo thông tin tuyển sinh: ' + err.message);
      console.error('Create admission error:', err);
    }
  };

  const columns = [
    {
      title: 'Trường',
      dataIndex: 'universityName',
      key: 'universityName',
      sorter: (a: AdmissionInfo, b: AdmissionInfo) => a.universityName.localeCompare(b.universityName),
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Ngành',
      dataIndex: 'majorName',
      key: 'majorName',
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
      render: (text: string | number | undefined) => (text !== undefined && text !== null ? text : 'N/A'),
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Thời gian xét tuyển',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
      render: (text: string) =>
        !text || text === '0001-01-01T00:00:00'
          ? 'Chưa xác định'
          : new Date(text).toLocaleDateString(),
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Hạn nộp hồ sơ',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text: string | undefined) =>
        !text || text === '0001-01-01T00:00:00'
          ? 'Chưa xác định'
          : new Date(text).toLocaleDateString(),
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: React.ReactNode, record: AdmissionInfo) => (
        <Button
          type="link"
          className="text-blue-500 hover:text-blue-700 font-medium"
          onClick={() => handleView(record.id)}
        >
          Xem chi tiết
        </Button>
      ),
      className: 'text-center',
    },
  ];

  return (
    <div className="admin-admissions-page">
      <Card
        title="Quản lý thông tin tuyển sinh"
        className="admin-card"
        headStyle={{
          background: 'linear-gradient(to right, #e74c3c, #f39c12)',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          padding: '16px 24px',
        }}
        bodyStyle={{
          padding: '24px',
        }}
        extra={
          <Button
            type="primary"
            onClick={() => setCreateModalVisible(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Tạo mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={admissionData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} kết quả`,
            className: 'mt-4',
          }}
          className="admin-table"
          rowClassName="hover:bg-gray-50 transition-colors duration-200"
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết thông tin tuyển sinh"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
        className="admin-modal"
        styles={{
          header: {
            background: 'linear-gradient(to right, #e74c3c, #f39c12)',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            padding: '16px 24px',
          },
          body: {
            padding: '24px',
            backgroundColor: '#fff',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
          },
        }}
      >
        {detailLoading ? (
          <div className="text-center text-gray-500">Đang tải...</div>
        ) : selectedAdmission ? (
          <div className="space-y-6">
            <Descriptions bordered column={1} className="rounded-lg">
              <Descriptions.Item label="Trường" className="text-gray-700 font-medium">
                {selectedAdmission.universityName}
              </Descriptions.Item>
              <Descriptions.Item label="Ngành" className="text-gray-700 font-medium">
                {selectedAdmission.majorName}
              </Descriptions.Item>
              <Descriptions.Item label="Chỉ tiêu" className="text-gray-700 font-medium">
                {selectedAdmission.quota}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian xét tuyển" className="text-gray-700 font-medium">
                {selectedAdmission.admissionDate === 'N/A'
                  ? 'Chưa xác định'
                  : new Date(selectedAdmission.admissionDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn nộp hồ sơ" className="text-gray-700 font-medium">
                {selectedAdmission.deadline === 'N/A'
                  ? 'Chưa xác định'
                  : new Date(selectedAdmission.deadline).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>

            {selectedAdmission.inforMethods.length > 0 && (
              <>
                <h3 className="mt-6 text-lg font-semibold text-gray-800">Phương thức xét tuyển:</h3>
                <List
                  dataSource={selectedAdmission.inforMethods}
                  renderItem={(method) => (
                    <List.Item className="border-b border-gray-200 py-4">
                      <Descriptions bordered column={1} size="small" className="rounded-lg">
                        <Descriptions.Item label="Phương thức" className="text-gray-700 font-medium">
                          {method.methodName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối" className="text-gray-700 font-medium">
                          {method.scoreType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Điểm yêu cầu" className="text-gray-700 font-medium">
                          {method.scoreRequirement}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tỷ lệ chỉ tiêu" className="text-gray-700 font-medium">
                          {method.percentageOfQuota}%
                        </Descriptions.Item>
                      </Descriptions>
                    </List.Item>
                  )}
                  className="bg-gray-50 rounded-lg p-4"
                />
              </>
            )}
          </div>
        ) : (
          <div className="text-gray-500">Không có dữ liệu</div>
        )}
      </Modal>

      {/* Modal tạo mới */}
      <Modal
        title="Tạo thông tin tuyển sinh mới"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
        className="admin-modal"
        styles={{
          header: {
            background: 'linear-gradient(to right, #e74c3c, #f39c12)',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            padding: '16px 24px',
          },
          body: {
            padding: '24px',
            backgroundColor: '#fff',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="uniMajorId"
            label="ID Ngành - Trường"
            rules={[{ required: true, message: 'Vui lòng nhập ID ngành - trường!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="academicYearId"
            label="ID Năm học"
            rules={[{ required: true, message: 'Vui lòng nhập ID năm học!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="admissionDate"
            label="Thời gian xét tuyển"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian xét tuyển!' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="deadline"
            label="Hạn nộp hồ sơ"
            rules={[{ required: true, message: 'Vui lòng nhập hạn nộp hồ sơ!' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="quota"
            label="Chỉ tiêu"
            rules={[{ required: true, message: 'Vui lòng nhập chỉ tiêu!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="admissionMethodId"
            label="ID Phương thức xét tuyển"
            rules={[{ required: true, message: 'Vui lòng nhập ID phương thức!' }]}
          >
            <Input />
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
            rules={[{ required: true, message: 'Vui lòng nhập điểm yêu cầu!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="percentageOfQuota"
            label="Tỷ lệ chỉ tiêu (%)"
            rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ chỉ tiêu!' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdmissionsPage1;

