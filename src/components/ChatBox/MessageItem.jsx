import React, { useEffect, useRef, useState } from "react";

const MessageItem = ({
  msg,
  userId,
  onEdit,
  onDelete,
  onDeleteForEveryone,
  formatTime,
  setPreviewImage, // ✅ RECEIVE
}) => {
  const isSender = msg.sId === userId;
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`message-item ${isSender ? "s-msg" : "r-msg"}`}>
      
      {/* ✅ IMAGE MESSAGE */}
      {msg.imageSigned && (
        <img
          src={msg.imageSigned}
          className="chat-image"
          alt="sent"
          onClick={() => setPreviewImage(msg.imageSigned)} // ✅ PREVIEW
        />
      )}

      {/* ✅ TEXT MESSAGE */}
      {msg.text && <p className="msg">{msg.text}</p>}

      {/* META */}
      <div className="msg-meta">
        <span className="time">{formatTime(msg.createdAt)}</span>
        <span className="ellipsis" onClick={() => setShowActions(!showActions)}>
          ⋮
        </span>
      </div>

      {/* ACTIONS */}
      {showActions && (
        <div className="msg-actions" ref={menuRef}>
          {isSender && (
            <button onClick={() => onEdit(msg, msg.text)}>Edit</button>
          )}
          <button onClick={() => onDelete(msg)}>Delete for me</button>
          {isSender && (
            <button onClick={() => onDeleteForEveryone(msg)}>
              Delete for everyone
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
