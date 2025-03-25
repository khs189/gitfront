// SurveyResultDownload.jsx
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';

function SurveyResultDownload() {
  const { state } = useLocation();
  const { surveyName, questions, answers } = state || {};
  const captureRef = useRef(null);
  const [imgUrl, setImgUrl] = useState('');
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    if (captureRef.current) {
      html2canvas(captureRef.current, {
        scrollY: -window.scrollY,
        useCORS: true,
      }).then(canvas => {
        const dataUrl = canvas.toDataURL('image/png');
        setImgUrl(dataUrl);
        // 캡쳐가 완료되면 원본 영역은 더 이상 보이지 않도록 합니다.
        setCaptured(true);
      });
    }
  }, []);

  if (!questions || !answers) {
    return <p>결과 데이터를 찾을 수 없습니다.</p>;
  }

  const submitTime = new Date().toLocaleString();

  return (
    <div className="min-h-screen p-4 m-2">
      {/* 캡쳐 전에는 원본 데이터 테이블 영역을 보여주고, 캡쳐 후에는 숨김 */}
      {!captured && (
        <div ref={captureRef} className="p-8 bg-white shadow rounded mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            {surveyName} - 응답 결과
          </h1>
          <p className="text-lg text-gray-500 mb-6">
            제출일시: {submitTime}
          </p>

          {questions.map((question) => (
            <div key={question.id} className="mb-6 border-b border-gray-300 pb-4">
              <h3 className="font-medium mb-2">{question.title}</h3>
              {question.image_url && (
                <img
                  src={question.image_url}
                  alt={question.title}
                  className="mb-4 max-w-full object-contain"
                  style={{ maxHeight: '300px' }}
                />
              )}
              <p className="mt-2">
                답변:{" "}
                {Array.isArray(answers[question.id]?.user_answer)
                  ? answers[question.id].user_answer.join(', ')
                  : answers[question.id]?.user_answer || "답변 없음"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 캡쳐된 이미지와 다운로드 버튼 */}
      {imgUrl && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            결과 확인후 다운로드하세요!
          </h2>
          <img src={imgUrl} alt="응답 결과" className="mb-4" />
          <a
            href={imgUrl}
            download={`${surveyName}_result.png`}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            이미지 다운로드
          </a>
        </div>
      )}
    </div>
  );
}

export default SurveyResultDownload;
