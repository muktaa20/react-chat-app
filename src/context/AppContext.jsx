import { createContext, useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messagesId, setMessagesId] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);

  // ---------------------- Signed URL ----------------------
  const getSignedUrl = async (filePath) => {
    if (!filePath) return null;

    if (filePath.startsWith("http")) {
      const urlPart = filePath.split("/object/public/")[1];
      if (!urlPart) return null;
      filePath = urlPart;
    }

    filePath = filePath.replace(/^images\//, "");

    const { data, error } = await supabase.storage
      .from("images")
      .createSignedUrl(filePath, 3600);

    if (error) {
      console.error("Signed URL Error:", error);
      return null;
    }

    return data.signedUrl;
  };

  // ---------------------- Load User ----------------------
  // const loadUserData = async (uid) => {
  //   if (!uid) return;

  //   const { data, error } = await supabase
  //     .from("users")
  //     .select("*")
  //     .eq("id", uid)
  //     .single();

  //   if (error) {
  //     console.error("loadUserData error:", error);
  //     return;
  //   }

  //   setUserData(data);

  //   if (data?.name && data?.avatar) navigate("/chat");
  //   else navigate("/profile");
  // };

  const loadUserData = async (uid) => {
  if (!uid) return;

  const { data, error } = await supabase
    .from("users")
    .select("id, username, name, avatar, bio, lastSeen")
    .eq("id", uid)
    .single();

  if (error) {
    console.error("loadUserData error:", error);
    return;
  }

  // convert lastSeen to number timestamp
  let fixedData = { ...data };
  if (data.lastSeen) {
    fixedData.lastSeen = new Date(data.lastSeen).getTime();
  }

  setUserData(fixedData);

  // redirect logic
  if (fixedData?.name && fixedData?.avatar) navigate("/chat");
  else navigate("/profile");
};


  // ---------------------- Auth Session ----------------------
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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          loadUserData(session.user.id);
        } else {
          setUserData(null);
          navigate("/");
        }
      }
    );

    // return () => listener.subscription.unsubscribe();
    return () => {
  listener?.subscription?.unsubscribe();
};

  }, []);

  // ---------------------- Load Chats ----------------------
  const loadChatsForUser = async () => {
    if (!userData?.id) return setChatData([]);

    const { data, error } = await supabase
      .from("chats")
      .select("id, chatData")
      .eq("id", userData.id)
      .single();

    // error codes allow "no row"
    if (error && error.code !== "PGRST116") {
      console.error("loadChatsForUser error:", error);
      return setChatData([]);
    }

    if (!data) {
      await supabase.from("chats").insert([
        {
          id: userData.id,
          chatData: [],
        },
      ]);
      return setChatData([]);
    }

    setChatData(Array.isArray(data.chatData) ? data.chatData : []);
  };

  // ---------------------- Realtime Chat Updates ----------------------
  useEffect(() => {
    if (!userData?.id) return;

    loadChatsForUser();

    const channel = supabase
      .channel(`public:chats:id=eq.${userData.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
          filter: `id=eq.${userData.id}`,
        },
        (payload) => {
          const newRow = payload?.new;
          if (newRow) {
            setChatData(
              Array.isArray(newRow.chatData) ? newRow.chatData : []
            );
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userData?.id]);

  // ---------------------- Load Messages When chat opened ----------------------
  useEffect(() => {
    if (!messagesId || !chatData) return setMessages([]);

    const conv = chatData.find((c) => c.messagesId === messagesId);
    setMessages(conv?.messages ? [...conv.messages].reverse() : []);
  }, [messagesId, chatData]);

  // ---------------------- Write Chats Row ----------------------
  const writeChatsRow = async (ownerId, newChatData) => {
    const { data, error } = await supabase
      .from("chats")
      .upsert([{ id: ownerId, chatData: newChatData }])
      .select()
      .single();

    if (error) console.error("writeChatsRow error:", error);
    return { data, error };
  };

  // ---------------------- Send Message ----------------------
  const sendMessage = async ({ toId, messagesId: mId, text = null, image = null }) => {
    if (!userData?.id || !toId || (!text && !image)) return;

    const createdAt = Date.now();
    const messageObj = {
      sId: userData.id,
      createdAt,
      ...(text ? { text } : {}),
      ...(image ? { image } : {}),
    };

    const updateForUser = async (ownerId, otherId) => {
      const { data: row } = await supabase
        .from("chats")
        .select("chatData")
        .eq("id", ownerId)
        .single();

      let arr = Array.isArray(row?.chatData) ? row.chatData : [];

      let idx = arr.findIndex(
        (c) => c.messagesId === mId || c.rId === otherId
      );

      if (idx === -1) {
        const newConv = {
          rId: otherId,
          messagesId: mId || `${ownerId}_${otherId}_${createdAt}`,
          lastMessage: text ? text.slice(0, 200) : "Image",
          updatedAt: createdAt,
          messageSeen: ownerId === userData.id,
          messages: [messageObj],
        };
        arr = [newConv, ...arr];
      } else {
        const conv = arr[idx];
        conv.messages = [...(conv.messages || []), messageObj];
        conv.lastMessage = text ? text.slice(0, 200) : "Image";
        conv.updatedAt = createdAt;
        if (ownerId !== userData.id) conv.messageSeen = false;

        arr[idx] = conv;
        arr = [conv, ...arr.filter((_, i) => i !== idx)];
      }

      await writeChatsRow(ownerId, arr);
    };

    await Promise.all([
      updateForUser(userData.id, toId),
      updateForUser(toId, userData.id),
    ]);
  };

  // ---------------------- Upload Image ----------------------
  // const uploadImage = async (file) => {
  //   if (!file) return null;

  //   const fileExt = file.name.split(".").pop();
  //   const fileName = `${Date.now()}.${fileExt}`;
  //   const path = `${userData?.id}/${fileName}`;

  //   const { error: upErr } = await supabase.storage
  //     .from("images")
  //     .upload(path, file);

  //   if (upErr) {
  //     console.error("upload error:", upErr);
  //     return null;
  //   }

  //   const { data } = await supabase.storage
  //     .from("images")
  //     .createSignedUrl(path, 3600);

  //   return data?.signedUrl || null;
  // };
  const uploadImage = async (file) => {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const path = `${userData?.id}/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("upload error:", error);
    return null;
  }

  return path;  // <-- Only path return
};



  // ---------------------- Values ----------------------
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
    chatVisible,
    setChatVisible,
    getSignedUrl,
    sendMessage,
    uploadImage,
    loadChatsForUser,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
