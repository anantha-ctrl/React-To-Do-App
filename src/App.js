import React, { useEffect, useState } from "react";
import Auth from "./components/Auth";
import TodoApp from "./components/TodoApp";
import "./index.css";

function App(){
  // currentUser stored in localStorage key 'todo_currentUser'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(()=>{
    const stored = localStorage.getItem("todo_currentUser");
    if(stored) setCurrentUser(JSON.parse(stored));
  },[]);

  const handleLogin = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem("todo_currentUser", JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("todo_currentUser");
  };

  return (
    <div style={{width:"100%"}}>
      {currentUser ? (
        <TodoApp user={currentUser} onLogout={handleLogout} onAuthChange={handleLogin} />
      ) : (
        <Auth onAuth={handleLogin} />
      )}
    </div>
  );
}

export default App;
