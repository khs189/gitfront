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

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  // options가 문자열이면 배열로 변환, 이미 배열이면 그대로 반환
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

  // 현재 질문에 대한 응답 유효성 검사 함수
  const validateAnswer = () => {
    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion.id] || {};

    if (currentQuestion.response_type === 'radio') {
      // 라디오: 반드시 값이 선택되어야 함
      if (!currentAnswer.user_answer) {
        return false;
      }
    } else if (currentQuestion.response_type === 'checkbox') {
      // 체크박스: 배열이고, 선택된 항목 수가 정해진 숫자만큼 되어야 함
      if (!Array.isArray(currentAnswer.user_answer) || currentAnswer.user_answer.length < currentQuestion.max_selections) {
        return false;
      }
    } else {
      // 텍스트 등의 경우: 입력 값이 비어있으면 안 됨
      if (!currentAnswer.user_answer || currentAnswer.user_answer.trim() === "") {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateAnswer()) {
      alert("선택이 완료되어야 다음으로 넘어갈 수 있습니다.");
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

  const handleSubmit = async () => {
    // 마지막 질문도 검증
    if (!validateAnswer()) {
      alert("선택이 완료되어야 다음으로 넘어갈 수 있습니다.");
      return;
    }
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
      navigate(`/survey/${surveyName}/results`);
    } catch (error) {
      alert('응답 저장 실패: ' + error.response?.data?.error);
    }
  };

  if (loading) return <p className="text-center">로딩 중...</p>;
  if (questions.length === 0) return <p className="text-center">질문이 없습니다.</p>;

  const currentQuestion = questions[currentIndex];
  const optionsArray = parseOptions(currentQuestion.options);
  const currentAnswer = answers[currentQuestion.id] || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">{surveyName} 설문</h1>
      <p className="text-lg font-medium mb-4">{currentQuestion.title}</p>
      
      {/* 이미지가 있을 경우, 클릭 시 모달 열기 */}
      {currentQuestion.image_url && (
        <img 
          src={currentQuestion.image_url} 
          alt="question" 
          className="w-60 h-auto my-4 cursor-pointer"
          onClick={() => {
            setModalImage(currentQuestion.image_url);
            setModalOpen(true);
          }}
        />
      )}
      
      {/* radio 유형: 옵션 리스트 보여주기 */}
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
      
      {/* checkbox 유형: 옵션 리스트 보여주기 (max_selections 제한 적용) */}
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
      
      {/* 텍스트 입력: radio, checkbox가 아닌 경우 */}
      {currentQuestion.response_type !== 'radio' &&
        currentQuestion.response_type !== 'checkbox' && (
          <input 
            type="text" 
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
            className="w-80 p-2 border border-gray-300 rounded-lg mb-4"
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
            onClick={handleSubmit} 
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            제출
          </button>
        )}
      </div>

      {/* 모달: 이미지 확대보기 */}
      {modalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative">
            <img src={modalImage} alt="Enlarged" className="max-w-full max-h-screen" />
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyAnswer;
