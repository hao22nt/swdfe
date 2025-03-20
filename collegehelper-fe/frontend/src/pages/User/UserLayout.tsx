import React from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, BookOutlined, HeartOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Chatbot from './ChatPopup';

const { Header, Content } = Layout;

const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/user/profile')} icon={<UserOutlined />}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header - Thanh menu ngang */}
      <Header style={{
        background: '#1890ff', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 24px',
      }}>
        {/* Menu điều hướng */}
        <Menu 
          theme="dark" 
          mode="horizontal" 
          selectedKeys={[location.pathname]} 
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, minWidth: 0 }}
        >
          <Menu.Item key="/user/homepage" icon={<HomeOutlined />}>Trang chủ</Menu.Item>
          <Menu.Item key="/user/admission" icon={<BookOutlined />}>Tra cứu tuyển sinh</Menu.Item>
          <Menu.Item key="/user/wishlist" icon={<HeartOutlined />}>Danh sách yêu thích</Menu.Item>
          <Menu.Item key="/user/news" icon={<FileTextOutlined />}>Tin tức</Menu.Item>
        </Menu>

        {/* Avatar + Dropdown */}
        <Dropdown overlay={userMenu} trigger={['click']}>
          <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
        </Dropdown>
      </Header>

      {/* Nội dung trang */}
      <Layout style={{ background: '#f5f7f9' }}>
        <Content style={{
          margin: '24px',
          padding: '24px',
          minHeight: 280,
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <Outlet />
        </Content>
      </Layout>
      <Chatbot />
    </Layout>
  );
};

export default UserLayout;
