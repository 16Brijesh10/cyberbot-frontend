/*HistorySidebar.js*/
import React, { useEffect, useState } from 'react';
import { getAvailableTitles } from './api';
import './HistorySidebar.css';

function HistorySidebar({ onSelectHistory, onNewChat, userEmail, refreshTrigger }) {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    async function fetchTitles() {
      try {
        const data = await getAvailableTitles(userEmail);
        setChatList(data.titles);
      } catch (err) {
        console.error("Error fetching titles", err);
      }
    }
    if (userEmail) {
      fetchTitles();
    }
  }, [userEmail, refreshTrigger]); // 🔁 triggers when refreshTrigger changes
  

  return (
    <div className="history-sidebar">
      <h2>Chat History</h2>

      <ul>
        <li onClick={onNewChat} style={{ fontWeight: 'bold', color: '#1a73e8' }}>
          ➕ New Chat
        </li>
        {chatList.map(({ chatId, title }) => (
          <li key={chatId} onClick={() => onSelectHistory(chatId)}>
            {title.length > 40 ? title.slice(0, 40) + "..." : title}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default HistorySidebar;
