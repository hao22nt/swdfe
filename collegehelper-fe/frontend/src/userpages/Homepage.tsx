import { useEffect, useState } from "react";
import { fetchUniversity } from "../api/ApiCollection";
import { Card, Row, Col, Statistic, Carousel, Button, Modal } from 'antd';
import { UserOutlined, BankOutlined, BookOutlined, GlobalOutlined } from '@ant-design/icons';

interface University {
  id: string;
  name: string;
  location: string;
  universityCode: string;
  email: string;
  phoneNumber: string;
  establishedDate: string;
  accreditation: string;
  type: string;
  description: string;
  rankingNational: number;
  rankingInternational: number;
  image: string | null;
}

const Homepage = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const loadUniversities = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchUniversity();
        if (response && response.items && Array.isArray(response.items)) {
          setUniversities(response.items);
        } else {
          throw new Error("Dữ liệu không hợp lệ từ API");
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        setError(
          apiError instanceof Error
            ? apiError.message
            : "Không thể tải dữ liệu trường đại học"
        );
      } finally {
        setLoading(false);
      }
    };
    loadUniversities();
  }, []);

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "" || uni.type === filterType;
    return matchesSearch && matchesType;
  });

  const carouselItems = [
    {
      title: "Chào mừng đến với Hệ thống Tra cứu Đại học",
      description: "Khám phá thông tin chi tiết về các trường đại học hàng đầu Việt Nam",
      image: "https://example.com/banner1.jpg"
    },
    {
      title: "Tìm kiếm trường phù hợp",
      description: "Công cụ tìm kiếm thông minh giúp bạn tìm được trường học phù hợp nhất",
      image: "https://example.com/banner2.jpg"
    }
  ];

  const showDetails = (uni: University) => {
    setSelectedUniversity(uni);
    setIsModalVisible(true);
  };

  if (loading) return <p className="text-center text-gray-500">Đang tải...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      {/* Banner Carousel */}
      <Carousel autoplay className="mb-8">
        {carouselItems.map((item, index) => (
          <div key={index}>
            <div style={{ 
              height: '300px', 
              background: '#364d79',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px'
            }}>
              <h2 style={{ color: '#fff', fontSize: '2rem' }}>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-8">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số trường"
              value={universities.length}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Trường Công lập"
              value={universities.filter(u => u.type === 'State').length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Trường Tư thục"
              value={universities.filter(u => u.type === 'Private').length}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Top 100 Quốc tế"
              value={universities.filter(u => u.rankingInternational <= 100).length}
              prefix={<GlobalOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Featured Universities */}
      <h2 className="text-2xl font-bold mb-4">Trường Đại học Nổi bật</h2>
      <Row gutter={[16, 16]}>
        {universities.slice(0, 3).map((uni) => (
          <Col span={8} key={uni.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={uni.name}
                  src={uni.image || 'https://via.placeholder.com/300x200'}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={uni.name}
                description={
                  <div>
                    <p>{uni.location}</p>
                    <p>Xếp hạng QS: {uni.rankingInternational}</p>
                  </div>
                }
              />
              <Button type="primary" className="mt-4" block onClick={() => showDetails(uni)}>
                Xem chi tiết
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Links */}
      <Row gutter={[16, 16]} className="mt-8">
        <Col span={8}>
          <Card title="Tài nguyên hữu ích">
            <ul className="list-none">
              <li className="mb-2">
                <a href="#">Hướng dẫn chọn trường</a>
              </li>
              <li className="mb-2">
                <a href="#">Thông tin tuyển sinh 2024</a>
              </li>
              <li className="mb-2">
                <a href="#">Học bổng du học</a>
              </li>
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tin tức mới nhất">
            <ul className="list-none">
              <li className="mb-2">
                <a href="#">Cập nhật điểm chuẩn 2024</a>
              </li>
              <li className="mb-2">
                <a href="#">Thay đổi trong kỳ thi THPT</a>
              </li>
              <li className="mb-2">
                <a href="#">Chính sách tuyển sinh mới</a>
              </li>
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Hỗ trợ">
            <ul className="list-none">
              <li className="mb-2">
                <a href="#">Câu hỏi thường gặp</a>
              </li>
              <li className="mb-2">
                <a href="#">Liên hệ tư vấn</a>
              </li>
              <li className="mb-2">
                <a href="#">Hướng dẫn sử dụng</a>
              </li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Search Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Tìm kiếm trường đại học</h2>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên trường hoặc địa điểm..."
            className="px-4 py-2 border rounded-lg flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Tất cả loại trường</option>
            <option value="State">Trường công lập</option>
            <option value="Private">Trường tư thục</option>
          </select>
        </div>
        <Row gutter={[16, 16]}>
          {filteredUniversities.map((uni) => (
            <Col span={8} key={uni.id}>
              <Card hoverable>
                <Card.Meta
                  title={uni.name}
                  description={uni.location}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        title={selectedUniversity?.name}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedUniversity && (
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={selectedUniversity.image || 'https://via.placeholder.com/800x400'}
                alt={selectedUniversity.name}
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </div>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="space-y-2">
                  <p><strong>Địa điểm:</strong> {selectedUniversity.location}</p>
                  <p><strong>Mã trường:</strong> {selectedUniversity.universityCode}</p>
                  <p><strong>Email:</strong> {selectedUniversity.email}</p>
                  <p><strong>Điện thoại:</strong> {selectedUniversity.phoneNumber}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className="space-y-2">
                  <p><strong>Ngày thành lập:</strong> {selectedUniversity.establishedDate}</p>
                  <p><strong>Kiểm định:</strong> {selectedUniversity.accreditation}</p>
                  <p><strong>Loại trường:</strong> {selectedUniversity.type === 'State' ? 'Công lập' : 'Tư thục'}</p>
                  <p><strong>Xếp hạng quốc gia:</strong> {selectedUniversity.rankingNational}</p>
                  <p><strong>Xếp hạng quốc tế:</strong> {selectedUniversity.rankingInternational}</p>
                </div>
              </Col>
            </Row>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
              <p>{selectedUniversity.description}</p>
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="primary" onClick={() => setIsModalVisible(false)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Homepage; 