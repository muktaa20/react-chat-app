import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import menu_icon from "../../assets/menu_icon.png";
import search_icon from "../../assets/search_icon.png";
import profile_img from "../../assets/profile_richard.png";
import "./LeftSidebar.css";

import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { AppContext } from "../../context/AppContext";
import { logout } from "../../config/auth";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    setChatUser,
    setMessagesId,
    loadChatsForUser,
    getSignedUrl,
  } = useContext(AppContext);

  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [localChatList, setLocalChatList] = useState([]);

  // Convert chatData entries to enriched list (with username, avatar)
  useEffect(() => {
    const enrich = async () => {
      if (!chatData || chatData.length === 0) {
        setLocalChatList([]);
        return;
      }
      const ids = chatData.map((c) => c.rId).filter(Boolean);
      if (ids.length === 0) {
        setLocalChatList([]);
        return;
      }

      const { data: users } = await supabase
        .from("users")
        .select("id, username, avatar, name")
        .in("id", ids);
      const parsed = await Promise.all(
        users.map(async (u) => ({
          id: u.id,
          username: u.username || u.name || "Unknown",
          avatar: u.avatar ? await getSignedUrl(u.avatar) : null,
        }))
      );

      // align order same as chatData (most recent first already)
      const aligned = ids
        .map((id) => {
          const meta = parsed.find((p) => p.id === id) || {
            id,
            username: "Unknown",
            avatar: null,
          };
          const conv = chatData.find((c) => c.rId === id);
          return {
            ...meta,
            messagesId: conv?.messagesId,
            lastMessage: conv?.lastMessage,
            updatedAt: conv?.updatedAt,
            messageSeen: conv?.messageSeen,
            raw: conv,
          };
        })
        .filter(Boolean);

      setLocalChatList(aligned);
    };

    enrich();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData]);

  // Search users (exclude current user)
  const inputHandler = async (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value || value.trim() === "") {
      setShowSearch(false);
      setSearchUsers([]);
      return;
    }

    setShowSearch(true);
    const { data, error } = await supabase
      .from("users")
      .select("id, username, avatar, name")
      .ilike("username", `%${value}%`)
      .limit(10);

    if (error) {
      console.error(error);
      return;
    }

    const filtered = data.filter((u) => u.id !== userData?.id);
    const parsed = await Promise.all(
      filtered.map(async (u) => ({
        id: u.id,
        username: u.username || u.name || "Unknown",
        avatar: u.avatar ? await getSignedUrl(u.avatar) : null,
      }))
    );

    setSearchUsers(parsed);
  };

  // Add user to chat list (create conversation entry for both users)
  // const addChat = async (u) => {
  //   if (!userData?.id) return;
  //   try {
  //     // create a messagesId
  //     const messagesId = `${userData.id}_${u.id}_${Date.now()}`;

  //     // fetch current chats row for user and other user
  //     const { data: meRow } = await supabase.from("chats").select("chatData").eq("id", userData.id).single();
  //     const { data: otherRow } = await supabase.from("chats").select("chatData").eq("id", u.id).single();

  //     let meArr = Array.isArray(meRow?.chatData) ? meRow.chatData : [];
  //     let otherArr = Array.isArray(otherRow?.chatData) ? otherRow.chatData : [];

  //     // avoid duplicates
  //     if (meArr.find((c) => c.rId === u.id)) {
  //       toast.info("Already in chat list");
  //       setShowSearch(false);
  //       setSearchValue("");
  //       setSearchUsers([]);
  //       return;
  //     }

  //     const convForMe = {
  //       rId: u.id,
  //       messagesId,
  //       lastMessage: "",
  //       updatedAt: Date.now(),
  //       messageSeen: true,
  //       messages: [],
  //     };
  //     const convForOther = {
  //       rId: userData.id,
  //       messagesId,
  //       lastMessage: "",
  //       updatedAt: Date.now(),
  //       messageSeen: false,
  //       messages: [],
  //     };

  //     meArr = [convForMe, ...meArr];
  //     otherArr = [convForOther, ...otherArr];

  //     // upsert both rows
  //     await supabase.from("chats").upsert([{ id: userData.id, chatData: meArr }]);
  //     await supabase.from("chats").upsert([{ id: u.id, chatData: otherArr }]);

  //     toast.success("Chat added");
  //     setShowSearch(false);
  //     setSearchValue("");
  //     setSearchUsers([]);
  //     // reload chats
  //     loadChatsForUser();
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.message || "Failed to add chat");
  //   }
  // };

const addChat = async (otherUser) => {
  try {
    
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return;

    const userId = auth.user.id;

    // 1️⃣ Check if chat already exists
    const { data: existing, error: existingErr } = await supabase
      .from("userchats")
      .select("chat_id")
      .or(`and(user_id.eq.${userId},other_user_id.eq.${otherUser.id}),and(user_id.eq.${otherUser.id},other_user_id.eq.${userId})`)
      .maybeSingle();

    if (existing) {
      console.log("Chat already exists → opening it");
      // load chat page
      setMessagesId(existing.chat_id);
      setChatUser({ userData: otherUser, rId: otherUser.id });
      return;
    }

    // 2️⃣ Create chat row
    const { data: chat, error: chatErr } = await supabase
      .from("chats")
      .insert({})
      .select()
      .single();

    if (chatErr) throw chatErr;

    // 3️⃣ Link both users
    const { error: linkErr } = await supabase.from("userchats").insert([
      { user_id: userId, other_user_id: otherUser.id, chat_id: chat.id },
      { user_id: otherUser.id, other_user_id: userId, chat_id: chat.id }
    ]);

    if (linkErr) throw linkErr;

    toast.success("Chat created!");

    // open the chat UI
    setMessagesId(chat.id);
    setChatUser({ userData: otherUser, rId: otherUser.id });

  } catch (err) {
    console.error("addChat() ERROR:", err);
    toast.error("Failed to create chat");
  }
};






  // select a conversation
  const openChat = (item) => {
    // item contains id (other user id) and messagesId
    setMessagesId(item.messagesId);
    setChatUser({
      userData: { id: item.id, username: item.username, avatar: item.avatar },
      rId: item.id,
    });
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={logo} className="logo" alt="" />

          <div className="menu">
            <img src={menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={logout}>Logout</p>
            </div>
          </div>
        </div>

        <div className="ls-search">
          <img src={search_icon} alt="" />
          <input
            type="text"
            placeholder="Search here.."
            value={searchValue}
            onChange={inputHandler}
          />
        </div>
      </div>

      {/* ---------------- LIST ---------------- */}
      <div className="ls-list">
        {showSearch ? (
          <div className="search-results">
            {searchUsers.length === 0 && <p>No users found</p>}
            {searchUsers.map((u) => (
              <div key={u.id} className="friends" onClick={() => addChat(u)}>
                <img src={u.avatar || profile_img} alt="" />
                <p>{u.username}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            {localChatList.length === 0 && <p>No chats yet</p>}
            {localChatList.map((u) => (
              <div key={u.id} className="friends" onClick={() => openChat(u)}>
                <img src={u.avatar || profile_img} alt="" />
                <p>{u.username}</p>
                <small className="last-msg">{u.lastMessage}</small>
              </div>
            ))}
           

          </>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
