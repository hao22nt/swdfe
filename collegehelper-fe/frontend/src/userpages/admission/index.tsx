import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Card } from 'antd';
import { getAdmissionList } from '../../api/ApiCollection'; 
import type { AdmissionInfo } from '../types';

const AdmissionPage: React.FC = () => {
  const [admissionData, setAdmissionData] = useState<AdmissionInfo[]>([]);
  const [filteredData, setFilteredData] = useState<AdmissionInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch data khi component mount
  useEffect(() => {
    const fetchAdmissions = async () => {
      setLoading(true);
      try {
        const data = await getAdmissionList();
        // Thêm trường isBookmarked, baseScore, quota và methodName
        const enhancedData = data.map(item => ({
          id: item.id,
          universityName: item.universityName,
          majorName: item.majorName,
          methodName: item.methodName || 'N/A',
          baseScore: 0, // Gán mặc định trực tiếp
          quota: 'N/A', // Gán mặc định trực tiếp
          admissionDate: item.admissionDate,
          isBookmarked: false,
        }));
        setAdmissionData(enhancedData);
        setFilteredData(enhancedData);
      } catch (error) {
        const err = error as Error; // Ép kiểu error thành Error
        message.error('Không thể tải thông tin tuyển sinh: ' + err.message);
        console.error('Fetch admission error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = admissionData.filter(
      item =>
        item.universityName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.majorName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, admissionData]);

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
      title: 'Phương thức xét tuyển',
      dataIndex: 'methodName',
      key: 'methodName',
    },
    {
      title: 'Điểm chuẩn',
      dataIndex: 'baseScore',
      key: 'baseScore',
      sorter: (a: AdmissionInfo, b: AdmissionInfo) => (a.baseScore || 0) - (b.baseScore || 0),
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
      render: (text: string) => {
        if (!text || text === "0001-01-01T00:00:00") return "Chưa xác định";
        const date = new Date(text);
        return isNaN(date.getTime()) ? "Chưa xác định" : date.toLocaleDateString();
      },
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

  const handleBookmark = (id: string) => {
    setAdmissionData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
    setFilteredData(prevData =>
      prevData.map(item =>
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
        borderBottom: '2px solid #f0f0f0',
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
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} kết quả`,
        }}
        className="custom-table"
        rowClassName="hover:bg-gray-50"
      />
    </Card>
  );
};

export default AdmissionPage;