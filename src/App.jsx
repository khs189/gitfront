import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginIndex from './pages/loginindex';
import Home from './pages/Home';
import Whome from './pages/WordbookHome';
import SurveyForm from './pages/SurveyForm';
import SurveyAnswer from './pages/SurveyAnswer';
import ManageSurvey from './pages/ManageSurvey';
import SurveyPreview from './pages/SurveyPreview';
import ReviseAnswer from './pages/ReviseAnswer';
import SurveyResultDownload from './pages/SurveyResultDownload';


function App() {

  return (  
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<LoginIndex />} />
        <Route path="/home" element={<Home />} />
        <Route path="/whome" element={<Whome />} />
        <Route path="/login" element={<LoginIndex />} />
        <Route path="/wordbook" element={<wHome />} />
        <Route path="/create-survey" element={<SurveyForm />} />
        <Route path="/survey/:surveyName" element={<SurveyAnswer />} />
        <Route path="/manage-survey/:surveyName" element={<ManageSurvey />} />
        <Route path="/survey/:surveyName/preview" element={<SurveyPreview />} />
        <Route path="/survey/:surveyName/revise" element={<ReviseAnswer />} />
        <Route path="/survey/:surveyName/results" element={<SurveyResultDownload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
