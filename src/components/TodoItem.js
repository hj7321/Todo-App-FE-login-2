import { useRef, useState } from "react";
import api from "../utils/api";
import { Notify } from "notiflix";

const buttonStyle =
  "rounded-[4px] text-white text-[12px] px-[8px] py-[4px] h-fit w-fit";

const TodoItem = ({ item, getTasks, currentUser }) => {
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);
  const [editIsComplete, setEditIsComplete] = useState(item.isComplete);
  const [editPriority, setEditPriority] = useState(item.priority);
  const [priorityEdit, setPriorityEdit] = useState(false);
  const selectRef = useRef(null);

  const isMyTodo =
    currentUser && item.author && currentUser._id === item.author._id;

  const handleDeleteTask = async () => {
    const yes = window.confirm("정말 삭제하시겠습니까?");
    if (!yes) return;
    try {
      const response = await api.delete(`/tasks/${item._id}`);
      console.log(response);
      Notify.success("할 일이 삭제되었습니다.");
      getTasks();
    } catch (error) {
      console.error("error", error);
      Notify.failure("할 일을 삭제하지 못했습니다.");
    }
  };

  const handleModifyTaskContent = async () => {
    try {
      const response = await api.put(`/tasks/${item._id}`, {
        title: editTitle,
        content: editContent,
        priority: editPriority,
      });
      console.log(response);
      item.title = editTitle;
      item.content = editContent;
      item.priority = editPriority;
      getTasks();
      Notify.success("할 일이 수정되었습니다.");
    } catch (error) {
      console.error("error", error);
      Notify.failure("할 일을 수정하지 못했습니다.");
    }
  };

  const handleModifyTaskStatus = async () => {
    const nextStatus = !editIsComplete;
    setEditIsComplete(nextStatus);
    try {
      const response = await api.put(`/tasks/${item._id}`, {
        isComplete: nextStatus,
      });
      console.log(response);
      getTasks();
    } catch (error) {
      console.error("error", error);
    }
  };

  const handlePrioritySpanClick = (e) => {
    e.preventDefault();
    if (isMyTodo) {
      setPriorityEdit(true);
      requestAnimationFrame(() => {
        const sel = selectRef.current;
        if (!sel) return;
        if (sel.showPicker) sel.showPicker();
        else sel.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      });
    }
  };

  return (
    <div className="min-w-[340px]">
      <div className="bg-main/20 flex flex-col gap-[30px] px-[12px] py-[9px] shadow-md rounded-[4px]">
        <div className="relative">
          <div className="flex flex-col gap-[3px]">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="bg-transparent font-bold text-[18px] outline-none border-none focus:ring-0"
              spellCheck="false"
              readOnly={!isMyTodo}
            />

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="bg-transparent text-[15px] outline-none border-none focus:ring-0 w-full resize-none"
              rows={Math.max(3, editContent.split("\n").length)} // 내용에 따라 높이 자동 조절 (최소 3줄)
              style={{ whiteSpace: "pre-wrap" }} // 줄바꿈과 공백을 유지하도록 스타일 추가
              spellCheck="false"
              readOnly={!isMyTodo}
            />
            <div>
              {priorityEdit && isMyTodo ? (
                <select
                  ref={selectRef}
                  value={editPriority}
                  onChange={(e) => setEditPriority(Number(e.target.value))}
                  onBlur={() => setPriorityEdit(false)}
                  className="outline-none border-none bg-transparent text-[12px] cursor-pointer appearance-none"
                  autoFocus
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n} className="text-[12px]">
                      {"⭐".repeat(n)}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className="text-[12px] cursor-pointer select-none"
                  onMouseDown={handlePrioritySpanClick}
                >
                  {"⭐".repeat(editPriority)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleModifyTaskStatus}
            className="absolute top-[0px] right-[-3px] text-[13px] bg-blue-100 rounded-full pl-[5px] pr-[8px] py-[2px]"
            disabled={!isMyTodo}
          >
            {editIsComplete ? "✅완료" : "⏳진행 중"}
          </button>
        </div>

        {isMyTodo && (
          <div className="flex gap-[5px]">
            <button
              onClick={handleDeleteTask}
              className={`bg-red-300 hover:bg-red-400 ${buttonStyle}`}
            >
              삭제
            </button>
            <button
              onClick={handleModifyTaskContent}
              className={`bg-purple-300 hover:bg-purple-400 ${buttonStyle}`}
            >
              수정
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
