import { useEffect, useRef, useState } from "react";
import TodoItem from "./TodoItem";
import useIsSmallScreen from "../hooks/useIsSmallScreen";

const TodoBoard = ({
  todoList,
  getTasks,
  showMyTodos,
  handleToggleMyTodos,
  currentUser,
  setShowMyTodos,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchInputRef = useRef(null);

  const isSmallScreen = useIsSmallScreen();

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setShowMyTodos(false);
  };

  // 디바운싱 적용
  useEffect(() => {
    const handler = setTimeout(() => {
      getTasks(false, searchKeyword);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchKeyword, getTasks]);

  return (
    <div className="mt-[20px] w-full min-h-[400px]">
      {isSmallScreen ? (
        <div className="flex flex-col gap-[6px] justify-between items-center mb-[15px]">
          <h2 className="font-suit-800 text-[24px] pt-[8px]">📝 TODO LIST</h2>
          <div className="flex gap-[20px] justify-center items-center w-full">
            <input
              type="text"
              placeholder="검색어를 입력하세요 (제목, 내용)"
              className="w-[50%] border placeholder:text-[10px] px-[7px] py-[3px] rounded-[4px] outline-none text-[12px]"
              value={searchKeyword}
              onChange={handleSearchChange}
              ref={searchInputRef}
            />
            <button
              onClick={() => {
                handleToggleMyTodos();
                setSearchKeyword("");
              }}
              className="hover:font-suit-700 w-[60px] text-[10px] mt-[3px]"
            >
              {showMyTodos ? "모두의 TODO" : "나의 TODO"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-[10px]">
          <h2 className="font-suit-800 text-[26px] pt-[8px]">📝 TODO LIST</h2>
          <input
            type="text"
            placeholder="검색어를 입력하세요 (제목 또는 내용)"
            className="w-[300px] border placeholder:text-[12px] px-[10px] py-[7px] rounded-[4px] outline-none text-[15px]"
            value={searchKeyword}
            onChange={handleSearchChange}
            ref={searchInputRef}
          />
          <button
            onClick={() => {
              handleToggleMyTodos();
              setSearchKeyword("");
            }}
            className="hover:font-suit-700 mr-[5px] w-[100px] text-[16px]"
          >
            {showMyTodos ? "모두의 TODO" : "나의 TODO"}
          </button>
        </div>
      )}
      <div className="flex flex-wrap justify-center sm:justify-start gap-[12px] sm:gap-[20.2px] p-[0px] sm:p-[10px]">
        {todoList.length > 0 ? (
          todoList.map((item) => (
            <TodoItem
              key={item._id}
              item={item}
              getTasks={getTasks}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default TodoBoard;
