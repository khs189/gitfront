import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

function LoginIndex() {
  const [loginName, setloginName] = useState('');
  const [loginBirth, setloginBirth] = useState('');
  const [loginCon, setloginCon] = useState('');

  const navigate = useNavigate();

  const handleCreateSurvey = async () => {
    if (!loginName.trim()) {
      alert('성명을 입력하세요.');
      return;
    }
    if (!loginBirth.trim()) {
      alert('생년월일을 입력하세요.');
      return;
    }
    if (!loginCon.trim()) {
      alert('핸드폰 번호를 입력하세요.');
      return;
    }

    try {
      // API endpoint와 payload 수정
      const response = await axios.post(`${API_BASE_URL}/survey_login`, {
        name: loginName,
        birth: loginBirth,
        phone: loginCon
      });
      
      // 로그인 성공 시 받은 유저 정보를 변수에 저장하거나, 필요 시 상태관리(store, context 등)에 저장
      const userData = response.data.user;
      alert('로그인에 성공하였습니다.');
      
      // 예: navigate 시 state를 함께 전달 (home.jsx에서 location.state로 접근 가능)
      navigate('/home', { state: { user: userData } });
    } catch (error) {
      alert('로그인 실패: ' + error.response?.data?.error);
    }
  };

    // 함수 이름 수정 없이
    const MoveHome = async () => {
      alert('로그인에 성공하였습니다.');
      navigate('/home');
    };




  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <button 
        onClick={MoveHome} 
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        임시
      </button><br/>  
      <h1 className="text-3xl font-bold text-blue-600 mb-6">설문조사 로그인</h1>
        {/* // 버튼에서 함수 이름 일치 */}

      <input 
        type="text" 
        placeholder="성명 (ex. 홍길동)" 
        value={loginName} 
        onChange={(e) => setloginName(e.target.value)}
        className="w-60 p-2 border border-gray-300 rounded-lg mb-4"
      />
      <input 
        type="text" 
        placeholder="생년월일 6자리 (ex. 700101)" 
        value={loginBirth} 
        onChange={(e) => setloginBirth(e.target.value)}
        className="w-60 p-2 border border-gray-300 rounded-lg mb-4"
      />      
      <input 
        type="text" 
        placeholder="핸드폰 번호 (ex. 01012345678)" 
        value={loginCon} 
        onChange={(e) => setloginCon(e.target.value)}
        className="w-60 p-2 border border-gray-300 rounded-lg mb-4"
      />
      
      <button 
        onClick={handleCreateSurvey} 
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        로그인하기
      </button>
    </div>
  );
}

export default LoginIndex;
