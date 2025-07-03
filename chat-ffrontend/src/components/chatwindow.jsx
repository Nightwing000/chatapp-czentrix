import React, { useEffect, useRef, useState } from "react";
import "./chatwindow.css";

import socket from "../socket"; 

export default function ChatWindow({ visitor }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);
  const [visitors, setVisitors] = useState([]);

  
  useEffect(() => {
  socket.on("visitor_message", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  return () => {
    socket.off("visitor_message");
    };
  }, []);
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  const handleSend = () => {
    const msg = { text: input, from: "agent", time: new Date().toLocaleTimeString() };
    socket.emit("agent_message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  if (!visitor) return <div className="chat-window empty">Select a visitor</div>;

  return (
    <div className="chat-window">
      <div className="chat-header">{visitor.name}</div>
      <div className="chat-messages">
        {messages.map((msg, i) => {
  return (
    <div key={i} className={`chat-bubble ${msg.from}`}>
      {msg.text}
      <span className="time">{msg.time}</span>
    </div>
  );
})}
        <div ref={messageEndRef}></div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

// Utility to get time 
function getTimeNow() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}


