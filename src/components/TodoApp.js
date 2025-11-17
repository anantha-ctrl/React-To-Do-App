import React, { useEffect, useState, useRef } from "react";
import TodoItem from "./TodoItem";

/**
 * Persist keys:
 * - tasks: todo_tasks_{username}  => array of {id,text,completed}
 * - theme: todo_theme_{username}  => 'light' | 'dark'
 */

function TodoApp({ user, onLogout, onAuthChange }) {
  const TASK_KEY = `todo_tasks_${user.username}`;
  const THEME_KEY = `todo_theme_${user.username}`;

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [theme, setTheme] = useState("light");
  const dragIndexRef = useRef(null);

  useEffect(()=>{
    const raw = localStorage.getItem(TASK_KEY);
    if(raw) setTasks(JSON.parse(raw));
    const t = localStorage.getItem(THEME_KEY) || "light";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t === "dark" ? "dark" : "light");
  },[TASK_KEY,THEME_KEY]);

  useEffect(()=>{
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  },[tasks, TASK_KEY]);

  useEffect(()=>{
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  },[theme, THEME_KEY]);

  const addTask = () => {
    const val = text.trim();
    if(!val) return;
    const id = "t" + Date.now().toString(36);
    setTasks(prev => [{ id, text: val, completed:false }, ...prev]);
    setText("");
  };

  const toggle = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t));
  };

  const remove = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  // Drag & Drop: HTML5 API
  const onDragStart = (e, idx) => {
    dragIndexRef.current = idx;
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", idx.toString()); } catch(e){}
    // small visual
    e.currentTarget.classList.add("dragging");
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDragEnter = (e) => {
    e.currentTarget.classList.add("dropHint");
  };

  const onDragLeave = (e) => {
    e.currentTarget.classList.remove("dropHint");
  };

  const onDrop = (e, dropIndex) => {
    e.preventDefault();
    const startIndex = dragIndexRef.current !== null ? dragIndexRef.current : parseInt(e.dataTransfer.getData("text/plain") || "0",10);
    if(startIndex === dropIndex){ cleanupDrag(e); return; }
    setTasks(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(startIndex,1);
      arr.splice(dropIndex,0,moved);
      return arr;
    });
    cleanupDrag(e);
  };

  const cleanupDrag = (e) => {
    dragIndexRef.current = null;
    // remove classes
    document.querySelectorAll(".dragging").forEach(el => el.classList.remove("dragging"));
    document.querySelectorAll(".dropHint").forEach(el => el.classList.remove("dropHint"));
  };

  const reorderToBottom = (id) => {
    setTasks(prev => {
      const arr = prev.filter(t => t.id !== id);
      const item = prev.find(t => t.id === id);
      arr.push(item);
      return arr;
    });
  };

  const filtered = tasks.filter(t => {
    if(filter === "all") return true;
    if(filter === "active") return !t.completed;
    return t.completed;
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  const logout = () => {
    onLogout();
  };

  // Simple account deletion (demo convenience)
  const deleteAccount = () => {
    if(!window.confirm("Delete account and all data? This cannot be undone.")) return;
    // remove user record from todo_users and remove data keys
    const usersRaw = localStorage.getItem("todo_users");
    if(usersRaw){
      try {
        const users = JSON.parse(usersRaw).filter(u=>u.username !== user.username);
        localStorage.setItem("todo_users", JSON.stringify(users));
      } catch(e){}
    }
    localStorage.removeItem(TASK_KEY);
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem("todo_currentUser");
    onLogout();
  };

  return (
    <div style={{maxWidth:1100, margin:"16px auto"}}>
      <div className="app">
        <div className="card">
          <div className="header">
            <div className="brand">
              <div className="logo">TD</div>
              <div>
                <div className="title">Hello, {user.username}</div>
                <div className="subtitle">A modern todo with drag & drop • persistent per user</div>
              </div>
            </div>

            <div className="controls">
              <div style={{textAlign:"right", marginRight:12}}>
                <div style={{fontWeight:700}}>{activeCount} active</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>{completedCount} done</div>
              </div>

              <button className="btn ghost" onClick={toggleTheme}>{theme === "dark" ? "Light" : "Dark"}</button>
              <button className="ghost" onClick={logout}>Logout</button>
            </div>
          </div>

          {/* Input */}
          <div className="inputRow">
            <input className="input" placeholder="Add a task — press Enter or click Add" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key === "Enter") addTask(); }} />
            <button className="addBtn" onClick={addTask}>Add</button>
          </div>

          {/* Filters */}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button className={`smallBtn ${filter==="all"?"btn":""}`} onClick={()=>setFilter("all")}>All</button>
            <button className={`smallBtn ${filter==="active"?"btn":""}`} onClick={()=>setFilter("active")}>Active</button>
            <button className={`smallBtn ${filter==="completed"?"btn":""}`} onClick={()=>setFilter("completed")}>Completed</button>
            <div style={{flex:1}}></div>
            <button className="smallBtn ghost" onClick={clearCompleted}>Clear completed</button>
          </div>

          {/* Task list */}
          <div className="list" role="list" style={{marginTop:10}}>
            {filtered.length === 0 && <div style={{color:"var(--muted)",padding:18,borderRadius:10}}>No tasks — add your first one ✨</div>}
            {filtered.map((t, idx) => (
              <div key={t.id}
                   draggable
                   onDragStart={(e)=>onDragStart(e, idx)}
                   onDragOver={onDragOver}
                   onDragEnter={onDragEnter}
                   onDragLeave={onDragLeave}
                   onDrop={(e)=>onDrop(e, idx)}
              >
                <TodoItem
                  task={t}
                  onToggle={()=>toggle(t.id)}
                  onDelete={()=>remove(t.id)}
                  onReorderBottom={()=>reorderToBottom(t.id)}
                />
              </div>
            ))}
          </div>

          <div className="footer">&copy;2025 Designed and developed by <a href="https://github.com/anantha-ctrl/">Anantha Kumar G</a> </div>
        </div>

        <div className="side">
          <div className="stat card">
            <h3>Quick actions</h3>
            <p className="subtitle">Tools for this demo account</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
              <button className="btn" onClick={()=>{ setText("New quick task"); }}>Quick add</button>
              <button className="ghost" onClick={()=>{ setTasks([]); }}>Empty list</button>
              <button className="ghost" onClick={deleteAccount} style={{color:"var(--danger)",borderColor:"rgba(255,0,0,0.06)"}}>Delete account</button>
            </div>
          </div>

          <div className="stat card">
            <h3>Account</h3>
            <p>Logged in as <strong>{user.username}</strong></p>
            <p style={{marginTop:6,color:"var(--muted)"}}>Theme: <strong>{theme}</strong></p>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button className="btn" onClick={()=>{ setTheme(prev => prev === "dark" ? "light" : "dark"); }}>Toggle theme</button>
              <button className="ghost" onClick={()=>{ navigator.clipboard?.writeText(`${window.location.href} (user:${user.username})`); }}>Share</button>
            </div>
          </div>

          <div className="stat card">
            <h3>About</h3>
            <p className="subtitle">This version includes drag & drop reordering, per-user data storage, and a simple auth flow — all in vanilla React.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
