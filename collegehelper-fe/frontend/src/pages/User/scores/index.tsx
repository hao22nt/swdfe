import React, { useState, useEffect } from "react";
import { getScore, updateScore, createScore, getSubjects, deleteScore } from "../../../api/ApiCollection";

interface Score {
  id: string;
  subjectName: string;
  year: string;
  score: number;
  examType: string;
  class: string;
}

interface Subject {
  id: string;
  name: string;
  description: string | null;
}

const decodeJWT = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const ScoreInput: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newScore, setNewScore] = useState({
    subjectId: "",
    score: 0,
    examType: "",
    class: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const scoresPerPage = 5;

  const fetchScores = async (page: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Không tìm thấy token, vui lòng đăng nhập");

      const decodedToken = decodeJWT(token);
      if (!decodedToken) throw new Error("Không thể giải mã token");

      const userId = decodedToken["userId"];
      if (!userId) throw new Error("Không tìm thấy userId trong token");

      const scoreResponse = await getScore(userId, page, scoresPerPage);
      setScores(scoreResponse.items);
      setTotalPages(Math.ceil(scoreResponse.totalItems / scoresPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Không tìm thấy token, vui lòng đăng nhập");

      const decodedToken = decodeJWT(token);
      if (!decodedToken) throw new Error("Không thể giải mã token");

      const userId = decodedToken["userId"];
      if (!userId) throw new Error("Không tìm thấy userId trong token");

      const scoreResponse = await getScore(userId, currentPage, scoresPerPage);
      setScores(scoreResponse.items);
      setTotalPages(Math.ceil(scoreResponse.totalItems / scoresPerPage));

      const subjectResponse = await getSubjects(1, 10);
      setSubjects(subjectResponse.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (id: string, newScore: number) => {
    const validatedScore = Math.min(Math.max(newScore, 0), 10); // Ensure score is between 0 and 10
    setScores(prevScores =>
      prevScores.map(score =>
        score.id === id ? { ...score, score: validatedScore } : score
      )
    );
  };

  const handleSaveScore = async (id: string) => {
    try {
      const scoreToUpdate = scores.find(score => score.id === id);
      if (!scoreToUpdate) throw new Error("Không tìm thấy điểm để cập nhật");

      await updateScore(id, { score: scoreToUpdate.score, examType: scoreToUpdate.examType, class: scoreToUpdate.class });
      alert("Cập nhật điểm thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật điểm: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleCreateScore = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const decodedToken = decodeJWT(token!);
      const userId = decodedToken["userId"];

      // Validate score before creating
      if (newScore.score < 0 || newScore.score > 10) {
        alert("Điểm phải nằm trong khoảng từ 0 đến 10!");
        return;
      }

      const scoreData = {
        subjectId: newScore.subjectId,
        userId,
        year: new Date().toISOString(),
        score: newScore.score,
        examType: newScore.examType,
        class: newScore.class,
      };

      await createScore(scoreData);
      setIsModalOpen(false);
      setNewScore({ subjectId: "", score: 0, examType: "", class: "" });
      await fetchScores(currentPage);
      alert("Tạo điểm thành công!");
    } catch (err) {
      alert("Lỗi khi tạo điểm: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleDeleteScore = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa điểm này không?")) return;
  
    try {
      await deleteScore(id);
      await fetchScores(currentPage); // Cập nhật danh sách điểm
      alert("Xóa điểm thành công!");
    } catch (err) {
      alert("Lỗi khi xóa điểm: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNewScoreChange = (value: number) => {
    const validatedScore = Math.min(Math.max(value, 0), 10); // Ensure score is between 0 and 10
    setNewScore({ ...newScore, score: validatedScore });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Nhập Điểm Môn Học</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          + Điểm
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="p-4 text-left rounded-tl-lg">Môn học</th>
              <th className="p-4 text-left">Điểm</th>
              <th className="p-4 text-left">Loại kỳ thi</th>
              <th className="p-4 text-left">Lớp</th>
              <th className="p-4 text-left rounded-tr-lg">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(({ id, subjectName, score, examType, class: className }, index) => (
              <tr key={id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50`}>
                <td className="p-4 text-gray-700 font-medium">{subjectName}</td>
                <td className="p-4">
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => handleScoreChange(id, parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                    step="0.1"
                    min="0"
                    max="10"
                  />
                </td>
                <td className="p-4 text-gray-700">{examType}</td>
                <td className="p-4 text-gray-700">{className}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleSaveScore(id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => handleDeleteScore(id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Trước
        </button>
        <span className="text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Thêm Điểm Mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Môn học</label>
                <select
                  value={newScore.subjectId}
                  onChange={(e) => setNewScore({ ...newScore, subjectId: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Chọn môn học</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Điểm</label>
                <input
                  type="number"
                  value={newScore.score}
                  onChange={(e) => handleNewScoreChange(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                  step="0.1"
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại kỳ thi</label>
                <input
                  type="text"
                  value={newScore.examType}
                  onChange={(e) => setNewScore({ ...newScore, examType: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lớp</label>
                <input
                  type="text"
                  value={newScore.class}
                  onChange={(e) => setNewScore({ ...newScore, class: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateScore}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!newScore.subjectId}
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreInput;