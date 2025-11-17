import React, { useState } from "react";

/**
 * Simple auth: users saved in localStorage key 'todo_users' as array [{username, password}]
 * For demo only — don't use plain localStorage for real passwords in production.
 */

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function readUsers(){
    try {
      const raw = localStorage.getItem("todo_users");
      return raw ? JSON.parse(raw) : [];
    } catch(e){
      return [];
    }
  }

  function saveUsers(users){
    localStorage.setItem("todo_users", JSON.stringify(users));
  }

  const signup = () => {
    setErr("");
    if(!username || !password){ setErr("username & password required"); return; }
    const users = readUsers();
    if(users.find(u=>u.username===username)){ setErr("username taken"); return; }
    const newUser = { username, password };
    users.push(newUser);
    saveUsers(users);
    onAuth(newUser);
  };

  const login = () => {
    setErr("");
    const users = readUsers();
    const found = users.find(u=>u.username===username && u.password === password);
    if(!found){ setErr("invalid credentials"); return; }
    onAuth(found);
  };

  const demoLogin = () => {
    const demo = { username: "demo", password: "demo" };
    // ensure demo user exists
    const users = readUsers();
    if(!users.find(u=>u.username==="demo")){
      users.push(demo);
      saveUsers(users);
      // add sample tasks for demo
      localStorage.setItem("todo_tasks_demo", JSON.stringify([
        { id: "t1", text: "Welcome — drag to reorder me", completed: false },
        { id: "t2", text: "Toggle dark mode from the right", completed: false },
        { id: "t3", text: "Click and press delete to remove me", completed: false },
      ]));
    }
    onAuth(demo);
  };

  return (
    <div style={{maxWidth:920, margin:"40px auto", padding:20}}>
      <div className="app" style={{gridTemplateColumns:"1fr"}}>
        <div className="card" style={{display:"flex",gap:12,alignItems:"center",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div className="logo">TD</div>
            <div style={{textAlign:"left"}}>
              <div className="title">React Todo — Login</div>
              <div className="subtitle">Simple auth + persistence demo</div>
            </div>
          </div>

          <div style={{width:"100%",maxWidth:560}}>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <button className={`btn ${mode==="login"?"": "ghost"}`} onClick={()=>setMode("login")}>Login</button>
              <button className={`btn ${mode==="signup"?"": "ghost"}`} onClick={()=>setMode("signup")}>Sign up</button>
              <button className="ghost" onClick={demoLogin}>Demo</button>
            </div>

            <div style={{display:"grid",gap:8}}>
              <input className="input" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
              <input className="input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
              {err && <div style={{color:"var(--danger)",fontWeight:700}}>{err}</div>}
              <div style={{display:"flex",gap:8}}>
                {mode==="login" ? (
                  <button className="btn" onClick={login}>Login</button>
                ) : (
                  <button className="btn" onClick={signup}>Create account</button>
                )}
                <button className="ghost" onClick={()=>{ setUsername(""); setPassword(""); setErr(""); }}>Clear</button>
              </div>
              <div style={{marginTop:8,fontSize:13,color:"var(--muted)"}}>
                <strong>Note:</strong> This demo stores accounts & tasks in localStorage per browser. For production, always use secure server-side auth.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
