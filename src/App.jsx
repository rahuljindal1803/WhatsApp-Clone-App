import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import SideBar from "./components/SideBar/SideBar";
import { Route, Routes } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import UserContext from "./components/features/useContext";

const App = () => {
  const [user, setUser] = useState(null);
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };
  const handleLogout = (loggedOutUser) => {
    setUser(loggedOutUser);
  };

  return (
    <UserContext.Provider value={user}>
      <div className="app">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="app_body">
            <SideBar onLogout={handleLogout} user={user} />
            <Routes>
              <Route path="/rooms/:roomId" element={<Chat />} />
              <Route path="/" element={<Chat />} />
            </Routes>
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
};

export default App;
