import { useState } from 'react';

import WordQuizModal from './WordQuizModal';

function Home() {
  const [isQuizModalOpen, setQuizModalOpen] = useState(false);

  const handleOpenQuiz = () => {
    setQuizModalOpen(true);
  };

  const JustHome = () => {
    window.location.href = '/whome'; // Redirect to the WordbookHome component
  };

  const handleCloseQuiz = () => {
    setQuizModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">[ 게임 선택 ]</h1>
      
      {/* 소나기 게임 섹션 */}
      <div className="mb-8 flex flex-col items-center">
        <img src="https://via.placeholder.com/100" alt="소나기 게임" className="mb-2" />
        <button className="px-4 py-2 bg-gray-300 rounded" disabled>
          소나기 게임
        </button>
      </div>
      
      {/* 단어맞추기 게임 섹션 */}
      <div className="flex flex-col items-center">
        <img src="https://via.placeholder.com/100" alt="단어 맞추기" className="mb-2" />
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleOpenQuiz}
        >
          단어맞추기 게임
        </button><br/>

      </div>
      
      {/* 단어맞추기 게임 모달창 */}
      {isQuizModalOpen && (
        <WordQuizModal onClose={handleCloseQuiz} />
      )}

      {/* 단어장장 버튼 */}
      <div className="flex flex-col items-center">
       <img src="https://via.placeholder.com/100" alt="단어장" className="mb-2" />

        <button 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={JustHome}
        >
          단어장
        </button>
      </div>


    </div>
  );
}

export default Home;
