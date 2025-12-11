import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import profile_img from "../../assets/profile_richard.png";
import green_dot from "../../assets/green_dot.png";
import help_icon from "../../assets/help_icon.png";
import arrow_icon from "../../assets/arrow_icon.png";
import gallery_icon from "../../assets/gallery_icon.png";
import send_button from "../../assets/send_button.png";
import logo from "../../assets/logo_icon.png";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { supabase } from "../../config/supabase";

const ChatBox = () => {
  const {
    userData,
    chatUser,
    messagesId,
    messages,
    setMessages,
    uploadImage,
    getSignedUrl,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  /* ------------------------------
       1. LOAD MESSAGES
  ------------------------------- */
  useEffect(() => {
    const loadMessages = async () => {
      if (!messagesId || !userData?.id) return;

      const { data } = await supabase
        .from("chats")
        .select("chatData")
        .eq("id", userData.id)
        .maybeSingle();

      const arr = data?.chatData || [];
      const conv = arr.find((c) => c.messagesId === messagesId);

      if (conv?.messages) {
        setMessages(conv.messages);
      }
    };

    loadMessages();
  }, [messagesId, userData]);

  /* ------------------------------
       2. SEND TEXT
  ------------------------------- */
  const onSend = async () => {
    if (!input.trim() || !messagesId) return;

    const msgObj = {
      sId: userData.id,
      text: input.trim(),
      image: null,
      imageSigned: null,
      createdAt: Date.now(),
    };

    try {
      setSending(true);
      await updateBothUsers(msgObj, input.trim());
      setInput("");
    } catch {
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  };

  /* ------------------------------
       3. SEND IMAGE
  ------------------------------- */
  const onSendImage = async (e) => {
  const file = e.target.files?.[0];
  console.log(file);
    
  if (!file) return;

  try {
    const filePath = await uploadImage(file);
    const signedUrl = await getSignedUrl(filePath);

    const msgObj = {
      sId: userData.id,
      text: "",
      image: filePath,
      imageSigned: signedUrl,
      createdAt: Date.now(),
    };

    await updateBothUsers(msgObj, "Image");
  } catch {
    toast.error("Image upload failed");
  }
};

  /* ------------------------------
       4. UPDATE BOTH USERS
  ------------------------------- */
  const updateBothUsers = async (msgObj, lastMsgDisplay) => {
    const meId = userData.id;
    const rId = chatUser.rId;

    const [{ data: meRow }, { data: otherRow }] = await Promise.all([
      supabase.from("chats").select("chatData").eq("id", meId).maybeSingle(),
      supabase.from("chats").select("chatData").eq("id", rId).maybeSingle(),
    ]);

    const meArr = meRow?.chatData || [];
    const otherArr = otherRow?.chatData || [];

    const meConv = meArr.find((c) => c.messagesId === messagesId);
    const otherConv = otherArr.find((c) => c.messagesId === messagesId);

    if (!meConv || !otherConv) return;

    meConv.messages.push(msgObj);
    otherConv.messages.push(msgObj);

    meConv.lastMessage = lastMsgDisplay;
    otherConv.lastMessage = lastMsgDisplay;

    meConv.updatedAt = Date.now();
    otherConv.updatedAt = Date.now();

    meConv.messageSeen = true;
    otherConv.messageSeen = false;

    const reorder = (arr, conv) => [
      conv,
      ...arr.filter((c) => c.messagesId !== conv.messagesId),
    ];

    await supabase.from("chats").upsert([
      { id: meId, chatData: reorder(meArr, meConv) },
      { id: rId, chatData: reorder(otherArr, otherConv) },
    ]);

    setMessages([...meConv.messages]);
  };

  /* ------------------------------
       5. FORMAT TIME
  ------------------------------- */
  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    return `${h}:${m} ${ampm}`;
  };

  /* ------------------------------
       WELCOME PAGE
  ------------------------------- */
  if (!chatUser) {
    return (
      <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
        <img src={logo} alt="" />
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  /* ------------------------------
       MAIN CHAT UI
  ------------------------------- */
  return (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      {/* HEADER */}
      <div className="chat-user">
        <img
          src={
            chatUser.userData.avatarSigned ||
            chatUser.userData.avatar ||
            profile_img
          }
          alt=""
        />

        <div className="chat-user-info">
          <p className="name">
            {chatUser.userData.name}
            {Date.now() - chatUser.userData.lastSeen <= 70000 && (
              <img src={green_dot} className="dot" alt="" />
            )}
          </p>
          <span className="username">{chatUser.userData.username}</span>
        </div>

        <img src={help_icon} className="help" alt="" />
        <img
          onClick={() => setChatVisible(false)}
          src={arrow_icon}
          className="arrow"
          alt=""
        />
      </div>

      {/* MESSAGES */}
      <div className="chat-msg">
        {(!messages || messages.length === 0) && <p className="no-msg"></p>}

        {messages.map((msg, i) => (
          <div key={i} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
            {msg.image ? (
              <img
                src={msg.imageSigned}
                className="sent-image"
                alt=""
                onClick={() => setPreviewImage(msg.imageSigned)}
              />
            ) : (
              // <img src={msg.imageSigned} className="sent-image" alt="" />
              <p className="msg">{msg.text}</p>
            )}

            <div className="msg-meta">
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatarSigned || profile_img
                    : chatUser.userData.avatarSigned ||
                      chatUser.userData.avatar ||
                      profile_img
                }
                alt=""
              />
              <p>{formatTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          type="text"
          placeholder="send a message"
        />

        <input
          type="file"
          id="image"
          hidden
          accept="image/*"
          onChange={onSendImage}
        />

        <label htmlFor="image">
          <img src={gallery_icon} alt="" />
        </label>

        <img
          onClick={onSend}
          src={send_button}
          style={{ cursor: "pointer", opacity: sending ? 0.6 : 1 }}
          alt=""
        />
      </div>
       {previewImage && (
  <div className="image-preview-overlay">
    <span className="close-btn" onClick={() => setPreviewImage(null)}>×</span>

    <img src={previewImage} alt="preview" />
  </div>
)}


    </div>
  );
};

export default ChatBox;
