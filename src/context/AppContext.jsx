import { createContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null); // user row from users table
  const [chatData, setChatData] = useState([]); // array from chats.chatData for logged-in user
  const [messages, setMessages] = useState([]); // messages of currently selected conversation
  const [messagesId, setMessagesId] = useState(null); // id for selected conversation
  const [chatUser, setChatUser] = useState(null); // selected chat's other user info
  const [avatarCache, setAvatarCache] = useState({}); // cache for signed URLs

  const getSignedUrl = async (filePath) => {
  if (!filePath) return null;

  // Case 1 → full public URL: extract the actual storage path
  if (filePath.startsWith("http")) {
    const urlPart = filePath.split("/object/public/")[1];
    if (!urlPart) return null;
    filePath = urlPart; 
  }

  // Case 2 → path starts with "images/"
  filePath = filePath.replace(/^images\//, "");

  // Now filePath is clean
  const { data, error } = await supabase.storage
    .from("images")
    .createSignedUrl(filePath, 3600);

  if (error) {
    console.error("Signed URL Error:", error);
    return null;
  }

  return data.signedUrl;
};



  // load user's DB row by uid
  const loadUserData = async (uid) => {
    if (!uid) return;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", uid)
      .single();

    if (error) {
      console.error("loadUserData error:", error);
      return;
    }

    setUserData(data);
    // redirect logic: if profile incomplete -> profile else chat
    if (data?.avatar && data?.name) navigate("/chat");
    else navigate("/profile");
  };

    // 🔥 Load Supabase auth session on app start
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        await loadUserData(data.user.id);
      } else {
        navigate("/");
      }
    };

    getSession();

    // realtime listener for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setUserData(null);
        navigate("/");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);


  // load or create chats row for current user
  const loadChatsForUser = async () => {
    if (!userData?.id) {
      setChatData([]);
      return;
    }

    // Try to fetch row where chats.id = user's id
    const { data, error } = await supabase
      .from("chats")
      .select("id, chatData")
      .eq("id", userData.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // If there is an error other than "no rows", log it
      console.error("loadChatsForUser error:", error);
      setChatData([]);
      return;
    }

    if (!data) {
      // create an empty chats row for this user (id = user id)
      const insertRes = await supabase.from("chats").insert([
        {
          id: userData.id,
          chatData: [],
        },
      ]);
      if (insertRes.error) {
        console.error("create chats row error:", insertRes.error);
        setChatData([]);
        return;
      }
      setChatData([]);
      return;
    }

    // data.chatData should be an array
    setChatData(Array.isArray(data.chatData) ? data.chatData : []);
  };

  // subscribe to realtime changes on this user's chats row
  useEffect(() => {
    if (!userData?.id) return;

    loadChatsForUser();

    const channel = supabase
      .channel(`public:chats:id=eq.${userData.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats", filter: `id=eq.${userData.id}` },
        (payload) => {
          // payload contains .new.chatData
          const newRow = payload?.new;
          if (newRow) {
            setChatData(Array.isArray(newRow.chatData) ? newRow.chatData : []);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  // When messagesId changes: load messages from chatData
  useEffect(() => {
    if (!messagesId || !chatData) {
      setMessages([]);
      return;
    }

    const conv = chatData.find((c) => c.messagesId === messagesId);
    setMessages(conv?.messages ? [...conv.messages].reverse() : []);
  }, [messagesId, chatData]);

  // helper: write updated chatData for a given user (ownerId)
  const writeChatsRow = async (ownerId, newChatData) => {
    if (!ownerId) return { error: "ownerId required" };
    const { data, error } = await supabase
      .from("chats")
      .upsert([{ id: ownerId, chatData: newChatData }])
      .select()
      .single();
    if (error) console.error("writeChatsRow error:", error);
    return { data, error };
  };

  // send message (adds message to both users' chatData arrays)
  const sendMessage = async ({ toId, messagesId: mId, text = null, image = null }) => {
    if (!userData?.id || !toId || (!text && !image)) return;

    const createdAt = Date.now();
    const messageObj = { sId: userData.id, createdAt, ...(text ? { text } : {}), ...(image ? { image } : {}) };

    // Update sender's row: append message into the conversation object inside chatData
    const updateForUser = async (ownerId, otherId) => {
      // fetch current chats row
      const { data: row } = await supabase.from("chats").select("chatData").eq("id", ownerId).single();
      let arr = Array.isArray(row?.chatData) ? row.chatData : [];

      // find conversation entry by messagesId (mId) or by otherId
      let idx = arr.findIndex((c) => c.messagesId === mId || c.rId === otherId);
      if (idx === -1) {
        // create new conversation entry
        const newConv = {
          rId: otherId,
          messagesId: mId || `${ownerId}_${otherId}_${createdAt}`, // fallback id
          lastMessage: text ? text.slice(0, 200) : "Image",
          updatedAt: createdAt,
          messageSeen: ownerId === userData.id ? true : false,
          messages: [messageObj],
        };
        arr = [newConv, ...arr];
      } else {
        // append message to existing conv
        const conv = arr[idx];
        conv.messages = conv.messages ? [...conv.messages, messageObj] : [messageObj];
        conv.lastMessage = text ? text.slice(0, 200) : "Image";
        conv.updatedAt = createdAt;
        // if this owner is not the sender, mark as unseen
        if (ownerId !== userData.id) conv.messageSeen = false;
        arr[idx] = conv;
        // move to front
        arr = [conv, ...arr.filter((_, i) => i !== idx)];
      }

      // write back
      await writeChatsRow(ownerId, arr);
    };

    // Run updates for both users
    await Promise.all([updateForUser(userData.id, toId), updateForUser(toId, userData.id)]);
  };

  // upload image to supabase storage and return public signed url
  const uploadImage = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const path = `${userData?.id || "anon"}/${fileName}`;

    const { error: upErr } = await supabase.storage.from("images").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (upErr) {
      console.error("upload error:", upErr);
      return null;
    }

    const { data } = await supabase.storage.from("images").createSignedUrl(path, 60 * 60);
    return data?.signedUrl || null;
  };

  const value = {
    userData,
    setUserData,
    loadUserData,
    chatData,
    setChatData,
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    getSignedUrl,
    sendMessage,
    uploadImage,
    loadChatsForUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
