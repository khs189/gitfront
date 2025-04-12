import { useState } from 'react';
import WordQuizModal from './WordQuizModal';
import SsonagiModal from './SsonagiModal'; // 👈 추가

function Home() {
  const [isQuizModalOpen, setQuizModalOpen] = useState(false);
  const [isSsonagiModalOpen, setSsonagiModalOpen] = useState(false); // 👈 소나기 모달 상태 추가

  const handleOpenQuiz = () => setQuizModalOpen(true);
  const handleCloseQuiz = () => setQuizModalOpen(false);
  const handleOpenSsonagi = () => setSsonagiModalOpen(true);
  const handleCloseSsonagi = () => setSsonagiModalOpen(false);

  const JustHome = () => {
    window.location.href = '/whome';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6"> 🕹️ IELTS 게임 🎮 </h1>

      {/* 소나기 게임 버튼 */}
      <div className="mb-8 flex flex-col items-center">
        <p className="text-5xl px-2 py-2 rounded" >🌧️</p>
        
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          onClick={handleOpenSsonagi}
        >
          소나기 🌧️
        </button>
      </div>

      {/* 단어 맞추기 */}
      <div className="flex flex-col items-center">
        <p className="text-5xl px-2 py-2 rounded" >📝</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleOpenQuiz}
        >
          단어 맞추기 📝
        </button>
      </div>

      {/* 모달들 */}
      {isQuizModalOpen && <WordQuizModal onClose={handleCloseQuiz} />}
      {isSsonagiModalOpen && <SsonagiModal onClose={handleCloseSsonagi} />}

      {/* 단어장 */}
      <div className="flex flex-col items-center mt-6">
      <p className="text-5xl px-2 py-2 rounded" >✍️</p>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={JustHome}
        >
          진지한 단어장✍️
        </button>
      </div>
    </div>
  );
}

export default Home;
