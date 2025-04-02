// ReviseAnswer.jsx
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ReviseAnswer() {
  const { surveyName } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  // 이전에 선택한 답변들이 이미 전달되었다고 가정
  const [questions] = useState(state?.questions || []);
  const [answers, setAnswers] = useState(state?.answers || {});
  const [currentIndex, setCurrentIndex] = useState(0);

  // SurveyAnswer.jsx와 동일하게 options를 파싱하는 함수
  const parseOptions = (options) => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    if (typeof options === 'string') {
      return options.split(',').map(opt => opt.trim());
    }
    return [];
  };

  if (!questions.length) {
    return <p className="text-center">수정할 질문이 없습니다.</p>;
  }

  const currentQuestion = questions[currentIndex];
  const optionsArray = parseOptions(currentQuestion.options);
  const currentAnswer = answers[currentQuestion.id] || {};

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

  // 미리보기 페이지로 수정된 답변들을 전달
  const handlePreview = () => {
    navigate(`/survey/${surveyName}/preview`, { state: { surveyName, questions, answers } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 m-2">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">{surveyName} - 답변 수정</h1>
      <p className="text-lg font-medium mb-4">{currentQuestion.title}</p>
      <p className="text-lg font-medium mb-4">{currentQuestion.subtitle}</p>
      
      {/* 질문 이미지 (있을 경우) */}
      {currentQuestion.image_url && (
        <img 
          src={currentQuestion.image_url} 
          alt="question" 
          className="w-60 h-auto my-4 cursor-pointer"
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
            미리보기
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviseAnswer;
