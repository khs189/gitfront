import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

function ManageSurvey() {
  const { surveyName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({
    title: '',
    image_url: '',
    response_type: 'text',
    options: '',
    max_selections: 1,
    correct_answer: ''
  });

  // 수정 모달 관련 상태
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 기존 질문 목록 불러오기
  useEffect(() => {
    axios.get(`${API_BASE_URL}/survey/${surveyName}/questions`)
      .then(response => setQuestions(response.data))
      .catch(error => console.error('질문 목록 불러오기 실패:', error));
  }, [surveyName]);

  // 입력 필드 변경
  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  // 응답 유형 변경 시 `options`, `max_selections` 초기화
  const handleResponseTypeChange = (e) => {
    const handleResponseTypeChange = (e) => {
      const responseType = e.target.value;
      if (editingQuestion) {
        setEditingQuestion({
          ...editingQuestion,
          response_type: responseType,
          options: responseType === 'text' ? '' : editingQuestion.options,
          max_selections: responseType === 'checkbox' ? 1 : null
        });
      } else {
        setQuestion({
          ...question,
          response_type: responseType,
          options: responseType === 'text' ? '' : question.options,
          max_selections: responseType === 'checkbox' ? 1 : null
        });
      }
    };
    
  };

  // 질문 추가
  const handleAddQuestion = async () => {
    if (!question.title.trim()) {
      alert('질문 제목을 입력하세요.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/survey/${surveyName}/add-question`, question);
      alert('질문이 추가되었습니다.');
      setQuestion({ title: '', image_url: '', response_type: 'text', options: '', max_selections: 1, correct_answer: '' });

      // 최신 질문 목록 다시 불러오기
      axios.get(`${API_BASE_URL}/survey/${surveyName}/questions`)
        .then(response => setQuestions(response.data));
    } catch (error) {
      alert('질문 추가 실패: ' + error.response?.data?.error);
    }
  };

  // 수정 버튼 클릭 시 모달 열기
  const openEditModal = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  // 질문 수정
  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    try {
      await axios.put(`${API_BASE_URL}/survey/${surveyName}/update-question/${editingQuestion.id}`, editingQuestion);
      alert('질문이 수정되었습니다.');
      setIsModalOpen(false);
      setEditingQuestion(null);

      // 최신 질문 목록 다시 불러오기
      axios.get(`${API_BASE_URL}/survey/${surveyName}/questions`)
        .then(response => setQuestions(response.data));
    } catch (error) {
      alert('질문 수정 실패: ' + error.response?.data?.error);
    }
  };

  // 질문 삭제
  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/survey/${surveyName}/delete-question/${id}`);
      alert('질문이 삭제되었습니다.');

      // 삭제 후 목록 업데이트
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      alert('질문 삭제 실패: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">{surveyName} 질문 관리</h1>

      {/* 기존 질문 목록 */}
      <div className="w-96 bg-white p-4 shadow-lg rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">기존 질문</h2>
        {questions.length > 0 ? (
          <ul>
            {questions.map(q => (
              <li key={q.id} className="border-b last:border-none p-2">
                <p className="font-semibold">{q.title}</p>
                {q.image_url && <img src={q.image_url} alt="질문 이미지" className="w-40 h-auto my-2" />}
                <p className="text-gray-600">유형: {q.response_type}</p>
                {q.response_type !== 'text' && (
                  <p className="text-gray-600">선택 항목: {q.options ? q.options.join(', ') : '없음'}</p>
                )}
                {q.response_type === 'checkbox' && (
                  <p className="text-gray-600">최대 선택 가능 개수: {q.max_selections}</p>
                )}
                <p className="text-gray-600">정답: {q.correct_answer || '없음'}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEditModal(q)} className="px-2 py-1 bg-yellow-500 text-white rounded">
                    수정
                  </button>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="px-2 py-1 bg-red-500 text-white rounded">
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">저장된 질문이 없습니다.</p>
        )}
      </div>

            {isModalOpen && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">질문 수정</h2>

            <label className="block font-semibold">질문 제목</label>
            <input
              type="text"
              name="title"
              value={editingQuestion.title}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />

            <label className="block font-semibold">이미지 URL</label>
            <input
              type="text"
              name="image_url"
              value={editingQuestion.image_url}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, image_url: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />

            <label className="block font-semibold">응답 유형</label>
            <select
              name="response_type"
              value={editingQuestion.response_type}
              onChange={(e) =>
                setEditingQuestion({
                  ...editingQuestion,
                  response_type: e.target.value,
                  options: e.target.value === 'text' ? '' : editingQuestion.options,
                  max_selections: e.target.value === 'checkbox' ? 1 : null
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            >
              <option value="text">텍스트</option>
              <option value="radio">라디오 버튼</option>
              <option value="checkbox">체크박스</option>
            </select>

            {(editingQuestion.response_type === 'radio' || editingQuestion.response_type === 'checkbox') && (
              <>
                <label className="block font-semibold">선택 항목 (콤마로 구분)</label>
                <input
                  type="text"
                  name="options"
                  value={editingQuestion.options}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, options: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                />
              </>
            )}

            {editingQuestion.response_type === 'checkbox' && (
              <>
                <label className="block font-semibold">최대 선택 가능 개수</label>
                <input
                  type="number"
                  name="max_selections"
                  value={editingQuestion.max_selections}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, max_selections: e.target.value })}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                />
              </>
            )}

            <label className="block font-semibold">정답</label>
            <input
              type="text"
              name="correct_answer"
              value={editingQuestion.correct_answer}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />

            <button
              onClick={handleUpdateQuestion}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              수정하기
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full px-4 py-2 mt-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              취소
            </button>
          </div>
        </div>
      )}


      {/* 새로운 질문 추가 */}
      <div className="w-96 bg-white p-4 shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-2">새 질문 추가</h2>
        
        <label className="block font-semibold">질문 제목</label>
        <input type="text" name="title" value={question.title} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />

        <label className="block font-semibold">이미지 URL</label>
        <input type="text" name="image_url" value={question.image_url} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />

        <label className="block font-semibold">응답 유형</label>
        <select name="response_type" value={question.response_type} onChange={handleResponseTypeChange} className="w-full p-2 border border-gray-300 rounded-lg mb-2">
          <option value="text">텍스트</option>
          <option value="radio">라디오 버튼</option>
          <option value="checkbox">체크박스</option>
        </select>

        {(question.response_type === 'radio' || question.response_type === 'checkbox') && (
          <>
            <label className="block font-semibold">선택 항목 (콤마로 구분)</label>
            <input type="text" name="options" value={question.options} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />
          </>
        )}

        {question.response_type === 'checkbox' && (
          <>
            <label className="block font-semibold">최대 선택 가능 개수</label>
            <input type="number" name="max_selections" value={question.max_selections} onChange={handleChange} min="1" className="w-full p-2 border border-gray-300 rounded-lg mb-2" />
          </>
        )}

        <label className="block font-semibold">정답</label>
        <input type="text" name="correct_answer" value={question.correct_answer} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />

        <button onClick={handleAddQuestion} className="w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          질문 추가하기
        </button>
      </div>
    </div>
  );
}

export default ManageSurvey;
