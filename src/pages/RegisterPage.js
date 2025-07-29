import { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { Notify } from "notiflix";

const formGroupStyle = "flex flex-col items-center gap-[2px] w-full";
const labelStyle = "self-start text-[10px] sm:text-[12px]";
const inputStyle =
  "border rounded-[4px] w-full sm: w-[250px] p-[8px] sm:p-[10px] text-[14px] sm:text-[16px] outline-none";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const pwInputRef = useRef(null);
  const pwCheckInputRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !name.trim()) {
      Notify.failure("이름을 입력해주세요.");
      nameInputRef.current.focus();
      return;
    } else if (!email || !email.trim()) {
      Notify.failure("이메일을 입력해주세요.");
      emailInputRef.current.focus();
      return;
    } else if (!pw || !pw.trim()) {
      Notify.failure("비밀번호를 입력해주세요.");
      pwInputRef.current.focus();
      return;
    } else if (!pwCheck || !pwCheck.trim()) {
      Notify.failure("비밀번호를 한 번 더 입력해주세요.", {
        width: "300px",
      });
      pwCheckInputRef.current.focus();
      return;
    }

    try {
      if (pw !== pwCheck) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }
      const response = await api.post("/user", { name, email, password: pw });
      if (response.status === 200) {
        Notify.success("회원가입이 완료되었습니다.");
        navigate("/login");
      } else throw new Error(response.data.error);
    } catch (error) {
      Notify.failure(error.message, {
        width: "320px",
      });
    }
  };

  return (
    <div className="display-center bg-gradient-to-b from-main to-main/20">
      <Form
        className="bg-white max-w-[270px] sm:max-w-none w-[80%] sm:w-[350px] px-[30px] sm:px-[50px] py-[50px] sm:py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] flex flex-col items-center gap-[12px]"
        onSubmit={handleSubmit}
      >
        <h1 className="font-suit-700 mb-[30px] text-[24px] sm:text-[26px]">
          Sign Up
        </h1>
        <div className={formGroupStyle}>
          <label className={labelStyle}>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            ref={nameInputRef}
            className={inputStyle}
          />
        </div>

        <div className={formGroupStyle}>
          <label className={labelStyle}>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailInputRef}
            className={inputStyle}
          />
        </div>

        <div className={formGroupStyle}>
          <label className={labelStyle}>비밀번호</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            ref={pwInputRef}
            className={inputStyle}
          />
        </div>

        <div className={formGroupStyle}>
          <label className={labelStyle}>비밀번호 확인</label>
          <input
            type="password"
            value={pwCheck}
            onChange={(e) => setPwCheck(e.target.value)}
            ref={pwCheckInputRef}
            className={inputStyle}
          />
        </div>

        <button
          type="submit"
          className="mt-[10px] p-[10px] bg-[#80b3ff] hover:bg-[#687eff] rounded-[6px] text-white w-full sm:w-[250px] text-[12px] sm:text-[14px]"
        >
          회원가입
        </button>
        <Link
          to="/login"
          className="text-[10px] sm:text-[12px] text-[#999999] hover:text-black no-underline hover:underline"
        >
          로그인하기
        </Link>
      </Form>
    </div>
  );
};

export default RegisterPage;
