import { useCallback, useEffect, useRef, useState } from "react";
import TodoBoard from "../components/TodoBoard";
import api from "../utils/api";
import { Notify } from "notiflix";

const TodoPage = ({ handleLogout }) => {
  const [todoList, setTodoList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState(3);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMyTodos, setShowMyTodos] = useState(false);

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // 현재 로그인한 사용자 정보를 가져오는 함수
  const getCurrentUser = async () => {
    try {
      const response = await api.get("/user/me");
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error("error", error);
      handleLogout();
    }
  };

  // TODO 목록을 가져오는 함수
  const getTasks = useCallback(async (isMyTodos = false, keyword = "") => {
    try {
      let url = "/tasks";
      if (isMyTodos) url = "/tasks/my";
      else if (keyword.trim()) url = `/tasks/search?q=${keyword.trim()}`;

      const response = await api.get(url);
      const data = response.data.data;
      setTodoList(data);
    } catch (error) {
      console.error("error", error);
    }
  }, []);

  // TODO를 추가하는 함수
  const handleAddTask = async () => {
    if (!title || !title.trim()) {
      Notify.failure("제목을 입력해주세요.");
      titleRef.current.focus();
      return;
    } else if (!content || !content.trim()) {
      Notify.failure("내용을 입력해주세요.");
      contentRef.current.focus();
      return;
    }

    try {
      const response = await api.post("/tasks", {
        title,
        content,
        priority,
        isComplete: false,
      });
      if (response.status === 201) {
        setTitle("");
        setContent("");
        setPriority(3);
        getTasks(showMyTodos, "");
      } else {
        throw new Error("task can not be added");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  // "나의 TODO" 토글 핸들러
  const handleToggleMyTodos = useCallback(() => {
    const newState = !showMyTodos;
    setShowMyTodos(newState);
    getTasks(newState, "");
  }, [showMyTodos, getTasks]);

  useEffect(() => {
    getCurrentUser();
    getTasks(showMyTodos, "");
  }, []);

  return (
    <section className="flex flex-col items-center min-h-screen pt-[10px] pb-[40px] sm:pt-[10px] sm:pb-[10px] px-[30px] sm:px-[40px]">
      <header className="relative w-full flex justify-center">
        <img
          src="/images/logo.png"
          alt="logo"
          width={300}
          className="w-[200px] sm:w-[300px]"
        />
        <button
          onClick={handleLogout}
          className="text-[#747474] absolute right-[-10px] sm:right-[0px] text-[10px] sm:text-[15px] hover:font-suit-700"
        >
          로그아웃
        </button>
      </header>

      <div className="flex flex-col gap-[4px] sm:gap-[10px] mb-[20px] w-full sm:w-[600px] rounded-[6px] bg-main/20 px-[20px] pt-[12px] pb-[20px] shadow-md">
        <h3 className="font-suit-800 text-[18px] sm:text-[20px]">
          TODO를 작성해 주세요
        </h3>
        <div className="flex flex-col gap-[2px] sm:gap-[5px]">
          <div>
            <label
              htmlFor="title"
              className="text-gray-600 text-[12px] sm:text-[14px]"
            >
              제목
            </label>
            <input
              type="text"
              id="title"
              className="input-box text-[13.5px] sm:text-[14.5px] p-[7px] sm:p-[10px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={titleRef}
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="text-gray-600 text-[12px] sm:text-[14px]"
            >
              내용
            </label>
            <textarea
              type="text"
              id="content"
              className="input-box text-[13.5px] sm:text-[14.5px] p-[7px] sm:p-[10px] h-[15vh] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              ref={contentRef}
            />
          </div>
          <div className="flex gap-[10px] items-center">
            <label
              htmlFor="priority"
              className="text-gray-600 text-[12px] sm:text-[14px]"
            >
              중요도
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="h-[20px] sm:h-[28px] w-[100px] sm:w-[130px] border border-lightblue text-[11.5px] sm:text-[14px] outline-none cursor-pointer rounded-[4px]"
            >
              <option value={1}>⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={5}>⭐⭐⭐⭐⭐</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleAddTask}
          className="mt-[5px] sm:mt-[0px] rounded-[4px] bg-green-400 hover:bg-green-500 text-white text-[10.5px] sm:text-[13px] px-[8px] sm:px-[10px] py-[5px] sm:py-[6px] h-fit w-fit"
        >
          추가하기
        </button>
      </div>

      <TodoBoard
        todoList={todoList}
        getTasks={getTasks}
        showMyTodos={showMyTodos}
        handleToggleMyTodos={handleToggleMyTodos}
        currentUser={currentUser}
        setShowMyTodos={setShowMyTodos}
      />
    </section>
  );
};

export default TodoPage;
