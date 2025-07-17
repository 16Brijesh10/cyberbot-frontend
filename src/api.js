import axios from 'axios';

const API_URL = "https://cyberbot-backend.onrender.com";

// Send user message to backend

export const sendMessage = async (message, email, chatId) => {
    console.log("Sending message payload:", { message, email, chat_id: chatId });  // ✅ Check this
    const res = await axios.post(`${API_URL}/chat`, {
        message,
        email,
        chat_id: chatId
    });
    return res.data.answer;
};


// Load full chat history by chatId
export const getHistoryByDate = async (chatId, email) => {
    const res = await axios.post(`${API_URL}/history`, {
        chat_id: chatId,
        email
    });
    return res.data;
};

// Load all available titles for user
export const getAvailableTitles = async (email) => {
    const res = await axios.get(`${API_URL}/history/titles`, {
        params: { email }
    });
    return res.data.titles;
};
