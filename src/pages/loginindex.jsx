import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

function LoginIndex() {
  const [loginName, setloginName] = useState('');
  const [loginCon, setloginCon] = useState('');
  const navigate = useNavigate();

  // 기존 회원의 로그인 처리 함수
  const handleCreateSurvey = async () => {
    if (!loginName.trim()) {
      alert('성명을 입력하세요.');
      return;
    }
    if (!loginCon.trim()) {
      alert('핸드폰 뒤 네자리를 입력하세요.');
      return;
    }

    try {
      // 기존 로그인 API 호출 (/survey_login)
      const response = await axios.post(`${API_BASE_URL}/survey_login`, {
        name: loginName,
        phone: loginCon
      });
      
      const userData = response.data.user;
      alert('로그인에 성공하였습니다.');
      
      navigate('/home', { state: { user: userData } });
    } catch (error) {
      alert('로그인 실패: ' + error.response?.data?.error);
    }
  };

  // 신규 회원의 가입 처리 함수
  const handleSignUpSurvey = async () => {
    if (!loginName.trim()) {
      alert('성명을 입력하세요.');
      return;
    }
    if (!loginCon.trim()) {
      alert('핸드폰 뒤 네자리를 입력하세요.');
      return;
    }
    
    try {
      // 신규 가입 API 호출 (/survey_signup)
      const response = await axios.post(`${API_BASE_URL}/survey_signup`, {
        name: loginName,
        phone: loginCon
      });
      // API에서 전달한 가입 완료 메시지 출력
      alert(response.data.message);
    } catch (error) {
      alert('가입 실패: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center"> 
      <h1 className="text-3xl font-bold text-blue-600 mb-6">팬더네 단어장</h1>
      
      <input 
        type="text" 
        placeholder="이름 (ex. 홍길동)" 
        value={loginName} 
        onChange={(e) => setloginName(e.target.value)}
        className="w-60 p-2 border border-gray-300 rounded-lg mb-4"
      />
      <input 
        type="text" 
        placeholder="핸드폰 번호 뒷자리 (ex. 1234)" 
        value={loginCon} 
        onChange={(e) => setloginCon(e.target.value)}
        className="w-60 p-2 border border-gray-300 rounded-lg mb-4"
      />
      
      <button 
        onClick={handleSignUpSurvey} 
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        가입하기
      </button><br></br>

      <button 
        onClick={handleCreateSurvey} 
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
      >
        입장하기
      </button>


    </div>
  );
}

export default LoginIndex;
