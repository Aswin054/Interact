import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const titles = messages
    .filter((message) => message.sender === "user")
    .map((message, index) => ({ id: index, text: message.text.split(" ").slice(0, 3).join(" ") }));

  async function handleSendMessage() {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      const botMessage = { sender: "bot", text: "Loading..." };
      setMessages((prev) => [...prev, botMessage]);

      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAfnxNVKoMG1SdcaFWgxCdCYyygD_O5eS0",
        method: "POST",
        data: {
          contents: [{ parts: [{ text: userMessage.text }] }],
        },
      });

      const botResponse = response.data.candidates[0].content.parts[0].text;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: botResponse };
        return updated;
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "Error: Unable to fetch the response.",
        };
        return updated;
      });
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h2>Chat History</h2>
        <ul className="chat-history">
          {titles.map((title) => (
            <li key={title.id}>{title.text}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="chat-header">Start Your Chat and Learn</div>
        <div className="chat-body">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
