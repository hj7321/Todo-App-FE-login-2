import { useEffect, useRef, useState } from "react";
import TodoItem from "./TodoItem";

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
      <div className="flex justify-between items-centerm mb-[10px]">
        <h2 className="font-suit-800 text-[26px]">📝 TODO LIST</h2>
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
          className="hover:font-suit-700 mr-[5px] w-[100px]"
        >
          {showMyTodos ? "모두의 TODO" : "나의 TODO"}
        </button>
      </div>
      <div className="flex flex-wrap gap-[20.2px] p-[10px]">
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
