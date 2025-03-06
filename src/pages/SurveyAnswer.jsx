import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

function SurveyAnswer() {
  const { surveyName } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/survey/${surveyName}`)
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching survey questions:', error));
  }, [surveyName]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/survey/answers`, {
        survey_name: surveyName,
        answers: Object.entries(answers).map(([id, user_answer]) => ({
          question_id: id,
          user_answer
        }))
      });

      alert('응답이 저장되었습니다.');
      navigate(`/survey/${surveyName}/results`); // 설문 결과 페이지로 이동
    } catch (error) {
      alert('응답 저장 실패: ' + error.response?.data?.error);
    }
  };

  if (loading) return <p className="text-center">로딩 중...</p>;
  if (questions.length === 0) return <p className="text-center">질문이 없습니다.</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">{surveyName} 설문</h1>
      <p className="text-lg font-medium">{currentQuestion.title}</p>
      {currentQuestion.image_url && <img src={currentQuestion.image_url} alt="question" className="w-60 h-auto my-4" />}
      
      {/* 응답 입력 */}
      <input 
        type="text" 
        placeholder="답변을 입력하세요" 
        value={answers[currentQuestion.id] || ''} 
        onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
        className="w-80 p-2 border border-gray-300 rounded-lg mb-4"
      />

      <div className="flex gap-4">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="px-6 py-2 bg-gray-400 text-white rounded-lg">
          이전
        </button>
        {currentIndex < questions.length - 1 ? (
          <button onClick={handleNext} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            다음
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            제출
          </button>
        )}
      </div>
    </div>
  );
}

export default SurveyAnswer;
