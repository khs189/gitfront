import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './SsonagiModal.css';

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

const SsonagiModal = ({ onClose, user }) => {
  const availableTables = ['survey_Unit1', 'survey_Unit2'];
  const [selectedTables, setSelectedTables] = useState([]);
  const [wordList, setWordList] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const [fallingWords, setFallingWords] = useState([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  const wordId = useRef(0);

  // 단어장 선택
  const handleTableSelect = (table) => {
    setSelectedTables(prev =>
      prev.includes(table)
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  // 게임 시작 전 단어 목록 가져오기
  const startGame = async () => {
    if (selectedTables.length === 0) {
      alert('먼저 단어장을 선택해주세요.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/getWords`, {
        tables: selectedTables,
      });
      const words = response.data.words.map(word => word.english); // 단어 구조에 맞게 변경
      setWordList(words);
      setGameStarted(true);
    } catch (error) {
      console.error('단어 불러오기 실패:', error);
      alert('단어를 불러오는 중 문제가 발생했습니다.');
    }
  };

  // 단어 생성
  useEffect(() => {
    if (!gameStarted || wordList.length === 0) return;

    const addWordInterval = setInterval(() => {
      const newWord = {
        id: wordId.current++,
        text: wordList[Math.floor(Math.random() * wordList.length)],
        top: 0,
        left: Math.random() * 80 + 10,
      };
      setFallingWords(prev => [...prev, newWord]);
    }, 2000);

    return () => clearInterval(addWordInterval);
  }, [gameStarted, wordList]);

  // 단어 낙하
  useEffect(() => {
    if (!gameStarted) return;

    const fallInterval = setInterval(() => {
      setFallingWords(prev =>
        prev
          .map(word => ({
            ...word,
            top: word.top + speed * 0.5,
          }))
          .filter(word => word.top < 100)
      );
    }, 100);

    return () => clearInterval(fallInterval);
  }, [gameStarted, speed]);

  // 단어 입력 처리
  const handleSubmit = () => {
    const matched = fallingWords.find(w => w.text === input);
    if (matched) {
      setFallingWords(prev => prev.filter(w => w.id !== matched.id));
      setScore(prev => prev + 10);
    }
    setInput('');
  };

  const handleInputChange = (e) => setInput(e.target.value);
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // 난이도 조절
  const increaseSpeed = () => setSpeed(prev => Math.min(prev + 1, 10));
  const decreaseSpeed = () => setSpeed(prev => Math.max(prev - 1, 1));

  // 게임 리셋
  const handleBackToSelect = () => {
    setGameStarted(false);
    setFallingWords([]);
    setScore(0);
    setSpeed(1);
    setInput('');
    setWordList([]);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        {/* 단어장 선택 화면 */}
        {!gameStarted && (
          <>
            <h2 className="text-xl font-bold mb-4">🌧️ 소나기 타자 게임</h2>
            <p className="mb-2">단어장 선택:</p>
            {availableTables.map((table) => (
              <div key={table} className="mb-1 text-left">
                <input
                  type="checkbox"
                  id={table}
                  value={table}
                  checked={selectedTables.includes(table)}
                  onChange={() => handleTableSelect(table)}
                />
                <label htmlFor={table} className="ml-2">{table}</label>
              </div>
            ))}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={startGame}
            >
              게임 시작
            </button>
            <button
              className="mt-2 ml-2 text-sm text-red-500"
              onClick={onClose}
            >
              닫기
            </button>
          </>
        )}

        {/* 게임화면 */}
        {gameStarted && (
          <>
            <div className="header">
              <h2>🌧️ 소나기</h2>
              <div className="speed-control">
                <button onClick={decreaseSpeed}>－</button>
                <span>속도: {speed}</span>
                <button onClick={increaseSpeed}>＋</button>
              </div>
            </div>

            <p>점수: {score}</p>

            <div className="game-area">
              {fallingWords.map(word => (
                <div
                  key={word.id}
                  className="falling-word"
                  style={{ top: `${word.top}%`, left: `${word.left}%` }}
                >
                  {word.text}
                </div>
              ))}
            </div>

            <div className="input-group">
              <input
                type="text"
                className="typing-input"
                placeholder="단어 입력"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
              />
              <button className="send-button" onClick={handleSubmit}>전송</button>
            </div>

            <div className="flex justify-between">
              <button className="close-button" onClick={handleBackToSelect}>단어장 선택</button>
              <button className="close-button" onClick={onClose}>종료</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SsonagiModal;
