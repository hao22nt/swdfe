import React, { useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Button, message } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/user?pageNumber=1&pageSize=5', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        message.error('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card 
        loading={loading}
        className="shadow-lg rounded-lg"
        title={
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Thông tin tài khoản</span>
            <Button 
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate('/user/profile/edit')}
            >
              Chỉnh sửa
            </Button>
          </div>
        }
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4">
            <Avatar 
              size={200} 
              icon={<UserOutlined />}
              src={profile?.avatar}
              className="shadow-md"
            />
            <h2 className="text-xl font-semibold">{profile?.fullName || profile?.username}</h2>
            <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full">
              {profile?.role || 'User'}
            </span>
          </div>

          <div className="flex-1">
            <Descriptions 
              bordered
              column={1}
              labelStyle={{ 
                fontWeight: 'bold',
                width: '150px'
              }}
            >
              <Descriptions.Item label="Username">
                {profile?.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {profile?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {profile?.phoneNumber || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Đăng nhập cuối">
                {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500">Chưa có hoạt động nào</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile; 