import React, { useEffect, useRef, useState } from "react";
import "./chatwindow.css";
import socket from "../socket";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../store/chatSlice";
import { markvisitorAsRead } from "../store/chatSlice";

export default function ChatWindow({ visitor }) {
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
  if (!input.trim() && !selectedFile) return;

  const msg = {
    text: input,
    from: "agent",
    time: new Date().toLocaleTimeString(),
    visitorId,
    attachments: selectedFile ? [selectedFile] : [],
  };

  socket.emit("agent_message", msg);
  dispatch(addMessage({ visitorId, message: msg }));
  setInput("");
  setSelectedFile(null);
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
            {/* Render HTML tables and other HTML safely */}
            <div
              className="chat-message-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(msg.text),
              }}
            />
            {msg.attachments?.map((att, j) => {
              if (att.type === "image") {
                return <img key={j} src={att.url} alt={att.name} className="chat-image" />;
              } else if (att.type === "video") {
                return (
                  <video key={j} controls className="chat-video">
                    <source src={att.url} />
                  </video>
                );
              } else {
                return (
                  <a key={j} href={att.url} download target="_blank" rel="noreferrer">
                    📎 {att.name}
                  </a>
                );
              }
            })}
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
        <input
  type="file"
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : "file";
    setSelectedFile({ url, type, name: file.name });
  }}
/>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

