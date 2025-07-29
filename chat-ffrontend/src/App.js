import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import ChatWindow from "./components/chatwindow";
import VisitorProfile from "./components/visitorprofile";
import { SocketProvider } from "./contexts/SocketContext";
import "./App.css";

function App() {
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  return (
    <SocketProvider>
      <div className="app-container">
        <div className="sidebar-wrapper">
          <Sidebar onSelectVisitor={setSelectedVisitor} />
        </div>
        <div className="chat-window-wrapper">
          <ChatWindow visitor={selectedVisitor} />
        </div>
        <div className="visitor-profile-wrapper">
          <VisitorProfile visitor={selectedVisitor} />
        </div>
      </div>
    </SocketProvider>
  );
}

export default App;
