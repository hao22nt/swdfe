import React, { useState } from 'react';
import { Table, Card, Button, Popconfirm, message } from 'antd';
import type { WishlistItem } from '../types';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

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
      title: 'Ngày thêm',
      dataIndex: 'addedDate',
      key: 'addedDate',
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
        >
          <Button danger>Xóa khỏi danh sách</Button>
        </Popconfirm>
      ),
    },
  ];

  const handleRemove = (id: number) => {
    setWishlist(wishlist.filter(item => item.id !== id));
    message.success('Đã xóa khỏi danh sách yêu thích');
  };

  return (
    <Card 
      title="Danh sách trường/ngành yêu thích"
      className="shadow-md hover:shadow-lg transition-shadow"
      headStyle={{ 
        fontSize: '1.25rem',
        fontWeight: 'bold',
        borderBottom: '2px solid #f0f0f0'
      }}
    >
      <Table 
        columns={columns} 
        dataSource={wishlist} 
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} mục yêu thích`
        }}
        className="custom-table"
        rowClassName="hover:bg-gray-50"
        locale={{ emptyText: 'Chưa có trường/ngành yêu thích' }}
      />
    </Card>
  );
};

export default WishlistPage;
