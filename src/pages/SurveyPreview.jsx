// SurveyPreview.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

function SurveyPreview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { surveyName, questions, answers } = state || {};

  if (!questions || !answers) {
    return <p>미리보기 데이터가 없습니다.</p>;
  }

  // 수정하기: 기존 답변을 수정할 수 있도록 revise 페이지로 이동
  const handleRevise = () => {
    navigate(`/survey/${surveyName}/revise`, { state: { surveyName, questions, answers } });
  };

  // 최종 제출: 서버로 전송 후 결과 페이지로 이동
  const handleFinalSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/survey/answers`, {
        survey_name: surveyName,
        answers: Object.entries(answers).map(([id, data]) => ({
          question_id: id,
          response_type: data.response_type,
          user_answer: data.user_answer
        }))
      });
      alert('응답이 저장되었습니다.');
      navigate(`/survey/${surveyName}/results`, { state: { surveyName, questions, answers } });
    } catch (error) {
      alert('응답 저장 실패: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="min-h-screen p-4 m-2">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">{surveyName} - 답변 미리보기</h1>
      {questions.map((question) => (
        <div key={question.id} className="mb-4 p-4 border border-gray-300 rounded">
          <h2 className="font-medium">◆ {question.title}</h2>
          <h2 className="font-medium">- {question.subtitle}</h2>
          <p>
            답변 : {" "}
            {answers[question.id] && answers[question.id].user_answer ? (
              Array.isArray(answers[question.id].user_answer) ? 
                answers[question.id].user_answer.join(", ") : 
                answers[question.id].user_answer
            ) : (
              "답변 없음"
            )}
          </p>
        </div>
      ))}
      <div className="flex gap-4">
        <button 
          onClick={handleRevise}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          수정하기
        </button>
        <button 
          onClick={handleFinalSubmit}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          제출하기
        </button>
      </div>
    </div>
  );
}

export default SurveyPreview;
