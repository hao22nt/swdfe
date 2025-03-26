import React, { useState } from "react";

interface Score {
  id: string;
  subjectName: string;
  year: string;
  score: number;
  examType: string;
  class: string;
}

const mockData: Score[] = [
  { id: "b57c4f5e52a949d8858b95064cf1c1ea", subjectName: "Ngữ Văn", year: "0001-01-01T00:00:00", score: 8, examType: "THPT Quốc gia", class: "12" },
  { id: "5cd0336dbe9f465daf412af2eef87f49", subjectName: "Toán", year: "0001-01-01T00:00:00", score: 10, examType: "THPT Quốc gia", class: "12" },
  { id: "c9136a905c174f5babf531766c030838", subjectName: "Tiếng Anh", year: "0001-01-01T00:00:00", score: 9.5, examType: "THPT Quốc gia", class: "12" },
  { id: "0c283940f2d74fb5acc3921c62ea96dd", subjectName: "Hóa", year: "0001-01-01T00:00:00", score: 8, examType: "THPT Quốc gia", class: "12" },
  { id: "059cf61aa30c4beaac28bb002c7a1bf7", subjectName: "Sinh học", year: "0001-01-01T00:00:00", score: 7, examType: "THPT Quốc gia", class: "12" }
];

const ScoreInput: React.FC = () => {
  const [scores, setScores] = useState<Score[]>(mockData);

  const handleScoreChange = (id: string, newScore: number) => {
    setScores(prevScores =>
      prevScores.map(score =>
        score.id === id ? { ...score, score: newScore } : score
      )
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Nhập điểm</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Môn học</th>
            <th className="border p-2">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {scores.map(({ id, subjectName, score }) => (
            <tr key={id}>
              <td className="border p-2">{subjectName}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={score}
                  onChange={(e) => handleScoreChange(id, parseFloat(e.target.value))}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreInput;
