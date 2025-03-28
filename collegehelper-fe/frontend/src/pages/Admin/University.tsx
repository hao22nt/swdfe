import { useEffect, useState } from "react";
import { fetchUniversity, addUniversity, deleteUniversity, updateUniversity, getUniversityById } from "../../api/ApiCollection";

interface Major {
  id: string;
  tuitionFee: string;
  majorCode: string;
  universityName: string;
  majorName: string;
}

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
  description: string | null;
  rankingNational: number;
  rankingInternational: number;
  image: string | null;
  majors?: Major[];
}

interface UniversityApi {
  Name: string;
  Location: string;
  UniversityCode: string;
  Email: string;
  PhoneNumber: string;
  EstablishedDate: string;
  Accreditation: string;
  Type: string;
  Description: string;
  RankingNational: number;
  RankingInternational: number;
  Image: File | null;
}

const UniversityPage = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [newUniversity, setNewUniversity] = useState<UniversityApi>({
    Name: "",
    Location: "",
    UniversityCode: "",
    Email: "",
    PhoneNumber: "",
    EstablishedDate: "",
    Accreditation: "",
    Type: "",
    Description: "",
    RankingNational: 0,
    RankingInternational: 0,
    Image: null,
  });
  const [editUniversity, setEditUniversity] = useState<UniversityApi>({
    Name: "",
    Location: "",
    UniversityCode: "",
    Email: "",
    PhoneNumber: "",
    EstablishedDate: "",
    Accreditation: "",
    Type: "",
    Description: "",
    RankingNational: 0,
    RankingInternational: 0,
    Image: null,
  });
  const [editId, setEditId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

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
        const mockData: University[] = [
          {
            id: "1",
            name: "Đại học Bách Khoa Hà Nội",
            location: "Hà Nội",
            universityCode: "BKA",
            email: "dhbk@hust.edu.vn",
            phoneNumber: "024.3869.2008",
            establishedDate: "1956-03-15",
            accreditation: "A",
            type: "State",
            description: "Trường đại học kỹ thuật hàng đầu Việt Nam",
            rankingNational: 1,
            rankingInternational: 401,
            image: "https://example.com/image.jpg",
          },
        ];
        setUniversities(mockData);
      } finally {
        setLoading(false);
      }
    };
    loadUniversities();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUniversities = universities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(universities.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    setUniversity: React.Dispatch<React.SetStateAction<UniversityApi>>
  ) => {
    const { name, value } = e.target;
    setUniversity((prev) => ({
      ...prev,
      [name]: name === "RankingNational" || name === "RankingInternational"
        ? Number(value)
        : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUniversity: React.Dispatch<React.SetStateAction<UniversityApi>>
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("File ảnh vượt quá kích thước cho phép (5MB)");
        return;
      }
    }
    setUniversity((prev) => ({
      ...prev,
      Image: file,
    }));
  };

  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Bạn cần đăng nhập để thêm trường đại học");
        return;
      }

      const requiredFields = [
        "Name",
        "Location",
        "UniversityCode",
        "Email",
        "PhoneNumber",
        "Type",
        "Description",
        "Image",
      ];
      const missingFields = requiredFields.filter(
        (field) => !newUniversity[field as keyof UniversityApi]
      );
      if (missingFields.length > 0) {
        setError(`Vui lòng điền các trường bắt buộc: ${missingFields.join(", ")}`);
        return;
      }

      const addedUniversity = await addUniversity(newUniversity);
      setUniversities((prev) => [...prev, addedUniversity]);
      setIsAddModalOpen(false);
      setNewUniversity({
        Name: "",
        Location: "",
        UniversityCode: "",
        Email: "",
        PhoneNumber: "",
        EstablishedDate: "",
        Accreditation: "",
        Type: "",
        Description: "",
        RankingNational: 0,
        RankingInternational: 0,
        Image: null,
      });
      setCurrentPage(1);
    } catch (error) {
      console.error("Error adding university:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Không thể thêm trường đại học vào hệ thống"
      );
    }
  };

  const handleDeleteUniversity = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa trường đại học này?")) {
      return;
    }

    try {
      await deleteUniversity(id);
      setUniversities((prev) => prev.filter((uni) => uni.id !== id));
      setError(null);
      if (currentUniversities.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting university:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Không thể xóa trường đại học"
      );
    }
  };

  const handleEditUniversity = (uni: University) => {
    setEditId(uni.id);
    setEditUniversity({
      Name: uni.name,
      Location: uni.location,
      UniversityCode: uni.universityCode,
      Email: uni.email,
      PhoneNumber: uni.phoneNumber,
      EstablishedDate: uni.establishedDate,
      Accreditation: uni.accreditation,
      Type: uni.type,
      Description: uni.description || "",
      RankingNational: uni.rankingNational,
      RankingInternational: uni.rankingInternational,
      Image: null,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Bạn cần đăng nhập để cập nhật trường đại học");
        return;
      }

      const requiredFields = [
        "Name",
        "Location",
        "UniversityCode",
        "Email",
        "PhoneNumber",
        "Type",
        "Description",
      ];
      const missingFields = requiredFields.filter(
        (field) => !editUniversity[field as keyof UniversityApi]
      );
      if (missingFields.length > 0) {
        setError(`Vui lòng điền các trường bắt buộc: ${missingFields.join(", ")}`);
        return;
      }

      const updatedUniversity = await updateUniversity(editId, editUniversity);
      setUniversities((prev) =>
        prev.map((uni) => (uni.id === editId ? updatedUniversity : uni))
      );
      setIsEditModalOpen(false);
      setEditUniversity({
        Name: "",
        Location: "",
        UniversityCode: "",
        Email: "",
        PhoneNumber: "",
        EstablishedDate: "",
        Accreditation: "",
        Type: "",
        Description: "",
        RankingNational: 0,
        RankingInternational: 0,
        Image: null,
      });
      setEditId("");
    } catch (error) {
      console.error("Error updating university:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trường đại học"
      );
    }
  };

  const handleViewUniversity = async (id: string) => {
    try {
      const response = await getUniversityById(id);
      console.log("API Response:", JSON.stringify(response, null, 2));

      const universityData = response.message || response;
      if (!universityData) {
        throw new Error("Không tìm thấy thông tin trường đại học");
      }

      let majors: Major[] = [];
      if (universityData.majors && universityData.majors.$values) {
        majors = universityData.majors.$values.map((major: any) => ({
          id: major.id,
          tuitionFee: major.tuitionFee,
          majorCode: major.majorCode,
          universityName: major.universityName,
          majorName: major.majorName,
        }));
      } else {
        console.warn("Không tìm thấy dữ liệu ngành học trong phản hồi API");
      }

      const university: University = {
        id: universityData.id,
        name: universityData.name,
        location: universityData.location,
        universityCode: universityData.universityCode,
        email: universityData.email,
        phoneNumber: universityData.phoneNumber,
        establishedDate: universityData.establishedDate,
        accreditation: universityData.accreditation,
        type: universityData.type,
        description: universityData.description || null,
        rankingNational: universityData.rankingNational || 0,
        rankingInternational: universityData.rankingInternational || 0,
        image: universityData.image || null,
        majors: majors,
      };

      console.log("Mapped University:", university);
      setSelectedUniversity(university);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching university details:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Không thể lấy thông tin chi tiết trường đại học"
      );
      setIsViewModalOpen(false);
      setSelectedUniversity(null);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Đang tải...</p>;
  if (error && universities.length === 0)
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center">
          Danh sách các trường đại học
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thêm trường mới
        </button>
      </div>

      {error && (
        <p className="text-center text-yellow-500 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUniversities.map((uni) => (
          <div key={uni.id} className="border p-4 rounded-lg shadow-md relative">
            {uni.image ? (
              <img
                src={uni.image}
                alt={uni.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
            ) : (
              <div className="w-full h-40 bg-gray-300 rounded-md flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <h2 className="text-lg font-semibold">{uni.name}</h2>
            <p className="text-gray-600">{uni.location}</p>
            <p className="text-sm text-gray-500"><strong>Mã trường:</strong> {uni.universityCode}</p>
            <p className="text-sm text-gray-500"><strong>Email:</strong> {uni.email}</p>
            <p className="text-sm text-gray-500"><strong>Điện thoại:</strong> {uni.phoneNumber}</p>
            <p className="text-sm text-gray-500"><strong>Kiểm định:</strong> {uni.accreditation}</p>
            <p className="text-sm text-gray-500"><strong>Loại:</strong> {uni.type}</p>
            {uni.description && <p className="text-sm text-gray-500">{uni.description}</p>}
            <p className="text-sm text-gray-500"><strong>Thứ hạng quốc gia:</strong> {uni.rankingNational}</p>
            <p className="text-sm text-gray-500"><strong>Thứ hạng quốc tế:</strong> {uni.rankingInternational}</p>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleViewUniversity(uni.id)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Xem
              </button>
              <button
                onClick={() => handleEditUniversity(uni)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Cập nhật
              </button>
              <button
                onClick={() => handleDeleteUniversity(uni.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Thêm trường đại học mới</h2>
            <form onSubmit={handleAddUniversity}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên trường</label>
                <input
                  type="text"
                  name="Name"
                  value={newUniversity.Name}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                <input
                  type="text"
                  name="Location"
                  value={newUniversity.Location}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mã trường</label>
                <input
                  type="text"
                  name="UniversityCode"
                  value={newUniversity.UniversityCode}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={newUniversity.Email}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  name="PhoneNumber"
                  value={newUniversity.PhoneNumber}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ngày thành lập</label>
                <input
                  type="date"
                  name="EstablishedDate"
                  value={newUniversity.EstablishedDate}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Kiểm định</label>
                <input
                  type="text"
                  name="Accreditation"
                  value={newUniversity.Accreditation}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Loại trường</label>
                <select
                  name="Type"
                  value={newUniversity.Type}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                >
                  <option value="">Chọn loại trường</option>
                  <option value="State">State (Nhà nước)</option>
                  <option value="Private">Private (Tư nhân)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  name="Description"
                  value={newUniversity.Description}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Thứ hạng quốc gia</label>
                <input
                  type="number"
                  name="RankingNational"
                  value={newUniversity.RankingNational}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Thứ hạng quốc tế</label>
                <input
                  type="number"
                  name="RankingInternational"
                  value={newUniversity.RankingInternational}
                  onChange={(e) => handleInputChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ảnh</label>
                <input
                  type="file"
                  name="Image"
                  onChange={(e) => handleFileChange(e, setNewUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  accept="image/*"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Cập nhật trường đại học</h2>
            <form onSubmit={handleUpdateUniversity}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên trường</label>
                <input
                  type="text"
                  name="Name"
                  value={editUniversity.Name}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                <input
                  type="text"
                  name="Location"
                  value={editUniversity.Location}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mã trường</label>
                <input
                  type="text"
                  name="UniversityCode"
                  value={editUniversity.UniversityCode}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={editUniversity.Email}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  name="PhoneNumber"
                  value={editUniversity.PhoneNumber}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ngày thành lập</label>
                <input
                  type="date"
                  name="EstablishedDate"
                  value={editUniversity.EstablishedDate}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Kiểm định</label>
                <input
                  type="text"
                  name="Accreditation"
                  value={editUniversity.Accreditation}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Loại trường</label>
                <select
                  name="Type"
                  value={editUniversity.Type}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                >
                  <option value="">Chọn loại trường</option>
                  <option value="State">State (Nhà nước)</option>
                  <option value="Private">Private (Tư nhân)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  name="Description"
                  value={editUniversity.Description}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Thứ hạng quốc gia</label>
                <input
                  type="number"
                  name="RankingNational"
                  value={editUniversity.RankingNational}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Thứ hạng quốc tế</label>
                <input
                  type="number"
                  name="RankingInternational"
                  value={editUniversity.RankingInternational}
                  onChange={(e) => handleInputChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ảnh</label>
                <input
                  type="file"
                  name="Image"
                  onChange={(e) => handleFileChange(e, setEditUniversity)}
                  className="mt-1 block w-full border rounded-md p-2"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Thông tin chi tiết trường đại học</h2>
            <div className="space-y-4">
              {selectedUniversity.image ? (
                <img
                  src={selectedUniversity.image}
                  alt={selectedUniversity.name}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 rounded-md flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên trường:</label>
                <p className="text-gray-900">{selectedUniversity.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa điểm:</label>
                <p className="text-gray-900">{selectedUniversity.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã trường:</label>
                <p className="text-gray-900">{selectedUniversity.universityCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <p className="text-gray-900">{selectedUniversity.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại:</label>
                <p className="text-gray-900">{selectedUniversity.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày thành lập:</label>
                <p className="text-gray-900">{new Date(selectedUniversity.establishedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kiểm định:</label>
                <p className="text-gray-900">{selectedUniversity.accreditation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại trường:</label>
                <p className="text-gray-900">{selectedUniversity.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả:</label>
                <p className="text-gray-900">{selectedUniversity.description || "Không có mô tả"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thứ hạng quốc gia:</label>
                <p className="text-gray-900">{selectedUniversity.rankingNational}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thứ hạng quốc tế:</label>
                <p className="text-gray-900">{selectedUniversity.rankingInternational}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Danh sách ngành học:</label>
                {selectedUniversity.majors && selectedUniversity.majors.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {selectedUniversity.majors.map((major) => (
                      <li key={major.id} className="text-gray-900">
                        <strong>{major.majorName}</strong> (Mã ngành: {major.majorCode}) - Học phí: {major.tuitionFee}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-900">Không có ngành học nào</p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {isViewModalOpen && !selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <p className="text-center text-red-500">Không có dữ liệu để hiển thị</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityPage;