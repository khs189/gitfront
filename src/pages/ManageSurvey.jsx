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

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/survey/${surveyName}/questions`)
      .then(response => setQuestions(response.data))
      .catch(error => console.error('질문 목록 불러오기 실패:', error));
  }, [surveyName]);

  const openEditModal = (question) => {
    console.log("모달 열기 실행됨:", question);
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;
    try {
      await axios.put(`${API_BASE_URL}/survey/${surveyName}/update-question/${editingQuestion.id}`, editingQuestion);
      alert('질문이 수정되었습니다.');
      setIsModalOpen(false);
      setEditingQuestion(null);
      axios.get(`${API_BASE_URL}/survey/${surveyName}/questions`)
        .then(response => setQuestions(response.data));
    } catch (error) {
      alert('질문 수정 실패: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">{surveyName} 질문 관리</h1>
      <div className="w-96 bg-white p-4 shadow-lg rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">기존 질문</h2>
        <ul>
          {questions.map(q => (
            <li key={q.id} className="border-b last:border-none p-2">
              <p className="font-semibold">{q.title}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => openEditModal(q)} className="px-2 py-1 bg-yellow-500 text-white rounded">수정</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">질문 수정</h2>
            <input type="text" value={editingQuestion.title} onChange={(e) => setEditingQuestion({...editingQuestion, title: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />
            <button onClick={handleUpdateQuestion} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">수정하기</button>
            <button onClick={() => setIsModalOpen(false)} className="w-full px-4 py-2 mt-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSurvey;