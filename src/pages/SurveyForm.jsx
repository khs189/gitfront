import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

function SurveyForm() {
  const [surveyName, setSurveyName] = useState('');
  const navigate = useNavigate();

  const handleCreateSurvey = async () => {
    if (!surveyName.trim()) {
      alert('설문 이름을 입력하세요.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/surveys`, { survey_name: surveyName });
      alert('설문이 생성되었습니다.');
      navigate('/home');
    } catch (error) {
      alert('설문 생성 실패: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">새 설문 만들기</h1>
      <input 
        type="text" 
        placeholder="설문 이름 입력" 
        value={surveyName} 
        onChange={(e) => setSurveyName(e.target.value)}
        className="w-80 p-2 border border-gray-300 rounded-lg mb-4"
      />
      <button onClick={handleCreateSurvey} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        생성하기
      </button>
    </div>
  );
}

export default SurveyForm;
