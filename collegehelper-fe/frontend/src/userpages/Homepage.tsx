import { Card, Row, Col, Carousel, Button } from 'antd';
import { BookOutlined, SearchOutlined, HeartOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const features = [
    {
      icon: <SearchOutlined className="text-3xl text-blue-500" />,
      title: "Tra cứu tuyển sinh",
      description: "Tìm kiếm thông tin tuyển sinh của các trường đại học",
      path: "/user/admission"
    },
    {
      icon: <HeartOutlined className="text-3xl text-red-500" />,
      title: "Danh sách yêu thích",
      description: "Quản lý danh sách trường bạn quan tâm",
      path: "/user/wishlist"
    },
    {
      icon: <BellOutlined className="text-3xl text-yellow-500" />,
      title: "Tin tức mới nhất",
      description: "Cập nhật tin tức tuyển sinh và giáo dục",
      path: "/user/news"
    }
  ];

  const carouselItems = [
    {
      title: "Chào mừng đến với Hệ thống Tra cứu Đại học",
      description: "Khám phá và tìm kiếm thông tin tuyển sinh dễ dàng",
      bgColor: "#1890ff"
    },
    {
      title: "Mùa tuyển sinh 2024",
      description: "Cập nhật thông tin mới nhất về kỳ thi THPT và xét tuyển đại học",
      bgColor: "#52c41a"
    }
  ];

  const quickGuides = [
    {
      title: "Hướng dẫn chọn ngành",
      content: "Các bước để chọn ngành học phù hợp với bản thân",
      icon: <BookOutlined className="text-2xl text-green-500" />
    },
    {
      title: "Chuẩn bị hồ sơ",
      content: "Danh sách giấy tờ cần thiết cho hồ sơ xét tuyển",
      icon: <BookOutlined className="text-2xl text-purple-500" />
    },
    {
      title: "Tra cứu điểm chuẩn",
      content: "Xem điểm chuẩn các năm trước của các trường",
      icon: <BookOutlined className="text-2xl text-blue-500" />
    }
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Xin chào, {username || 'Người dùng'}! 👋
        </h1>
        <p className="text-gray-600">
          Chào mừng bạn đến với hệ thống tra cứu thông tin tuyển sinh đại học
        </p>
      </div>

      {/* Banner Carousel */}
      <Carousel autoplay className="mb-8">
        {carouselItems.map((item, index) => (
          <div key={index}>
            <div style={{ 
              height: '300px', 
              background: item.bgColor,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
              <p className="text-xl">{item.description}</p>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Main Features */}
      <h2 className="text-2xl font-bold mb-4">Tính năng chính</h2>
      <Row gutter={[16, 16]} className="mb-8">
        {features.map((feature, index) => (
          <Col span={8} key={index}>
            <Card 
              hoverable 
              className="text-center h-full"
              onClick={() => navigate(feature.path)}
            >
              <div className="flex flex-col items-center gap-4">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <Button type="primary">
                  Truy cập ngay
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Guides */}
      <h2 className="text-2xl font-bold mb-4">Hướng dẫn nhanh</h2>
      <Row gutter={[16, 16]} className="mb-8">
        {quickGuides.map((guide, index) => (
          <Col span={8} key={index}>
            <Card hoverable>
              <div className="flex items-start gap-4">
                {guide.icon}
                <div>
                  <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                  <p className="text-gray-600">{guide.content}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Help Section */}
      <Card className="bg-blue-50">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Bạn cần giúp đỡ?</h2>
          <p className="text-gray-600 mb-4">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
          <Button type="primary" size="large">
            Liên hệ hỗ trợ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Homepage; 