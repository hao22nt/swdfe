import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

// Định nghĩa interface theo cấu trúc API
interface University {
  id: string;
  name: string;
  location: string;
  universityCode: string;
  email: string;
  phoneNumber: string;
  establishedDate: string;
  accreditation: string;
  type: string;
  description: string;
  rankingNational: number;
  rankingInternational: number;
  image: string;
}

const UniversityPage = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  
  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

const fetchData = async () => {
    try {
        const token = getAccessToken(); // Lấy token từ localStorage
        const response = await axios.get(`https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/university/all?pageNumber=1&pageSize=5
`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Thêm token vào header Authorization
            }
        });

        console.log("aaaa:",response.data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

fetchData();
  const API_URL =
    'https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/university';

  // Fetch dữ liệu từ API
  const fetchAllUniversities = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        message.error("No access token found!");
        return;
      }
  
      const response = await axios.get(`${API_URL}/all?pageNumber=1&pageSize=5`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Thêm token vào headers
        },
      });
  
      console.log("API Response:", response.data); // Kiểm tra dữ liệu từ API
  
      // Kiểm tra API có trả về danh sách không
      if (!response.data?.message?.items?.$values) {
        message.error("API response format is incorrect!");
        return;
      }
  
      // Cập nhật danh sách universities
      setUniversities(response.data.message.items.$values);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách trường:", error);
      message.error("Không thể tải danh sách trường đại học");
    }
  };

  // Gọi API khi component render
  useEffect(() => {
    fetchAllUniversities();
  }, []);

  const columns: ColumnsType<University> = [
    {
      title: 'Tên trường',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: University) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
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

  const handleEdit = (record: University) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUniversities(universities.filter((uni) => uni.id !== id));
      message.success('Xóa trường thành công');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error('Không thể xóa trường');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("accessToken");
  
      if (!token) {
        message.error("No access token found!");
        return;
      }
  
      if (editingId === null) {
        // Thêm mới
        const response = await axios.post(
          `${API_URL}/create`, 
          values,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
  
        setUniversities([...universities, response.data.message]);
        message.success("Thêm trường mới thành công");
      } else {
        // Cập nhật
        await axios.put(`${API_URL}/${editingId}`, values, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        setUniversities(
          universities.map((uni) =>
            uni.id === editingId ? { ...uni, ...values } : uni
          )
        );
        message.success("Cập nhật thành công");
      }
  
      setIsModalOpen(false);
      fetchAllUniversities(); // Làm mới danh sách
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      message.error("Không thể lưu dữ liệu");
    }
  };
  

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="default"
          onClick={handleAdd}
          style={{
            backgroundColor: 'blue',
            border: '2px solid blue',
            padding: '20px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            color: 'white',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.color = 'black')
          }
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.color = 'white')
          }
        >
          Add new University+
        </Button>
      </div>
      <Table columns={columns} dataSource={universities} rowKey="id" />

      <Modal
        title={editingId === null ? 'Thêm trường đại học' : 'Sửa thông tin'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên trường"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UniversityPage;
