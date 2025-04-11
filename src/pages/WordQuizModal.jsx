import React, { useEffect, useState } from 'react';
import axios from 'axios';

// .env 파일에서 API_BASE_URL (예: VITE_API_URL=http://localhost:3000) 를 설정하고, /api까지 붙여서 사용
const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

function WordQuizModal({ onClose, user }) {
  // 사용 가능한 데이터테이블 목록 (예시: survey_Unit1, survey_Unit2)
  const availableTables = ['survey_Unit1', 'survey_Unit2'];
  const [selectedTables, setSelectedTables] = useState([]);
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // 새로운 상태 변수 추가

  // 테이블 선택 체크박스 토글
  const handleTableSelect = (table) => {
    setSelectedTables(prev => 
      prev.includes(table)
        ? prev.filter(item => item !== table)
        : [...prev, table]
    );
  };

  // "게임시작" 버튼 클릭 시 선택된 테이블들에서 무작위 문제 로딩
  const fetchRandomQuestion = async () => {
    if (selectedTables.length === 0) {
      alert('먼저 하나 이상의 테이블을 선택해주세요.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/getRandomQuestion`, { tables: selectedTables });
      // API로부터 받은 문제 데이터 (예: title, subtitle, options, correct_answer)
      setCurrentQuestion(response.data.question);
      setFeedback('');
      setFeedbackType('');
      setShowHint(false);
    } catch (error) {
      console.error('문제 로딩 에러:', error);
      alert('문제를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 사용자가 답안을 선택한 경우 처리 (정답이면 correct, 오답이면 wrong)
  const handleAnswer = async (selectedOption) => {
    if (!currentQuestion) return;
    let answerType = '';
    if (selectedOption === currentQuestion.correct_answer) {
      setFeedback('정답입니다 !!');
      answerType = 'correct';
    } else {
      setFeedback('다시 한 번 생각해볼까요?');
      answerType = 'wrong';
    }
    // 피드백 유형 상태 업데이트
    setFeedbackType(answerType);

    try {
      // 로그인한 사용자의 id를 함께 보내어 survey_login 테이블 업데이트
      await axios.post(`${API_BASE_URL}/updateAnswer`, { type: answerType, userId: user.id });
    } catch (error) {
      console.error('답안 업데이트 에러:', error);
    }
  };

  // 힌트 보기 버튼 토글
  const toggleHint = () => {
    setShowHint(prev => !prev);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* 오락기 프레임 스타일 - 단순 예시 */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-2xl w-11/12 max-w-2xl">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">단어맞추기 게임</h2>
          <button onClick={onClose} className="text-red-500">종료</button>
        </div>
        
        {/* 데이터테이블 선택 영역 (문제가 아직 로딩되지 않은 경우) */}
        {!currentQuestion && (
          <div>
            <p className="mb-2">단어장 선택:</p>
            {availableTables.map(table => (
              <div key={table} className="mb-1">
                <input
                  type="checkbox"
                  id={table}
                  value={table}
                  checked={selectedTables.includes(table)}
                  onChange={() => handleTableSelect(table)}
                />
                <label htmlFor={table} className="ml-2">{table}</label>
              </div>
            ))}
            <button 
              className="mt-4 px-4 py-2 bg-green-400 text-white rounded"
              onClick={fetchRandomQuestion}
            >
              게임시작
            </button>
          </div>
        )}

        {/* 문제 영역 */}
        {currentQuestion && (
          <div className="mt-4">
            <div className="p-4 bg-white border border-gray-300 rounded mb-4">
              <p className="text-lg font-semibold">{currentQuestion.title}</p>
              
              <p className="mb-2 text-gray-600">{currentQuestion.subtitle}</p>

              {/* 힌트 보기 버튼 */}
              <button 
                onClick={toggleHint}
                className="text-sm text-blue-500 underline mb-2"
              >
                힌트 보기
              </button>
              {showHint && (
                <div className="p-2 bg-yellow-100 border border-yellow-300 rounded">
                  정답 힌트: {currentQuestion.correct_answer}
                </div>
              )}

              <p className="bg-black text-white text-center">정답 선택</p><br/>

              {/* 옵션 버튼 (라디오 버튼 형식 대신 버튼 형태로 처리) */}
              <div className="flex bg-blue-0 flex-wrap gap-2 mb-2">
                {currentQuestion.options.split(',').map(option => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="px-3 py-1 border rounded bg-blue-100 hover:bg-yellow-200 transition"
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {feedback && (
                <p className={`mt-2 font-bold text-center bg-gray-100 ${feedbackType === 'correct' ? 'text-blue-500' : feedbackType === 'wrong' ? 'text-red-500' : ''}`}>
                  {feedback}
                </p>
              )}
            </div>
            
            <div className="flex justify-between">
            <button 
                onClick={() => {
                  setCurrentQuestion(null);
                  setFeedback('');
                  setFeedbackType('');
                }}
                className="px-2 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                선택 메뉴
              </button>

              <button 
                onClick={fetchRandomQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                다음
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WordQuizModal;
