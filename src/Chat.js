// Chat.js - Updated to support unique chatId per session
import React, { useRef, useEffect, useState } from 'react';
import { sendMessage } from './api';
import './Chat.css';
import ReactMarkdown from 'react-markdown';


function Chat({ messages, setMessages, email, chatId }) {
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(input, email, chatId);
      setMessages([...newMessages, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...newMessages, { role: "assistant", content: "Error: Could not get a response." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear all chat messages?")) {
      setMessages([]);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-wrapper ${msg.role}`}>
            <div className={`message ${msg.role}`}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="spinner message-wrapper bot">
            <div className="message bot">
              <span>🤖 CyberBot is thinking...!!!!!</span>
            </div>
          </div>
        )}
        <div ref={chatRef}></div>
      </div>
      <div className="input-area-wrapper">
        <div className="input-box">
          <input
            type="text"
            placeholder="Ask CyberBot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading}>Send</button>
        </div>
        <div className="clear-chat">
          <button onClick={handleClear}>🗑️ Clear Chat</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
