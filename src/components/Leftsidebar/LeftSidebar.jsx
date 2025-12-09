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
  const { userData, setChatUser, setMessagesId, getSignedUrl } =
    useContext(AppContext);

  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [localChatList, setLocalChatList] = useState([]);

  const loadLocalChats = async () => {
    if (!userData?.id) return;

    try {
      const { data: chatRow } = await supabase
        .from("chats")
        .select("chatData")
        .eq("id", userData.id)
        .maybeSingle();

      const chatDataArr = Array.isArray(chatRow?.chatData)
        ? chatRow.chatData
        : [];

      const ids = chatDataArr.map((c) => c.rId).filter(Boolean);

      let usersMap = {};
      if (ids.length > 0) {
        const { data: users } = await supabase
          .from("users")
          .select("id, username, avatar, name")
          .in("id", ids);

        if (users) {
          for (const u of users) {
            usersMap[u.id] = {
              ...u,
              avatar: u.avatar ? await getSignedUrl(u.avatar) : null,
            };
          }
        }
      }

      const mapped = await Promise.all(
        chatDataArr.map(async (c) => {
          const u = usersMap[c.rId] || {};
          return {
            id: c.rId,
            messagesId: c.messagesId,
            lastMessage: c.lastMessage || "",
            updatedAt: c.updatedAt || null,
            messageSeen: c.messageSeen === undefined ? true : c.messageSeen,
            username: u.username || u.name || "Unknown",
            avatar: u.avatar || null,
            raw: c,
          };
        })
      );

      setLocalChatList(mapped);
    } catch (err) {
      console.error("loadLocalChats", err);
      toast.error("Failed to load chats");
    }
  };

  useEffect(() => {
    loadLocalChats();
  }, [userData]);

  const inputHandler = async (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value.trim()) {
      setShowSearch(false);
      setSearchUsers([]);
      return;
    }

    setShowSearch(true);

    try {
      const { data } = await supabase
        .from("users")
        .select("id, username, avatar, name")
        .ilike("username", `%${value}%`)
        .limit(10);

      const filtered = data.filter((u) => u.id !== userData?.id);

      const parsed = await Promise.all(
        filtered.map(async (u) => ({
          id: u.id,
          username: u.username || u.name || "Unknown",
          avatar: u.avatar ? await getSignedUrl(u.avatar) : null,
        }))
      );

      setSearchUsers(parsed);
    } catch (err) {
      toast.error("Search failed");
    }
  };

  const addOrOpenChat = async (otherUser) => {
    if (!userData?.id) return;

    try {
      const meId = userData.id;
      const otherId = otherUser.id;

      const [{ data: meRow }, { data: otherRow }] = await Promise.all([
        supabase.from("chats").select("chatData").eq("id", meId).maybeSingle(),
        supabase
          .from("chats")
          .select("chatData")
          .eq("id", otherId)
          .maybeSingle(),
      ]);

      const meArr = meRow?.chatData || [];
      const otherArr = otherRow?.chatData || [];

      let convMe = meArr.find((c) => c.rId === otherId);
      let convOther = otherArr.find((c) => c.rId === meId);

      const messagesId =
        convMe?.messagesId || convOther?.messagesId || `m_${Date.now()}`;

      if (!convMe) {
        convMe = {
          rId: otherId,
          messagesId,
          lastMessage: "",
          updatedAt: Date.now(),
          messageSeen: true,
          messages: [],
        };
      }

      if (!convOther) {
        convOther = {
          rId: meId,
          messagesId,
          lastMessage: "",
          updatedAt: Date.now(),
          messageSeen: false,
          messages: [],
        };
      }

      await supabase.from("chats").upsert([
        {
          id: meId,
          chatData: [convMe, ...meArr.filter((c) => c.rId !== otherId)],
        },
        {
          id: otherId,
          chatData: [convOther, ...otherArr.filter((c) => c.rId !== meId)],
        },
      ]);

      setMessagesId(messagesId);
      setChatUser({ userData: otherUser, rId: otherId });

      loadLocalChats();
    } catch (err) {
      toast.error("Failed to start chat");
    }
  };

  const openChat = async (item) => {
    setMessagesId(item.messagesId);
    setChatUser({
      userData: { id: item.id, username: item.username, avatar: item.avatar },
      rId: item.id,
    });

    try {
      if (!userData?.id) return;

      const { data: meRow } = await supabase
        .from("chats")
        .select("chatData")
        .eq("id", userData.id)
        .maybeSingle();

      const meArr = meRow?.chatData || [];
      const idx = meArr.findIndex((c) => c.messagesId === item.messagesId);

      if (idx >= 0) {
        meArr[idx].messageSeen = true;
        await supabase
          .from("chats")
          .upsert([{ id: userData.id, chatData: meArr }]);
        loadLocalChats();
      }
    } catch {}
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

      <div className="ls-list">
        {showSearch ? (
          <div className="search-results">
            {searchUsers.length === 0 && <p>No users found</p>}

            {searchUsers.map((u) => (
              <div
                key={u.id}
                className="friends"
                onClick={() => addOrOpenChat(u)}
              >
                <img src={u.avatar || profile_img} alt="" />
                <p>{u.username}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            {localChatList.map((u) => (
              <div key={u.id} className="friends" onClick={() => openChat(u)}>
                <img src={u.avatar || profile_img} alt="" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p style={{ margin: 0 }}>{u.username}</p>
                  <small
                    className={`last-msg ${u.messageSeen ? "" : "unread"}`}
                  >
                    {u.lastMessage}
                  </small>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
