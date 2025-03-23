import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

function SurveyResults() {
  const { surveyName } = useParams();
  const [responses, setResponses] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/survey/${surveyName}/results`)
      .then(response => setResponses(response.data))
      .catch(error => console.error('설문 결과 불러오기 실패:', error));
  }, [surveyName]);

  // 필터 입력에 따른 응답 필터링 (질문 또는 답변)
  const filteredResponses = responses.filter(response => {
    const lowerFilter = filter.toLowerCase();
    return (
      response.question.toLowerCase().includes(lowerFilter) ||
      response.user_answer.toLowerCase().includes(lowerFilter)
    );
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">{surveyName} 설문 결과</h1>
      
      {/* 필터 입력 */}
      <div className="mb-4">
        <input 
          type="text"
          placeholder="필터 검색 (질문 또는 답변)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-80 p-2 border border-gray-300 rounded-lg"
        />
      </div>
      
      <div className="w-96 bg-white p-4 shadow-lg rounded-lg">
        {filteredResponses.length > 0 ? (
          <ul>
            {filteredResponses.map((response, index) => (
              <li key={index} className="border-b last:border-none p-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {index + 1}. {response.question}
                  </p>
                  <p className="text-gray-600">
                    답변: {response.user_answer}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">응답이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default SurveyResults;
