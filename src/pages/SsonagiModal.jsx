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
  const [speed, setSpeed] = useState(1); // 낙하 속도
  const [spawnInterval, setSpawnInterval] = useState(4000); // ✅ 단어 생성 속도(ms)
  const [matchedInfo, setMatchedInfo] = useState(null); // ✅ 맞춘 단어 정보 저장
  const wordId = useRef(0);
  const spawnTimerRef = useRef(null); // ✅ clearInterval 용 참조

  const handleTableSelect = (table) => {
    setSelectedTables(prev =>
      prev.includes(table)
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const startGame = async () => {
    if (selectedTables.length === 0) {
      alert('먼저 단어장을 선택해주세요.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/getWords`, {
        tables: selectedTables,
      });

      const words = response.data.words; // ['host', 'apple', ...]
      if (words.length === 0) {
        alert('단어가 없습니다.');
        return;
      }

      // words = [{ text: 'host', title: '호스트', subtitle: '서버 담당자' }]
      const formatted = words.map(word => ({
        text: typeof word === 'string' ? word : word.text,
        title: word.title || word.text,
        subtitle: word.subtitle || '',
      }));

      setWordList(formatted);
      setGameStarted(true);
    } catch (error) {
      console.error('단어 로딩 실패:', error);
      alert('단어 로딩 실패');
    }
  };

  // 단어 생성
  useEffect(() => {
    if (!gameStarted || wordList.length === 0) return;

    spawnTimerRef.current = setInterval(() => {
      const random = wordList[Math.floor(Math.random() * wordList.length)];
      const newWord = {
        ...random,
        id: wordId.current++,
        top: 0,
        left: Math.random() * 70,
      };
      setFallingWords(prev => [...prev, newWord]);
    }, spawnInterval);

    return () => clearInterval(spawnTimerRef.current);
  }, [gameStarted, wordList, spawnInterval]); // ✅ spawnInterval 반응

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

  // 입력 처리
  const handleSubmit = () => {
    const normalizedInput = input.trim().toLowerCase(); // ✅ 대소문자 무시

    const matched = fallingWords.find(w => w.text.toLowerCase() === normalizedInput);

    if (matched) {
      setFallingWords(prev => prev.filter(w => w.id !== matched.id));
      setScore(prev => prev + 10);
      setMatchedInfo({ title: matched.title, subtitle: matched.subtitle }); // ✅ info 저장
    } else {
      setMatchedInfo(null); // 맞춘 게 없으면 초기화
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
  const increaseSpawnRate = () => setSpawnInterval(prev => Math.max(prev - 500, 500)); // ✅ 빠르게 생성
  const decreaseSpawnRate = () => setSpawnInterval(prev => prev + 500); // ✅ 느리게 생성

  const handleBackToSelect = () => {
    setGameStarted(false);
    setFallingWords([]);
    setScore(0);
    setSpeed(1);
    setInput('');
    setWordList([]);
    setMatchedInfo(null);
    clearInterval(spawnTimerRef.current); // ✅ clear 생성 타이머
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        {!gameStarted ? (
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
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={startGame}>게임 시작</button>
            <button className="mt-2 ml-2 text-sm text-red-500" onClick={onClose}>닫기</button>
          </>
        ) : (
          <>
            <div className="header flex justify-between items-center">
              <h2>🌧️ 소나기</h2>
              <div className="gap-4">
                <div className="speed-control">
                  <span>⬇️ 낙하</span>
                  <button onClick={decreaseSpeed}>－</button>
                  <span>{speed}</span>
                  <button onClick={increaseSpeed}>＋</button>
                </div>
                <div className="speed-control">
                  <span>⏱ 생성:</span>
                  <button onClick={increaseSpawnRate}>－</button>
                  <span>{spawnInterval / 1000}s</span>
                  <button onClick={decreaseSpawnRate}>＋</button>
                </div>
              </div>
            </div>

            <p className="my-2 bg-black text-white text-xl font-bold">점수 : {score}</p>

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

            {matchedInfo && (
              <div className="matched-info mt-2 bg-gray-100 p-2 rounded">
                <p><strong>📘 예:</strong> {matchedInfo.title}</p>
                <p className="text-sm text-gray-500">{matchedInfo.subtitle}</p>
              </div>
            )}

            <div className="flex justify-between mt-4">
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
