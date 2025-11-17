import React from "react";

function TodoItem({ task, onToggle, onDelete, onReorderBottom }) {
  return (
    <div className="task" role="listitem">
      <div className="left" style={{display:"flex",alignItems:"center",gap:12}}>
        <div
          className={`checkbox ${task.completed ? "done" : ""}`}
          onClick={onToggle}
          title="Toggle complete"
          aria-hidden
        >
          {task.completed ? "✓" : ""}
        </div>

        <div style={{display:"flex",flexDirection:"column"}}>
          <div className={`taskTitle ${task.completed ? "done" : ""}`}>{task.text}</div>
          <div style={{fontSize:12,color:"var(--muted)"}}>{task.id}</div>
        </div>
      </div>

      <div className="tActions">
        <button className="smallBtn" title="Move to bottom" onClick={onReorderBottom}>↓</button>
        <button className="smallBtn delete" title="Delete" onClick={onDelete}>✕</button>
      </div>
    </div>
  );
}

export default TodoItem;
