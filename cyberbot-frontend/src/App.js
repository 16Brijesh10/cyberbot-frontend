import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import HistorySidebar from './HistorySidebar';
import { getHistoryByDate } from './api';
import { getAvailableTitles } from './api'; // Add this at the top
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import './App.css';
import './firebase';
import { v4 as uuidv4 } from 'uuid';


function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [chatId, setChatId] = useState(uuidv4()); // NEW: Manage chatId
  const [refreshSidebar, setRefreshSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Sign-in error", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setMessages([]);
    setChatId(null);
  };

  const handleHistorySelect = async (chatId) => {
    if (!user?.email) return;
    try {
      const history = await getHistoryByDate(chatId, user.email);
      setMessages(history.messages || []);
      setChatId(chatId);
    } catch (error) {
      console.error("Error fetching history:", error);
      setMessages([{ role: "assistant", content: `Error: Could not load history.` }]);
      setChatId(null);
    }
  };
  

  const handleNewChat = () => {
    setMessages([]);
    setChatId(uuidv4()); // NEW: Generate unique ID for this new chat
    setRefreshSidebar(prev => !prev);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const titles = await getAvailableTitles(user.email);
          if (titles.length > 0) {
            handleHistorySelect(titles[0].chatId); // ✅ Use real chatId from DB
          } else {
            handleNewChat(); // No history? start fresh
          }
        } catch (err) {
          console.error("Failed to load titles:", err);
        }
      } else {
        setMessages([]);
        setChatId(null);
      }
    });
  
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <>
      {user ? (
        <>
          <div className={`header ${darkMode ? 'dark' : 'light'}`}>
            <h1>Cyber Bot 🤖</h1>
            <div className="header-buttons">
              {user.photoURL && <img src={user.photoURL} alt="Profile" className="profile-pic" />}
              <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              <button className="sign-in-btn" onClick={handleSignOut}>
                ⬅️ Sign Out ({user.displayName || user.email})
              </button>
            </div>
          </div>
          <div className={`app-layout ${darkMode ? 'dark' : 'light'}`}>
            <HistorySidebar onSelectHistory={handleHistorySelect} onNewChat={handleNewChat} userEmail={user.email} refreshTrigger={refreshSidebar}/>
            <div className="main-chat">
              <Chat messages={messages} setMessages={setMessages} email={user.email} chatId={chatId} />
            </div>
          </div>
        </>
      ) : (
        <div className="login-page">
          <div className="login-container">
            <div className="login-box">
              <h1>Welcome to Cyber Bot 🤖</h1>
              <button className="sign-in-btn" onClick={handleGoogleSignIn}>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
