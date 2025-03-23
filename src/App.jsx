import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginIndex from './pages/loginindex';
import Home from './pages/Home';
import SurveyForm from './pages/SurveyForm';
import SurveyAnswer from './pages/SurveyAnswer';
import ManageSurvey from './pages/ManageSurvey';
import SurveyResults from './pages/SurveyResults';


function App() {

  return (  
    <BrowserRouter basename="/gitfront">
      <Routes>
        <Route path="/" element={<LoginIndex />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-survey" element={<SurveyForm />} />
        <Route path="/survey/:surveyName" element={<SurveyAnswer />} />
        <Route path="/manage-survey/:surveyName" element={<ManageSurvey />} />
        <Route path="/survey/:surveyName/results" element={<SurveyResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
