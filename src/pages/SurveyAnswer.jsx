// SurveyAnswer.jsx
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
  
  // options가 문자열이면 배열로 변환
  const parseOptions = (options) => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    if (typeof options === 'string') {
      return options.split(',').map(opt => opt.trim());
    }
    return [];
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/survey/${surveyName}`)
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching survey questions:', error));
  }, [surveyName]);

  // 현재 질문에 대한 응답 유효성 검사
  const validateAnswer = () => {
    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion.id] || {};

    if (currentQuestion.response_type === 'radio') {
      if (!currentAnswer.user_answer) return false;
    } else if (currentQuestion.response_type === 'checkbox') {
      if (!Array.isArray(currentAnswer.user_answer) || currentAnswer.user_answer.length < currentQuestion.max_selections) return false;
    } else {
      if (!currentAnswer.user_answer || currentAnswer.user_answer.trim() === "") return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateAnswer()) {
      alert("답변을 완료해야 다음으로 넘어갈 수 있습니다.");
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 마지막 질문에서는 바로 서버 전송하지 않고 미리보기 페이지로 state 전달
  const handlePreview = () => {
    // 모든 질문에 대한 답변 검증
    if (Object.keys(answers).length !== questions.length) {
      alert("모든 질문에 답변해주세요.");
      return;
    }
    navigate(`/survey/${surveyName}/preview`, { state: { surveyName, questions, answers } });
  };

  if (loading) return <p className="text-center">로딩 중...</p>;
  if (questions.length === 0) return <p className="text-center">질문이 없습니다.</p>;

  const currentQuestion = questions[currentIndex];
  const optionsArray = parseOptions(currentQuestion.options);
  const currentAnswer = answers[currentQuestion.id] || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 m-2">
      <h1 className="text-3xl font-bold text-blue-600 mb-6"> {surveyName} </h1>
      <p className="text-lg font-bold mb-4">◆ {currentQuestion.title}</p>
      <p className="text-lg font-medium mb-4">- {currentQuestion.subtitle}</p>
      
      {/* 질문 이미지 (있을 경우) */}
      {currentQuestion.image_url && (
        <img 
          src={currentQuestion.image_url} 
          alt="question" 
          className="w-60 h-auto my-4 cursor-pointer"
          onClick={() => {}}
        />
      )}
      
      {/* radio 유형 */}
      {currentQuestion.response_type === 'radio' && optionsArray.length > 0 && (
        <div className="mb-4">
          {optionsArray.map((option, index) => (
            <label key={index} className="block mb-1">
              <input 
                type="radio"
                name={`question_${currentQuestion.id}`}
                value={option}
                checked={currentAnswer.user_answer === option}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [currentQuestion.id]: {
                      response_type: currentQuestion.response_type,
                      user_answer: e.target.value
                    }
                  })
                }
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
      
      {/* checkbox 유형 */}
      {currentQuestion.response_type === 'checkbox' && optionsArray.length > 0 && (
        <div className="mb-4">
          {optionsArray.map((option, index) => {
            const currentSelections = Array.isArray(currentAnswer.user_answer) ? currentAnswer.user_answer : [];
            const isChecked = currentSelections.includes(option);
            return (
              <label key={index} className="block mb-1">
                <input 
                  type="checkbox"
                  name={`question_${currentQuestion.id}`}
                  value={option}
                  checked={isChecked}
                  onChange={() => {
                    let newSelections = currentSelections;
                    if (isChecked) {
                      newSelections = currentSelections.filter(item => item !== option);
                    } else {
                      if (currentSelections.length >= currentQuestion.max_selections) {
                        alert(`최대 ${currentQuestion.max_selections}개까지 선택할 수 있습니다.`);
                        return;
                      }
                      newSelections = [...currentSelections, option];
                    }
                    setAnswers({
                      ...answers,
                      [currentQuestion.id]: {
                        response_type: currentQuestion.response_type,
                        user_answer: newSelections
                      }
                    });
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            );
          })}
        </div>
      )}
      
      {/* 텍스트 입력 (radio, checkbox가 아닌 경우) */}
      {currentQuestion.response_type !== 'radio' &&
        currentQuestion.response_type !== 'checkbox' && (
          <textarea
            placeholder="답변을 입력하세요"
            value={currentAnswer.user_answer || ''}
            onChange={(e) =>
              setAnswers({
                ...answers,
                [currentQuestion.id]: {
                  response_type: currentQuestion.response_type,
                  user_answer: e.target.value
                }
              })
            }
            className="w-60 h-40 p-2 border border-gray-300 rounded-lg mb-4 resize-none overflow-y-auto overflow-x-hidden whitespace-pre-wrap custom-scrollbar"
          />
      )}

      <div className="flex gap-4">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0} 
          className="px-6 py-2 bg-gray-400 text-white rounded-lg"
        >
          이전
        </button>
        {currentIndex < questions.length - 1 ? (
          <button 
            onClick={handleNext} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다음
          </button>
        ) : (
          <button 
            onClick={handlePreview} 
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            설문완료
          </button>
        )}
      </div>
    </div>
  );
}

export default SurveyAnswer;
