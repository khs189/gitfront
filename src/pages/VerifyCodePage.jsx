import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";
function VerifyCodePage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;

  const handleVerify = async () => {
    const response = await fetch(`${API_BASE_URL}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, code }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigate("/main");
    } else {
      alert("인증 실패");
    }
  };

  return (
    <div>
      <h2>인증번호 입력</h2>
      <input
        type="text"
        placeholder="인증번호 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleVerify}>확인</button>
    </div>
  );
}

export default VerifyCodePage;
