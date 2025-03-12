import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { BookOutlined, HeartOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
const { Content, Sider } = Layout;

const UserLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/user/homepage',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/user/admission',
      icon: <BookOutlined />,
      label: 'Tra cứu tuyển sinh',
    },
    {
      key: '/user/wishlist',
      icon: <HeartOutlined />,
      label: 'Danh sách yêu thích',
    },
    {
      key: '/user/news',
      icon: <FileTextOutlined />,
      label: 'Tin tức',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          zIndex: 1,
        }}
        width={250}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: collapsed ? '20px' : '24px',
            fontWeight: 'bold',
            color: '#1890ff'
          }}>
            {collapsed ? 'UNI' : 'UNIVERSITY'}
          </h1>
        </div>
        <Menu
          theme="light"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ 
            borderRight: 'none',
            padding: '8px',
          }}
        />
      </Sider>
      <Layout style={{ 
        background: '#f5f7f9',
        position: 'relative',
      }}>
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
    </Layout>
  );
};

export default UserLayout; 