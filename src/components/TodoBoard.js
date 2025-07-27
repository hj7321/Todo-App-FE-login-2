import TodoItem from "./TodoItem";

const TodoBoard = ({
  todoList,
  getTasks,
  showMyTodos,
  handleToggleMyTodos,
  currentUser,
}) => {
  return (
    <div className="mt-[20px] mb-[60px] w-full">
      <div className="flex justify-between">
        <h2 className="font-suit-800 text-[26px]">📝 TODO LIST</h2>
        <div></div>
        <button onClick={handleToggleMyTodos} className="hover:font-suit-700">
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
          <h2>There is no Item to show</h2>
        )}
      </div>
    </div>
  );
};

export default TodoBoard;
