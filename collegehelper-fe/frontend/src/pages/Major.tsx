import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// Định nghĩa interface theo cấu trúc API
interface Major {
  id: string;
  tuitionFee: string;
  majorCode: string;
}

const API_URL = 'https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/unimajor';

const MajorPage = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const getAccessToken = () => localStorage.getItem('accessToken');

  const fetchAllMajors = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        message.error('No access token found!');
        return;
      }

      const response = await axios.get(`${API_URL}/all?pageNumber=1&pageSize=5`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setMajors(response.data.message.items.$values);
    } catch (error) {
      console.error('Error fetching majors:', error);
      message.error('Không thể tải danh sách ngành học');
    }
  };

  useEffect(() => {
    fetchAllMajors();
  }, []);

  const columns: ColumnsType<Major> = [
    { title: 'tuitionFee', dataIndex: 'tuitionFee', key: 'tuitionFee' },
    { title: 'majorCode', dataIndex: 'majorCode', key: 'majorCode' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Major) => (
        <Space>
          <Button type='primary' onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title='Bạn có chắc chắn muốn xóa?' onConfirm={() => handleDelete(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Major) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMajors(majors.filter((major) => major.id !== id));
      message.success('Xóa ngành học thành công');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error('Không thể xóa ngành học');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const token = getAccessToken();
      if (!token) {
        message.error('No access token found!');
        return;
      }

      if (editingId === null) {
        const response = await axios.post(`${API_URL}/create`, values, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setMajors([...majors, response.data.message]);
        message.success('Thêm ngành học mới thành công');
      } else {
        await axios.put(`${API_URL}/${editingId}`, values, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setMajors(majors.map((major) => (major.id === editingId ? { ...major, ...values } : major)));
        message.success('Cập nhật thành công');
      }

      setIsModalOpen(false);
      fetchAllMajors();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      message.error('Không thể lưu dữ liệu');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button type='default' onClick={handleAdd} style={{ backgroundColor: 'blue', color: 'white' }}>
          Add new Major+
        </Button>
      </div>
      <Table columns={columns} dataSource={majors} rowKey='id' />

      <Modal title={editingId === null ? 'Thêm ngành học' : 'Sửa thông tin'} open={isModalOpen} onOk={handleModalOk} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout='vertical'>
          <Form.Item name='name' label='Tên ngành' rules={[{ required: true, message: 'Vui lòng nhập tên ngành!' }]}> <Input /> </Form.Item>
          <Form.Item name='department' label='Khoa' rules={[{ required: true, message: 'Vui lòng nhập khoa!' }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MajorPage;
