import React, { useState } from "react";
import "./visitorprofile.css"; 

export default function VisitorProfile({ visitor }) {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    if (!visitor) {
        return <div className="visitor-profile">No visitor selected</div>;
    }

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    return (
        <div className="visitor-profile">
            <h2 className="visitor-heading">{visitor.name}'s Profile</h2>

            <div className="visitor-section">
                <label>Phone Number</label>
                <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Add phone number"
                    className="visitor-input"
                />
            </div>

            <div className="visitor-section">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Add email"
                    className="visitor-input"
                />
            </div>

            <div className="visitor-section">
                <label>Tags</label>
                <div className="tag-input-container">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        placeholder="Add tag"
                        className="tag-input"
                        onKeyDown={e => {
                            if (e.key === "Enter") handleAddTag();
                        }}
                    />
                    <button onClick={handleAddTag} className="tag-add-btn">
                        Add
                    </button>
                </div>
                <div className="tag-list">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="tag-item">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="visitor-info"><strong>IP Address:</strong> <div>{visitor.ip}</div></div>
            <div className="visitor-info"><strong>Location:</strong> <div>{visitor.location}</div></div>
            <div className="visitor-info"><strong>Browser:</strong> <div>{visitor.browser}</div></div>
            <div className="visitor-info"><strong>Platform:</strong> <div>{visitor.platform}</div></div>
        </div>
    );
}
