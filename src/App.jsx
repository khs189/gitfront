import { BrowserRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SurveyForm from './pages/SurveyForm';
import SurveyAnswer from './pages/SurveyAnswer';
import ManageSurvey from './pages/ManageSurvey';
import PhoneAuthPage from './pages/PhoneAuthPage';
import VerifyCodePage from './pages/VerifyCodePage';

function App() {
  const isAuthenticated = localStorage.getItem("token"); // JWT 저장 방식

  return (  
    <BrowserRouter basename="/gitfront">
      <Routes>
        {/* 인증이 필요한 페이지 */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/create-survey" element={isAuthenticated ? <SurveyForm /> : <Navigate to="/auth" />} />
        <Route path="/survey/:surveyName" element={isAuthenticated ? <SurveyAnswer /> : <Navigate to="/auth" />} />
        <Route path="/manage-survey/:surveyName" element={isAuthenticated ? <ManageSurvey /> : <Navigate to="/auth" />} />

        {/* 휴대폰 번호 인증 관련 페이지 */}
        <Route path="/auth" element={<PhoneAuthPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
