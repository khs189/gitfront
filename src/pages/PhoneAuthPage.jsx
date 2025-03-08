import { useState } from "react";

function PhoneAuthPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [uid, setUid] = useState(null);

  const sendCode = async () => {
    const response = await fetch("http://localhost:5000/api/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();
    if (response.ok) {
      setUid(data.uid);
      alert("인증번호 전송됨");
    } else {
      alert("인증번호 전송 실패: " + data.error);
    }
  };

  const verifyCode = async () => {
    const response = await fetch("http://localhost:5000/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, verificationCode: code }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert("인증 성공!");
    } else {
      alert("인증 실패: " + data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">휴대폰 인증</h2>

        {/* 전화번호 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">휴대폰 번호</label>
          <input
            type="tel"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+8210xxxxxxxx"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          onClick={sendCode}
        >
          인증번호 요청
        </button>

        {/* 인증번호 입력 */}
        {uid && (
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-1">인증번호</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="인증번호 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg mt-3 transition"
              onClick={verifyCode}
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhoneAuthPage;
