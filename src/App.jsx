import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SurveyForm from './pages/SurveyForm';
import SurveyAnswer from './pages/SurveyAnswer';
import ManageSurvey from './pages/ManageSurvey';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-survey" element={<SurveyForm />} />
        <Route path="/survey/:surveyName" element={<SurveyAnswer />} />
        <Route path="/manage-survey/:surveyName" element={<ManageSurvey />} />
      </Routes>
    </Router>
  );
}

export default App;
