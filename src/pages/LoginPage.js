import { useRef, useState } from "react";
import Form from "react-bootstrap/Form";

import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Notify } from "notiflix";

const formGroupStyle = "flex flex-col items-center gap-[2px] w-full";
const labelStyle = "self-start text-[10px] sm:text-[12px]";
const inputStyle =
  "border rounded-[4px] w-full sm:w-[250px] p-[8px] sm:p-[10px] text-[14px] sm:text-[16px] outline-none";

const LoginPage = ({ user, setUser }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const emailInputRef = useRef(null);
  const pwInputRef = useRef(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !email.trim()) {
      Notify.failure("이메일을 입력해주세요.");
      emailInputRef.current.focus();
      return;
    } else if (!pw || !pw.trim()) {
      Notify.failure("비밀번호를 입력해주세요.");
      pwInputRef.current.focus();
      return;
    }

    try {
      const response = await api.post("/user/login", { email, password: pw });
      if (response.status === 200) {
        setUser(response.data.user);
        sessionStorage.setItem("token", response.data.token);
        api.defaults.headers["authorization"] = "Bearer " + response.data.token;
        navigate("/");
      } else throw new Error(response.message);
    } catch (error) {
      Notify.failure(error.message, {
        width: "320px",
      });
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="display-center bg-gradient-to-b from-main to-main/20">
      <Form
        className="bg-white max-w-[270px] sm:max-w-none w-[80%] sm:w-[350px] px-[30px] sm:px-[50px] py-[50px] sm:py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] flex flex-col items-center gap-[12px]"
        onSubmit={handleLogin}
      >
        <h1 className="font-suit-700 mb-[30px] text-[24px] sm:text-[26px]">
          Login
        </h1>
        <div className={formGroupStyle}>
          <label className={labelStyle}>이메일</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            ref={emailInputRef}
            className={inputStyle}
          />
        </div>

        <div className={formGroupStyle}>
          <label className={labelStyle}>비밀번호</label>
          <input
            type="password"
            onChange={(e) => setPw(e.target.value)}
            ref={pwInputRef}
            className={inputStyle}
          />
        </div>
        <button
          type="submit"
          className="mt-[10px] p-[8px] sm:p-[10px] bg-[#80b3ff] hover:bg-[#687eff] rounded-[6px] text-white w-full sm:w-[250px] text-[12px] sm:text-[14px]"
        >
          로그인
        </button>
        <div className="text-[10px] sm:text-[12px] flex gap-[10px]">
          <p>계정이 없으신가요?</p>
          <Link
            to="/register"
            className="text-[#999999] hover:text-black no-underline hover:underline"
          >
            회원가입 하기
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
