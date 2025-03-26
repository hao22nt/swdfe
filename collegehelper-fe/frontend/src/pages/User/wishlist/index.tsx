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
    },
    {
      title: 'Ngành',
      dataIndex: 'majorName',
      key: 'majorName',
    },
    {
      title: 'Thời gian xét tuyển',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
    },
    {
      title: 'Hạn nộp hồ sơ',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
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
            style: {
              color: '#000',
            },
          }}
        >
          <Button
            type="primary"
            style={{
              color: '#000',
              backgroundColor: '#fff',
              borderColor: '#d9d9d9',
            }}
          >
            Xóa khỏi danh sách
          </Button>
        </Popconfirm>
      ),
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
      await fetchWishlist(); // Chỉ gọi nếu thực sự cần
    }
  };

  const handleRefresh = () => {
    fetchWishlist();
  };

  return (
    <Card
      title="Danh sách trường/ngành yêu thích"
      extra={<Button onClick={handleRefresh}>Làm mới</Button>}
      className="shadow-md hover:shadow-lg transition-shadow"
      headStyle={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        borderBottom: '2px solid #f0f0f0',
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
        }}
        className="custom-table"
        rowClassName="hover:bg-gray-50"
        locale={{ emptyText: 'Chưa có trường/ngành yêu thích' }}
      />
    </Card>
  );
};

export default WishlistPage;