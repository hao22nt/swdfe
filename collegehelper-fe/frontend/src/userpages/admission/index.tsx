import React, { useState } from 'react';
import { Table, Input, Button, message, Card } from 'antd';
import type { AdmissionInfo } from '../types';

const AdmissionPage: React.FC = () => {
  const [admissionData, setAdmissionData] = useState<AdmissionInfo[]>([]);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Trường',
      dataIndex: 'universityName',
      key: 'universityName',
      sorter: (a: AdmissionInfo, b: AdmissionInfo) => 
        a.universityName.localeCompare(b.universityName),
    },
    {
      title: 'Ngành',
      dataIndex: 'majorName',
      key: 'majorName',
    },
    {
      title: 'Điểm chuẩn',
      dataIndex: 'baseScore',
      key: 'baseScore',
      sorter: (a: AdmissionInfo, b: AdmissionInfo) => a.baseScore - b.baseScore,
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
    },
    {
      title: 'Thời gian xét tuyển',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: React.ReactNode, record: AdmissionInfo) => (
        <Button
          type={record.isBookmarked ? "default" : "primary"}
          onClick={() => handleBookmark(record.id)}
        >
          {record.isBookmarked ? 'Bỏ quan tâm' : 'Quan tâm'}
        </Button>
      ),
    },
  ];

  const handleBookmark = (id: number) => {
    setAdmissionData(
      admissionData.map(item =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
    message.success('Đã cập nhật trạng thái quan tâm');
  };

  return (
    <Card 
      title="Tra cứu thông tin tuyển sinh"
      className="shadow-md hover:shadow-lg transition-shadow"
      headStyle={{ 
        fontSize: '1.25rem',
        fontWeight: 'bold',
        borderBottom: '2px solid #f0f0f0'
      }}
    >
      <Input.Search
        placeholder="Tìm kiếm theo tên trường hoặc ngành..."
        style={{ marginBottom: 16 }}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        allowClear
        size="large"
        className="max-w-xl"
      />
      <Table 
        columns={columns} 
        dataSource={admissionData} 
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} kết quả`
        }}
        className="custom-table"
        rowClassName="hover:bg-gray-50"
      />
    </Card>
  );
};

export default AdmissionPage;
