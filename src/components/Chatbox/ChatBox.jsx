import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import profile_img from "../../assets/profile_richard.png";
import green_dot from "../../assets/green_dot.png";
import help_icon from "../../assets/help_icon.png";
import gallery_icon from "../../assets/gallery_icon.png";
import send_button from "../../assets/send_button.png";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import logo from "../../assets/logo_icon.png";

const ChatBox = () => {
  const {
    userData,
    messagesId,
    chatUser,
    messages,
    setMessages,
    sendMessage,
    uploadImage,
    getSignedUrl,
  } = useContext(AppContext);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // When messages array updates via context, keep local messages (already reversed in AppContext)
  useEffect(() => {
    setMessages((prev) => messages || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const onSend = async () => {
    if ((!input || input.trim() === "") && !messagesId) return;
    if (!userData) return;

    try {
      setSending(true);
      await sendMessage({ toId: chatUser?.rId, messagesId: messagesId, text: input.trim() });
      setInput("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Send failed");
    } finally {
      setSending(false);
    }
  };

  const onSendImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      if (!url) throw new Error("Upload failed");
      await sendMessage({ toId: chatUser?.rId, messagesId, image: url });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Image send failed");
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
    let hour = d.getHours();
    const minute = d.getMinutes().toString().padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour = hour - 12;
    return `${hour}:${minute} ${ampm}`;
  };

  if (!chatUser) {
    return (
      <div className="chat-welcome">
        <img src={logo} alt="" />
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData.avatar || profile_img} alt="" />
        <p>
          {chatUser.userData.name || chatUser.userData.username}{" "}
          <img className="dot" src={green_dot} alt="" />
        </p>
        <img src={help_icon} className="help" alt="" />
      </div>

      <div className="chat-msg">
        {messages && messages.length === 0 && <p className="no-msg">No messages yet</p>}
        {messages &&
          messages.map((msg, index) => (
            <div key={index} className={msg.sId === userData?.id ? "s-msg" : "r-msg"}>
              {msg.image ? (
                <img src={msg.image} alt="sent" className="sent-image" />
              ) : (
                <p className="msg">{msg.text}</p>
              )}
              <div className="msg-meta">
                <img src={msg.sId === userData?.id ? userData?.avatar || profile_img : chatUser.userData.avatar || profile_img} alt="" />
                <p>{formatTime(msg.createdAt)}</p>
              </div>
            </div>
          ))}
      </div>

      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder="send a message" />
        <input onChange={onSendImage} type="file" id="image" accept="image/png,image/jpeg" hidden />
        <label htmlFor="image">
          <img src={gallery_icon} alt="" />
        </label>
        <img onClick={onSend} src={send_button} alt="" style={{ cursor: "pointer", opacity: sending ? 0.6 : 1 }} />
      </div>
    </div>
  );
};

export default ChatBox;

