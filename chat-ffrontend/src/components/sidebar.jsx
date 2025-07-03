import React, { useState, useEffect } from "react";
import "./sidebar.css";
import socket from "../socket"; 

const team = [
  { id: 1, name: "Team Alpha" },
  { id: 2, name: "Team Beta" },
];

export default function Sidebar({ onSelectVisitor }) {
  const [activeTab, setActiveTab] = useState("visitors");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [visitors, setVisitors] = useState([]); 

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleVisitorClick = (visitor) => {
    setSelectedVisitor(visitor.id);
    if (onSelectVisitor) onSelectVisitor(visitor);
  };

  useEffect(() => {
    // Listen for new visitors from backend
    socket.on("new_visitor", (visitor) => {
      setVisitors((prev) => [...prev, visitor]);
    });

    return () => {
      socket.off("new_visitor");
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === "visitors" ? "active" : "inactive"}`}
          onClick={() => handleTabClick("visitors")}
        >
          Visitors
        </button>
        <button
          className={`sidebar-tab ${activeTab === "team" ? "active" : "inactive"}`}
          onClick={() => handleTabClick("team")}
        >
          Team
        </button>
      </div>
      <div className="sidebar-content">
        {activeTab === "visitors" ? (
          <ul className="sidebar-list">
            {visitors.map((visitor) => (
              <li
                key={visitor.id}
                className={`sidebar-list-item ${selectedVisitor === visitor.id ? "selected" : ""}`}
                onClick={() => handleVisitorClick(visitor)}
              >
                {visitor.name}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="sidebar-list">
            {team.map((t) => (
              <li key={t.id} className="sidebar-list-item">
                {t.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
