import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import WordQuizModal from './WordQuizModal';

function Home() {
  const [isQuizModalOpen, setQuizModalOpen] = useState(false);

  const handleOpenQuiz = () => {
    setQuizModalOpen(true);
  };

  const handleCloseQuiz = () => {
    setQuizModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">[ 게임 선택 ]</h1>
      
      {/* 소나기 게임 섹션 */}
      <div className="mb-8 flex flex-col items-center">
        <img src="https://via.placeholder.com/100" alt="소나기 게임 아이콘" className="mb-2" />
        <button className="px-4 py-2 bg-gray-300 rounded" disabled>
          소나기 게임
        </button>
      </div>
      
      {/* 단어맞추기 게임 섹션 */}
      <div className="flex flex-col items-center">
        <img src="https://via.placeholder.com/100" alt="단어맞추기 게임 아이콘" className="mb-2" />
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleOpenQuiz}
        >
          단어맞추기 게임
        </button>
      </div>
      
      {/* 단어맞추기 게임 모달창 */}
      {isQuizModalOpen && (
        <WordQuizModal onClose={handleCloseQuiz} />
      )}
    </div>
  );
}

export default Home;
