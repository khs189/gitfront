import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

function Home() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/surveys`)
      .then(response => setSurveys(response.data))
      .catch(error => console.error('Error fetching surveys:', error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full">

      <h1 className="text-3xl font-bold text-blue-600 mb-6">설문 목록</h1>
      <ul className="w-80 bg-white p-4 shadow-lg rounded-lg">
        {surveys.map(survey => (
          <li key={survey.id} className="border-b last:border-none p-2 flex justify-between items-center">
            <Link to={`/survey/${survey.survey_name}`} className="text-lg text-blue-500 hover:underline">
              {survey.survey_name}
            </Link>
            <Link to={`/manage-survey/${survey.survey_name}`}>
              <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                설문 관리자
              </button>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/create-survey">
        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          새 설문 생성
        </button>
      </Link>
    </div>
  );
}

export default Home;
