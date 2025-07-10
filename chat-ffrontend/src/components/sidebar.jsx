import React, { useEffect, useState } from "react";
import "./sidebar.css";
import socket from "../socket";

import { useDispatch, useSelector } from "react-redux";
import { addVisitor, selectVisitor } from "../store/visitorslice";

const team = [
  { id: 1, name: "Team Alpha" },
  { id: 2, name: "Team Beta" },
];

export default function Sidebar({ onSelectVisitor }) {
  const [activeTab, setActiveTab] = useState("visitors");
  const dispatch = useDispatch();

  const visitors = useSelector((state) => state.visitors.list);
  const selectedVisitorId = useSelector((state) => state.visitors.selectedId);
  const metadata = useSelector((state) => state.chats.visitorMetadata);

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleVisitorClick = (visitor) => {
    dispatch(selectVisitor(visitor.id));
    if (onSelectVisitor) onSelectVisitor(visitor);
  };

  useEffect(() => {
    socket.on("new_visitor", (visitor) => {
      dispatch(addVisitor(visitor));
    });

    return () => socket.off("new_visitor");
  }, [dispatch]);

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
                className={`sidebar-list-item ${
                  selectedVisitorId === visitor.id ? "selected" : ""
                }`}
                onClick={() => handleVisitorClick(visitor)}
              >
                <div className="visitor-entry">
                  <div className="visitor-name">
                    {visitor.name}
                    {metadata[visitor.id]?.unreadCount > 0 && (
                      <span className="unread-badge">
                        {metadata[visitor.id].unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="last-message">
                    {metadata[visitor.id]?.lastMessageSnippet || "No messages yet"}
                  </div>
                </div>
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
