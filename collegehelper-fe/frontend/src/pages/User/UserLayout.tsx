import React from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, BookOutlined, HeartOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Chatbot from './ChatPopup';
import './UserLayout.css';

const { Header, Content, Footer } = Layout;

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
        background: '#1A3D7C', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 24px',
      }}>
        {/* Logo và chuyển hướng về trang chủ */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/user/homepage')}>
          <img src="/src/assets/logo/logoweb.png" alt="Logo" style={{ height: '80px', marginRight: '10px' }} />
          <span style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', paddingRight: '70px'  }}>TuyensinhPro</span>
        </div>

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
          <Menu.Item key="/user/scores" icon={<FileTextOutlined />}>Điểm số</Menu.Item>
        </Menu>

        {/* Avatar + Dropdown */}
        <Dropdown overlay={userMenu} trigger={['click']}>
          <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
        </Dropdown>
      </Header>

      {/* Nội dung trang và Footer */}
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
        <Footer style={{ textAlign: 'center', background: '#fff', padding: '10px 24px' }}>
          ©2025 TuyensinhPRO - SWD Project.
        </Footer>
      </Layout>
      <Chatbot />
    </Layout>
  );
};

export default UserLayout;
