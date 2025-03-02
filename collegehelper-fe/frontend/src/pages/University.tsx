import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table'; // ✅ Corrected import

interface University {
  id: number;
  name: string;
  location: string;
  website: string;
}

const UniversityPage = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

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
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
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

  const handleDelete = (id: number) => {
    setUniversities(universities.filter((uni) => uni.id !== id));
  };

  const handleModalOk = () => {
    form.validateFields().then((values: University) => {
      if (editingId === null) {
        const newUniversity: University = {
          ...values,
          id: Date.now(),
        };
        setUniversities([...universities, newUniversity]);
      } else {
        setUniversities(
          universities.map((uni) =>
            uni.id === editingId ? { ...uni, ...values } : uni
          )
        );
      }
      setIsModalOpen(false);
    });
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
            name="website"
            label="Website"
            rules={[{ required: true, message: 'Vui lòng nhập website!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UniversityPage;
