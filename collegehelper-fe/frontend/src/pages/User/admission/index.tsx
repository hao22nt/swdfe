import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Card, Modal, Descriptions, List } from 'antd';
import type { AdmissionInfo, AdmissionDetail, WishlistItem } from '../types';
import { getAdmissionList, getAdmissionDetail, markWishlist, unmarkWishlist, getWishlist } from '../../../api/ApiCollection';

const AdmissionPage: React.FC = () => {
  const [admissionData, setAdmissionData] = useState<AdmissionInfo[]>([]);
  const [filteredData, setFilteredData] = useState<AdmissionInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<(AdmissionDetail & { universityName?: string }) | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchAdmissions = async () => {
      setLoading(true);
      try {
        const data = await getAdmissionList();
        console.log('🔍 Fetched Admission Data:', JSON.stringify(data, null, 2));

        let wishlist: WishlistItem[] = [];
        try {
          const wishlistResponse = await getWishlist();
          console.log('🔍 Fetched Wishlist:', JSON.stringify(wishlistResponse, null, 2));
          wishlist = wishlistResponse?.message?.items?.$values || [];
        } catch (error) {
          console.error("Không thể lấy danh sách quan tâm:", error);
          message.warning("Không thể lấy danh sách quan tâm. Trạng thái quan tâm có thể không chính xác.");
          wishlist = [];
        }

        const updatedData = data.map((item: AdmissionInfo) => ({
          ...item,
          isBookmarked: wishlist.some((wishlistItem: WishlistItem) => wishlistItem.id === item.id) || false,
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

  useEffect(() => {
    const filtered = admissionData.filter(
      (item) =>
        item.universityName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.majorName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, admissionData]);

  const handleView = async (id: string) => {
    setDetailLoading(true);
    try {
      const detail = await getAdmissionDetail(id);
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
      render: (text: string | number) => (text !== undefined && text !== null ? text : 'N/A'),
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
      render: (text: string) =>
        !text || text === '0001-01-01T00:00:00'
          ? 'Chưa xác định'
          : new Date(text).toLocaleDateString(),
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: React.ReactNode, record: AdmissionInfo) => (
        <div className="flex gap-3">
          <Button
            className={`${
              record.isBookmarked
                ? 'bg-yellow-500 text-white border-none hover:bg-yellow-600'
                : 'bg-green-500 text-white border-none hover:bg-green-600'
            } transition-all duration-300 rounded-lg px-4 py-1 font-medium`}
            onClick={() => handleBookmark(record.id)}
          >
            {record.isBookmarked ? 'Bỏ quan tâm' : 'Quan tâm'}
          </Button>
          <Button
            type="link"
            className="text-blue-500 hover:text-blue-700 font-medium"
            onClick={() => handleView(record.id)}
          >
            Xem chi tiết
          </Button>
        </div>
      ),
      className: 'text-center',
    },
  ];

  const handleBookmark = async (id: string) => {
    const item = admissionData.find((item) => item.id === id);
    if (!item) {
      message.error("Không tìm thấy thông tin tuyển sinh.");
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
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <Card
        title="Tra cứu thông tin tuyển sinh"
        className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
        headStyle={{
          background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
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
      >
        <Input.Search
          placeholder="Tìm kiếm theo tên trường hoặc ngành..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size="large"
          className="max-w-xl mb-6 rounded-lg shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
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
            className: 'mt-4',
          }}
          className="rounded-lg overflow-hidden"
          rowClassName="hover:bg-gray-50 transition-colors duration-200"
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title="Thông tin chi tiết tuyển sinh"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-lg"
        styles={{
          header: {
            background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
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

            <h3 className="mt-6 text-lg font-semibold text-gray-800">Phương thức xét tuyển:</h3>
            {selectedAdmission.inforMethods.length > 0 ? (
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
            ) : (
              <div className="text-gray-500">Không có phương thức xét tuyển</div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">Không có dữ liệu</div>
        )}
      </Modal>
    </div>
  );
};

export default AdmissionPage;