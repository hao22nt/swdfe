import React, { useState, useEffect } from "react";
import { getScore, updateScore } from "../../../api/ApiCollection";

interface Score {
  id: string;
  subjectName: string;
  year: string;
  score: number;
  examType: string;
  class: string;
}

const ScoreInput: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const response = await getScore();
        const scoreData = response.message.items.$values;
        setScores(scoreData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const handleScoreChange = (id: string, newScore: number) => {
    setScores(prevScores =>
      prevScores.map(score =>
        score.id === id ? { ...score, score: newScore } : score
      )
    );
  };

  const handleSaveScore = async (id: string) => {
    try {
      const scoreToUpdate = scores.find(score => score.id === id);
      if (!scoreToUpdate) {
        throw new Error("Không tìm thấy điểm để cập nhật");
      }

      const updatedData = {
        score: scoreToUpdate.score,
        examType: scoreToUpdate.examType,
      };

      await updateScore(id, updatedData);
      alert("Cập nhật điểm thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật điểm: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <span className="ml-4 text-lg text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Nhập Điểm Môn Học</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="p-4 text-left rounded-tl-lg">Môn học</th>
              <th className="p-4 text-left">Điểm</th>
              <th className="p-4 text-left rounded-tr-lg">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(({ id, subjectName, score }, index) => (
              <tr
                key={id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition-colors duration-200`}
              >
                <td className="p-4 text-gray-700 font-medium">{subjectName}</td>
                <td className="p-4">
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => handleScoreChange(id, parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200"
                    step="0.1"
                    min="0"
                    max="10"
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleSaveScore(id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
                  >
                    Lưu
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreInput;