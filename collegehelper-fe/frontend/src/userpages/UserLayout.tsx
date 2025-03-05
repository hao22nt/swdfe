import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { BookOutlined, HeartOutlined, FileTextOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Content, Sider } = Layout;

const UserLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout; 