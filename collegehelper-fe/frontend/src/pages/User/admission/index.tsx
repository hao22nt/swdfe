// src/components/AdmissionPage.tsx
import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Card, Modal, Descriptions, List } from 'antd';
import type { AdmissionInfo, AdmissionDetail } from '../types';
import { getAdmissionList, getAdmissionDetail, markWishlist, unmarkWishlist, getWishlist } from '../../../api/ApiCollection';

const AdmissionPage: React.FC = () => {
  const [admissionData, setAdmissionData] = useState<AdmissionInfo[]>([]);
  const [filteredData, setFilteredData] = useState<AdmissionInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionDetail & { universityName?: string } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch data khi component mount
  useEffect(() => {
    const fetchAdmissions = async () => {
      setLoading(true);
      try {
        // Lấy danh sách thông tin tuyển sinh
        const data = await getAdmissionList();
        console.log('🔍 Fetched Admission Data:', JSON.stringify(data, null, 2));
  
        // Lấy danh sách quan tâm từ server
        let wishlist = [];
        try {
          const wishlistResponse = await getWishlist();
          console.log('🔍 Fetched Wishlist:', JSON.stringify(wishlistResponse, null, 2));
  
          // Kiểm tra nếu wishlistResponse là một đối tượng và có trường data
          wishlist = Array.isArray(wishlistResponse)
            ? wishlistResponse
            : wishlistResponse.data && Array.isArray(wishlistResponse.data)
            ? wishlistResponse.data
            : [];
        } catch (error) {
          console.error("Không thể lấy danh sách quan tâm:", error);
          message.warning("Không thể lấy danh sách quan tâm. Trạng thái quan tâm có thể không chính xác.");
          wishlist = []; // Đảm bảo wishlist là mảng rỗng nếu có lỗi
        }
  
        // Cập nhật trạng thái isBookmarked dựa trên danh sách quan tâm
        const updatedData = data.map((item: AdmissionInfo) => ({
          ...item,
          isBookmarked: wishlist.some((wishlistItem: any) => wishlistItem.id === item.id) || false,
        }));
  
        setAdmissionData(updatedData);
        setFilteredData(updatedData);
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

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = admissionData.filter(
      (item) =>
        item.universityName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.majorName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, admissionData]);

  // Xử lý khi nhấn nút View
  const handleView = async (id: string) => {
    setDetailLoading(true);
    try {
      const detail = await getAdmissionDetail(id);
      // Tìm universityName từ admissionData
      const admission = admissionData.find((item) => item.id === id);
      const universityName = admission ? admission.universityName : 'N/A';
      setSelectedAdmission({ ...detail, universityName });
      setDetailModalVisible(true);
    } catch (error) {
      const err = error as Error;
      message.error('Không thể tải thông tin chi tiết: ' + err.message);
      console.error('Fetch admission detail error:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Định nghĩa các cột của bảng
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
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
      render: (text: string | number) => {
        console.log('🔍 Quota Render:', text);
        return text !== undefined && text !== null ? text : 'N/A';
      },
    },
    {
      title: 'Thời gian xét tuyển',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
      render: (text: string) => {
        console.log('🔍 Admission Date Render:', text);
        if (!text || text === '0001-01-01T00:00:00') return 'Chưa xác định';
        const date = new Date(text);
        return isNaN(date.getTime()) ? 'Chưa xác định' : date.toLocaleDateString();
      },
    },
    {
      title: 'Hạn nộp hồ sơ',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text: string) => {
        console.log('🔍 Deadline Render:', text);
        if (!text || text === '0001-01-01T00:00:00') return 'Chưa xác định';
        const date = new Date(text);
        return isNaN(date.getTime()) ? 'Chưa xác định' : date.toLocaleDateString();
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: React.ReactNode, record: AdmissionInfo) => (
        <div className="flex gap-2">
          <Button
            className={`bookmark-button ${record.isBookmarked ? 'bookmarked' : 'not-bookmarked'}`}
            onClick={() => handleBookmark(record.id)}
          >
            {record.isBookmarked ? 'Bỏ quan tâm' : 'Quan tâm'}
          </Button>
          <Button type="link" onClick={() => handleView(record.id)}>
            View
          </Button>
        </div>
      ),
    },
  ];

  const handleBookmark = async (id: string) => {
    const item = admissionData.find((item) => item.id === id);
    if (!item) {
      message.error("Không tìm thấy thông tin tuyển sinh.");
      return;
    }
  
    if (!id) {
      message.error("ID không hợp lệ.");
      return;
    }
  
    const willBookmark = !item.isBookmarked;
  
    setAdmissionData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isBookmarked: willBookmark } : item
      )
    );
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isBookmarked: willBookmark } : item
      )
    );
  
    try {
      if (willBookmark) {
        await markWishlist(id);
        message.success("Đã thêm vào danh sách quan tâm");
      } else {
        await unmarkWishlist(id);
        message.success("Đã xóa khỏi danh sách quan tâm");
      }
    } catch (error) {
      const err = error as Error;
      setAdmissionData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, isBookmarked: !willBookmark } : item
        )
      );
      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, isBookmarked: !willBookmark } : item
        )
      );
      message.error("Không thể cập nhật danh sách quan tâm. Vui lòng thử lại sau.");
      console.error("Lỗi khi cập nhật trạng thái quan tâm:", err);
    }
  };

  return (
    <div>
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
          onChange={(e) => setSearchText(e.target.value)}
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

      {/* Modal hiển thị thông tin chi tiết */}
      <Modal
        title="Thông tin chi tiết tuyển sinh"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {detailLoading ? (
          <div>Loading...</div>
        ) : selectedAdmission ? (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Trường">{selectedAdmission.universityName}</Descriptions.Item>
              <Descriptions.Item label="Chỉ tiêu">{selectedAdmission.quota}</Descriptions.Item>
              <Descriptions.Item label="Thời gian xét tuyển">
                {selectedAdmission.admissionDate === 'N/A'
                  ? 'Chưa xác định'
                  : new Date(selectedAdmission.admissionDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn nộp hồ sơ">
                {selectedAdmission.deadline === 'N/A'
                  ? 'Chưa xác định'
                  : new Date(selectedAdmission.deadline).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>

            <h3 className="mt-4 font-semibold">Phương thức xét tuyển:</h3>
            {selectedAdmission.inforMethods.length > 0 ? (
              <List
                dataSource={selectedAdmission.inforMethods}
                renderItem={(method) => (
                  <List.Item>
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="Phương thức">{method.methodName}</Descriptions.Item>
                      <Descriptions.Item label="Khối">{method.scoreType}</Descriptions.Item>
                      <Descriptions.Item label="Điểm yêu cầu">{method.scoreRequirement}</Descriptions.Item>
                      <Descriptions.Item label="Tỷ lệ chỉ tiêu">{method.percentageOfQuota}%</Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              />
            ) : (
              <div>Không có phương thức xét tuyển</div>
            )}
          </div>
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Modal>
    </div>
  );
};

export default AdmissionPage;