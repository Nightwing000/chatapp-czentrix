import React, { useEffect, useRef, useState } from "react";
import "./chatwindow.css";
import socket from "../socket";

import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../store/chatSlice";
import { markvisitorAsRead } from "../store/chatSlice";

export default function ChatWindow({ visitor }) {
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  const [input, setInput] = useState("");

  const visitorId = visitor?.id;
  const messages = useSelector(
    (state) => state.chats.messagesByVisitor[visitorId] || []
  );

  const selectedId = useSelector((state) => state.visitors.selectedId);

  useEffect(() => {
    const handleVisitorMessage = (data) => {
      dispatch(addMessage({ visitorId: data.visitorId, message: data, selectedId}));
    };

    socket.on("visitor message", handleVisitorMessage);
    return () => socket.off("visitor message", handleVisitorMessage);
  }, [dispatch, selectedId]);

 useEffect(() => {
  if (visitor?.id) {
    dispatch(markvisitorAsRead({ visitorId: visitor.id }));
  }
}, [visitor?.id, dispatch]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  //  Send agent message
  const handleSend = () => {
    if (!input.trim() || !visitorId) return;

    const msg = {
      text: input,
      from: "agent",
      time: new Date().toLocaleTimeString(),
      visitorId,
    };

    socket.emit("agent_message", msg);
    dispatch(addMessage({ visitorId, message: msg }));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  if (!visitor)
    return <div className="chat-window empty">Select a visitor</div>;

  return (
    <div className="chat-window">
      <div className="chat-header">{visitor.name}</div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.from}`}>
            {msg.text}
            <span className="time">{msg.time}</span>
          </div>
        ))}
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

