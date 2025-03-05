import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SurveyResults() {
  const { surveyName } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/survey/${surveyName}/results`)
      .then(response => setResponses(response.data))
      .catch(error => console.error('설문 결과 불러오기 실패:', error));
  }, [surveyName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">{surveyName} 설문 결과</h1>
      <div className="w-96 bg-white p-4 shadow-lg rounded-lg">
        {responses.length > 0 ? (
          <ul>
            {responses.map((response, index) => (
              <li key={index} className="border-b last:border-none p-2">
                <p className="font-semibold">{index + 1}. {response.question}</p>
                <p className="text-gray-600">답변: {response.user_answer}</p>
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
