import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Popconfirm, message } from 'antd';
import type { WishlistItem } from '../types';
import { getWishlist, unmarkWishlist } from '../../../api/ApiCollection';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const wishlistResponse = await getWishlist();
      console.log('🔍 Fetched Wishlist after unmark:', JSON.stringify(wishlistResponse, null, 2));
  
      const wishlistData = wishlistResponse?.message?.items?.$values || [];
      const uniqueWishlistData = Array.from(
        new Map(wishlistData.map((item: any) => [item.id, item])).values()
      );
  
      const formattedWishlist = uniqueWishlistData.map((item: any) => ({
        id: item.id,
        universityName: item.universityName || 'N/A',
        majorName: item.majorName || 'N/A',
        admissionDate: item.admisstionDate
          ? new Date(item.admisstionDate).toLocaleDateString()
          : 'Chưa xác định',
        deadline: item.deadline
          ? new Date(item.deadline).toLocaleDateString()
          : 'Chưa xác định',
        quota: item.quota || 'N/A',
      }));
  
      setWishlist(formattedWishlist);
      setPagination({
        current: wishlistResponse?.message?.currentPage || 1,
        pageSize: wishlistResponse?.message?.pageSize || 5,
        total: wishlistResponse?.message?.totalItems || 0,
      });
    } catch (error) {
      const err = error as Error;
      message.error('Không thể tải danh sách quan tâm: ' + err.message);
      console.error('Fetch wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const columns = [
    {
      title: 'Trường',
      dataIndex: 'universityName',
      key: 'universityName',
      sorter: (a: WishlistItem, b: WishlistItem) =>
        a.universityName.localeCompare(b.universityName),
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Ngành',
      dataIndex: 'majorName',
      key: 'majorName',
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Thời gian xét tuyển',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Hạn nộp hồ sơ',
      dataIndex: 'deadline',
      key: 'deadline',
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
      className: 'text-gray-700 font-medium',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: React.ReactNode, record: WishlistItem) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => handleRemove(record.id)}
          okText="Có"
          cancelText="Không"
          okType="default"
          okButtonProps={{
            className: 'text-black hover:bg-gray-200',
          }}
        >
          <Button
            type="primary"
            className="bg-red-500 text-white border-none hover:bg-red-600 transition-all duration-300 rounded-lg px-4 py-1"
          >
            Xóa khỏi danh sách
          </Button>
        </Popconfirm>
      ),
      className: 'text-center',
    },
  ];

  const handleRemove = async (id: string) => {
    try {
      const response = await unmarkWishlist(id);
      console.log('🔍 Unmark Wishlist Response:', response);
  
      if (response?.message === 'UnMarked!') {
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
  
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
          const parsedWishlist = JSON.parse(storedWishlist);
          const updatedLocalWishlist = parsedWishlist.filter(
            (item: any) => item.admissionInforId !== id
          );
          localStorage.setItem('wishlist', JSON.stringify(updatedLocalWishlist));
        }
  
        message.success('Đã xóa khỏi danh sách quan tâm');
      } else {
        throw new Error('API unmarkWishlist không trả về trạng thái thành công');
      }
    } catch (error) {
      const err = error as Error;
      message.error('Không thể xóa khỏi danh sách quan tâm: ' + err.message);
      console.error('Remove wishlist item error:', err);
      await fetchWishlist();
    }
  };

  const handleRefresh = () => {
    fetchWishlist();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <Card
        title="Danh sách trường/ngành yêu thích"
        extra={
          <Button
            onClick={handleRefresh}
            className="bg-blue-500 text-white border-none hover:bg-blue-600 transition-all duration-300 rounded-lg px-4 py-1 font-medium"
          >
            Làm mới
          </Button>
        }
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
        <Table
          columns={columns}
          dataSource={wishlist}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} mục yêu thích`,
            className: 'mt-4',
          }}
          className="rounded-lg overflow-hidden"
          rowClassName="hover:bg-gray-50 transition-colors duration-200"
          locale={{ emptyText: 'Chưa có trường/ngành yêu thích' }}
          scroll={{ x: 'max-content' }} // Responsive cho table
        />
      </Card>
    </div>
  );
};

export default WishlistPage;