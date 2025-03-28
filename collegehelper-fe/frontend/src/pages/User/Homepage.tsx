import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Carousel, Button, Statistic, Timeline, List, Tag, Badge } from 'antd';
import { 
  BookOutlined, SearchOutlined, HeartOutlined, BellOutlined,
  ClockCircleOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined,
  RocketOutlined, FireOutlined, ThunderboltOutlined, StarOutlined,
  MessageOutlined, PhoneOutlined, CustomerServiceOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchTotalUniversities } from '../../api/ApiCollection'; // Import API

interface TotalUniversitiesData {
  number: number;
  chartData: { name: string; value: number }[];
}

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [totalUniversities, setTotalUniversities] = useState<number>(0); // State cho số trường
  const [loading, setLoading] = useState<boolean>(true); // State cho trạng thái tải

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    const loadTotalUniversities = async () => {
      try {
        setLoading(true);
        const data: TotalUniversitiesData = await fetchTotalUniversities();
        setTotalUniversities(data.number);
      } catch (error) {
        console.error('Failed to fetch total universities:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTotalUniversities();
  }, []);

  const features = [
    {
      icon: <SearchOutlined className="text-3xl text-blue-500" />,
      title: "Search Admissions",
      description: "Find admission information",
      path: "/user/admission"
    },
    {
      icon: <HeartOutlined className="text-3xl text-red-500" />,
      title: "Wishlist",
      description: "Manage your favorite universities",
      path: "/user/wishlist"
    },
    {
      icon: <BellOutlined className="text-3xl text-yellow-500" />,
      title: "Latest News",
      description: "Stay updated with admission and education news",
      path: "/user/news"
    }
  ];

  const carouselItems = [
    {
      title: "Welcome to the University Search System",
      description: "Easily explore and search for admission information",
      bgColor: "from-blue-500 to-purple-600",
      icon: <RocketOutlined className="text-6xl mb-4" />
    },
    {
      title: "2024 Admission Season",
      description: "Get the latest updates on the national exam and university admissions",
      bgColor: "from-green-400 to-cyan-500",
      icon: <StarOutlined className="text-6xl mb-4" />
    },
    {
      title: "Scholarship Opportunities",
      description: "Discover valuable scholarships from top universities",
      bgColor: "from-yellow-400 to-orange-500",
      icon: <ThunderboltOutlined className="text-6xl mb-4" />
    }
  ];

  const quickGuides = [
    {
      title: "Guide to Choosing a Major",
      content: "Steps to select a major that suits you",
      icon: <BookOutlined className="text-2xl text-green-500" />
    },
    {
      title: "Prepare Your Application",
      content: "List of necessary documents for your application",
      icon: <BookOutlined className="text-2xl text-purple-500" />
    },
    {
      title: "Check Admission Scores",
      content: "View past admission scores of universities",
      icon: <BookOutlined className="text-2xl text-blue-500" />
    }
  ];

  const upcomingEvents = [
    {
      title: "Start of Admission Registration Wave 1",
      date: "15/06/2024",
      type: "success"
    },
    {
      title: "Deadline for Wave 1 Applications",
      date: "30/06/2024",
      type: "warning"
    },
    {
      title: "Announcement of Wave 1 Results",
      date: "15/07/2024",
      type: "processing"
    }
  ];

  const latestNews = [
    {
      title: "Announcement on 2024 National High School Exam",
      date: "01/05/2024",
      tags: ["Admission", "Hot"]
    },
    {
      title: "List of Universities Accepting Academic Records",
      date: "28/04/2024",
      tags: ["Admission"]
    },
    {
      title: "Admission Priority Policies for 2024",
      date: "25/04/2024",
      tags: ["Policy"]
    }
  ];

  const statistics = [
    {
      title: "Universities",
      value: loading ? "Loading..." : totalUniversities, // Dùng dữ liệu từ API
      icon: <BookOutlined className="text-blue-500" />
    },
    {
      title: "Majors",
      value: 67,
      icon: <CheckCircleOutlined className="text-green-500" />
    },
    {
      title: "Registered Candidates",
      value: "1M+",
      icon: <UserOutlined className="text-purple-500" />
    }
  ];

  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-102 transition-all">
        <h1 className="text-3xl font-bold mb-2 animate-pulse">
          Hello, {username || 'User'}! 👋
        </h1>
        <p className="text-lg opacity-90">
          Welcome to the university admission search system
        </p>
      </div>

      {/* Banner Carousel */}
      <Carousel autoplay className="mb-8 [&_.slick-dots_li_button]:bg-white/50 [&_.slick-dots_li.slick-active_button]:bg-white">
        {carouselItems.map((item, index) => (
          <div key={index}>
            <div className={`bg-gradient-to-r ${item.bgColor} h-[300px] rounded-xl shadow-2xl transform hover:scale-[1.02] transition-all`}>
              <div className="h-full flex flex-col justify-center items-center text-white p-8 text-center">
                {item.icon}
                <h2 className="text-4xl font-bold mb-4">{item.title}</h2>
                <p className="text-xl">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Statistics Section */}
      <Row gutter={[16, 16]} className="mb-8">
        {statistics.map((stat, index) => (
          <Col span={8} key={index}>
            <Card 
              hoverable 
              className="text-center transform hover:scale-105 transition-all"
              style={{ 
                background: 'linear-gradient(135deg, #fff 0%, #f0f7ff 100%)',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              <Badge.Ribbon text="2024" color="#4CAF50">
                <Statistic 
                  title={
                    <span className="flex items-center justify-center gap-2 text-lg">
                      {stat.icon}
                      {stat.title}
                    </span>
                  }
                  value={stat.value}
                  valueStyle={{ 
                    color: '#1890ff',
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }}
                  loading={stat.title === "Universities" && loading} // Hiển thị loading khi đang fetch
                />
              </Badge.Ribbon>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Features */}
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Main Features
      </h2>
      <Row gutter={[16, 16]} className="mb-8">
        {features.map((feature, index) => (
          <Col span={8} key={index}>
            <Card 
              className="text-center h-full transform hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onClick={() => navigate(feature.path)}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl p-3 rounded-full from-blue-500 to-purple-500 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <Button type="primary" size="large" className="bg-gradient-to-r from-blue-500 to-purple-500 border-0">
                  Access Now
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Timeline & News Section */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col span={12}>
          <Card 
            title={
              <span className="flex items-center gap-2 text-lg">
                <CalendarOutlined className="text-blue-500" />
                Upcoming Events
              </span>
            }
            className="backdrop-blur-md bg-white/90 shadow-xl"
            style={{ borderRadius: '15px' }}
          >
            <Timeline
              items={upcomingEvents.map(event => ({
                color: event.type,
                dot: <FireOutlined style={{ fontSize: '16px' }} />,
                children: (
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-all">
                    <span className="font-medium">{event.title}</span>
                    <Tag color={event.type} className="animate-pulse">
                      {event.date}
                    </Tag>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="Latest News" 
            extra={<BellOutlined />}
            className="backdrop-blur-md bg-white/90 shadow-xl"
            style={{ borderRadius: '15px' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={latestNews}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">
                          <ClockCircleOutlined className="mr-2" />
                          {item.date}
                        </span>
                        <div>
                          {item.tags.map(tag => (
                            <Tag color="blue" key={tag} className="ml-2">
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Guides */}
      <h2 className="text-2xl font-bold mb-4">Quick Guides</h2>
      <Row gutter={[16, 16]} className="mb-8">
        {quickGuides.map((guide, index) => (
          <Col span={8} key={index}>
            <Card 
              hoverable 
              className="transform hover:scale-105 transition-all"
              style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            >
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

      {/* Additional Resources Section */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col span={24}>
          <Card 
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white transform hover:scale-[1.02] transition-all"
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Exam Preparation Resources</h3>
                <p className="mb-4 text-lg">Access free resources for national exam preparation</p>
                <Button type="primary" size="large" ghost className="hover:bg-white hover:text-purple-600">
                  View Now
                </Button>
              </div>
              <BookOutlined className="text-8xl opacity-50 animate-float" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Help Section */}
      <Card 
        className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white overflow-hidden relative"
        style={{ 
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}
      >
        <div className="text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-xl mb-6 opacity-90">
            Our support team is available 24/7 to assist you
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              type="primary" 
              size="large" 
              ghost 
              className="hover:bg-white hover:text-blue-600 min-w-[200px]"
              icon={<MessageOutlined />}
            >
              Chat with Advisor
            </Button>
            <Button 
              type="primary" 
              size="large" 
              ghost 
              className="hover:bg-white hover:text-blue-600 min-w-[200px]"
              icon={<PhoneOutlined />}
            >
              Call Hotline
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10">
          <CustomerServiceOutlined style={{ fontSize: '200px' }} />
        </div>
      </Card>
    </div>
  );
};

export default Homepage;