// import React, { useContext, useState, useEffect } from "react";
// import logo from "../../assets/logo.png";
// import menu_icon from "../../assets/menu_icon.png";
// import search_icon from "../../assets/search_icon.png";
// import profile_img from "../../assets/profile_richard.png";
// import "./LeftSidebar.css";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../../config/auth.js";
// import { supabase } from "../../config/supabase.js";
// import { AppContext } from "../../context/AppContext";
// import { toast } from "react-toastify";

// const LeftSidebar = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(AppContext);

//   const [users, setUsers] = useState([]);
//   const [chatList, setChatList] = useState([]); // persisted list
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchValue, setSearchValue] = useState("");

//   const getSignedUrl = async (filePath) => {
//     if (!filePath) return null;

//     try {
//       // Remove full URL prefix if user.avatar contains a public URL
//       let cleanPath = filePath;

//       // case 1: full supabase URL → keep only path after "/public/"
//       if (cleanPath.includes("/storage/v1/object/public/")) {
//         cleanPath = cleanPath.split("/storage/v1/object/public/")[1];
//       }

//       // case 2: ensure no bucket prefix duplication
//       cleanPath = cleanPath.replace(/^images\//, "");

//       const { data, error } = await supabase.storage
//         .from("images")
//         .createSignedUrl(cleanPath, 3600);

//       if (error) {
//         console.log("Signed URL Error:", error.message);
//         return null;
//       }

//       return data.signedUrl;
//     } catch (err) {
//       console.log("Signed URL Catch:", err);
//       return null;
//     }
//   };

//   // ----------------- Load saved chat list from Supabase -----------------
//   const loadChatList = async () => {
//     if (!userData?.id) return;

//     try {
//       // 1) get chat_user_ids saved for this user
//       const { data: rows, error: rowsErr } = await supabase
//         .from("chat_list")
//         .select("chat_user_id")
//         .eq("user_id", userData.id)
//         .order("created_at", { ascending: false });

//       if (rowsErr) {
//         console.log("chat_list fetch error:", rowsErr);
//         return;
//       }

//       const ids = rows.map((r) => r.chat_user_id);
//       if (ids.length === 0) {
//         setChatList([]);
//         return;
//       }

//       // 2) fetch user details for those ids
//       const { data: usersData, error: usersErr } = await supabase
//         .from("users")
//         .select("id, username, avatar")
//         .in("id", ids);

//       if (usersErr) {
//         console.log("users fetch error:", usersErr);
//         return;
//       }

//       // 3) convert avatars to signed urls
//       const parsed = await Promise.all(
//         usersData.map(async (u) => ({
//           id: u.id,
//           username: u.username,
//           avatar: u.avatar ? await getSignedUrl(u.avatar) : null,
//         }))
//       );

//       // keep original order as in ids (most recent first)
//       const ordered = ids
//         .map((id) => parsed.find((p) => p.id === id))
//         .filter(Boolean);

//       setChatList(ordered);
//     } catch (err) {
//       console.error("loadChatList catch:", err);
//     }
//   };

//   useEffect(() => {
//     loadChatList();
//   }, [userData]);

//   // ----------------- SEARCH USERS -----------------
//   const inputHandler = async (e) => {
//     const value = e.target.value.trim();
//     setSearchValue(value);

//     if (value === "") {
//       setShowSearch(false);
//       setUsers([]);
//       return;
//     }

//     setShowSearch(true);

//     const { data, error } = await supabase
//       .from("users")
//       .select("id, username, name, avatar")
//       .ilike("username", `%${value}%`);

//     if (error) {
//       console.log(error);
//       return;
//     }

//     const filtered = data.filter((u) => u.id !== userData?.id);

//     const usersWithImages = await Promise.all(
//       filtered.map(async (u) => ({
//         ...u,
//         avatar: u.avatar ? await getSignedUrl(u.avatar) : null,
//       }))
//     );

//     setUsers(usersWithImages);
//   };

//   // --------------- Add user to chat list (persist in Supabase) ---------------
//   // const addChat = async (user) => {
//   //   if (!user || !user.id || !userData?.id) return;

//   //   // prevent local duplicates
//   //   if (chatList.find((u) => u.id === user.id)) {
//   //     toast.info("User already in chat list");
//   //     // still clear search
//   //     setShowSearch(false);
//   //     setSearchValue("");
//   //     setUsers([]);
//   //     return;
//   //   }

//   //   try {
//   //     // insert into DB (if unique constraint exists this will error; we catch it)
//   //     const { error: insertErr } = await supabase.from("chat_list").insert([
//   //       {
//   //         user_id: userData.id,
//   //         chat_user_id: user.id,
//   //       },
//   //     ]);

//   //     if (insertErr) {
//   //       // if it's a uniqueness error, it's fine — still add locally
//   //       console.log("chat_list insert error (non-fatal):", insertErr.message);
//   //     }

//   //     // update local state immediately (most recent first)
//   //     setChatList((prev) => [user, ...prev]);

//   //     toast.success("User added to chat list!");

//   //     // clear search UI
//   //     setShowSearch(false);
//   //     setSearchValue("");
//   //     setUsers([]);
//   //   } catch (err) {
//   //     console.error("addChat catch:", err);
//   //     toast.error("Could not add user");
//   //   }
//   // };

//  const addChat = async (user) => {
//   if (!user || !user.id || !userData?.id) return;

//   if (chatList.find((u) => u.id === user.id)) {
//     toast.info("User already in chat list");
//     setShowSearch(false);
//     setSearchValue("");
//     setUsers([]);
//     return;
//   }

//   try {
//     const { error: insertErr } = await supabase.from("chat_list").insert([
//       {
//         user_id: userData.id,
//         chat_user_id: user.id,
//       },
//     ]);

//     if (insertErr) {
//       console.log("Insert failed:", insertErr.message);
//       toast.error("Failed to add chat: " + insertErr.message);
//       return;
//     }

//     setChatList((prev) => [user, ...prev]);
//     toast.success("User added to chat list!");

//     setShowSearch(false);
//     setSearchValue("");
//     setUsers([]);
//   } catch (err) {
//     console.error("addChat catch:", err);
//     toast.error("Could not add user");
//   }
// };

//   return (
//     <div className="ls">
//       <div className="ls-top">
//         <div className="ls-nav">
//           <img src={logo} className="logo" alt="" />

//           <div className="menu">
//             <img src={menu_icon} alt="" />

//             <div className="sub-menu">
//               <p onClick={() => navigate("/profile")}>Edit Profile</p>
//               <hr />
//               <p onClick={logout}>Logout</p>
//             </div>
//           </div>
//         </div>

//         <div className="ls-search">
//           <img src={search_icon} alt="" />
//           <input
//             onChange={inputHandler}
//             type="text"
//             placeholder="Search here.."
//             value={searchValue}
//           />
//         </div>
//       </div>

//       <div className="ls-list">
//         {showSearch && users.length > 0
//           ? users.map((user) => (
//               <div
//                 onClick={() => addChat(user)}
//                 key={user.id}
//                 className="friends add-user"
//               >
//                 <img src={user.avatar || profile_img} alt="" />
//                 <p>{user.username}</p>
//               </div>
//             ))
//           : // only show users you added; if none, show nothing (no dummy)
//             chatList.map((user) => (
//               <div key={user.id} className="friends">
//                 <img src={user.avatar || profile_img} alt="" />
//                 <div>
//                   <p>{user.username}</p>
//                   <span>Start chatting...</span>
//                 </div>
//               </div>
//             ))}
//       </div>
//     </div>
//   );
// };

// export default LeftSidebar;


import React, { useContext, useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import menu_icon from "../../assets/menu_icon.png";
import search_icon from "../../assets/search_icon.png";
import profile_img from "../../assets/profile_richard.png";
import "./LeftSidebar.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../config/auth.js";
import { supabase } from "../../config/supabase.js";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [users, setUsers] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // ----------------- Signed URL generator -----------------
  const getSignedUrl = async (filePath) => {
    if (!filePath) return null;

    try {
      let cleanPath = filePath;

      if (cleanPath.includes("/storage/v1/object/public/")) {
        cleanPath = cleanPath.split("/storage/v1/object/public/")[1];
      }

      cleanPath = cleanPath.replace(/^images\//, "");

      const { data, error } = await supabase.storage
        .from("images")
        .createSignedUrl(cleanPath, 3600);

      if (error) {
        console.log("Signed URL error:", error.message);
        return null;
      }

      return data.signedUrl;
    } catch (err) {
      console.log("Signed URL catch:", err);
      return null;
    }
  };

  // ----------------- LOAD CHAT LIST -----------------
  const loadChatList = async () => {
    if (!userData?.id) return;

    try {
      const { data: rows, error } = await supabase
        .from("chat_list")
        .select("chat_user_id")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("chat_list fetch error:", error.message);
        return;
      }

      const ids = rows.map((row) => row.chat_user_id);

      if (ids.length === 0) {
        setChatList([]);
        return;
      }

      const { data: usersData } = await supabase
        .from("users")
        .select("id, username, avatar")
        .in("id", ids);

      const parsed = await Promise.all(
        usersData.map(async (u) => ({
          id: u.id,
          username: u.username,
          avatar: u.avatar ? await getSignedUrl(u.avatar) : null,
        }))
      );

      const ordered = ids
        .map((id) => parsed.find((p) => p.id === id))
        .filter(Boolean);

      setChatList(ordered);
    } catch (err) {
      console.log("loadChatList catch:", err);
    }
  };

  useEffect(() => {
    loadChatList();
  }, [userData]);

  // ----------------- SEARCH USERS -----------------
  const inputHandler = async (e) => {
    const value = e.target.value.trim();
    setSearchValue(value);

    if (value === "") {
      setShowSearch(false);
      setUsers([]);
      return;
    }

    setShowSearch(true);

    const { data, error } = await supabase
      .from("users")
      .select("id, username, avatar")
      .ilike("username", `%${value}%`);

    if (error) {
      console.log(error.message);
      return;
    }

    const filtered = data.filter((u) => u.id !== userData?.id);

    const withImages = await Promise.all(
      filtered.map(async (u) => ({
        ...u,
        avatar: u.avatar ? await getSignedUrl(u.avatar) : null,
      }))
    );

    setUsers(withImages);
  };

  // ----------------- ADD CHAT -----------------
  const addChat = async (user) => {
    if (!user || !user.id || !userData?.id) return;

    if (chatList.find((u) => u.id === user.id)) {
      toast.info("Already in chat list");
      setShowSearch(false);
      setSearchValue("");
      setUsers([]);
      return;
    }

    try {
      const { error } = await supabase.from("chat_list").insert([
        {
          user_id: userData.id,
          chat_user_id: user.id,
        },
      ]);

      if (error) {
        toast.error("Insert failed: " + error.message);
        return;
      }

      setChatList((prev) => [user, ...prev]);
      toast.success("User added!");

      setShowSearch(false);
      setSearchValue("");
      setUsers([]);
    } catch (err) {
      console.log("addChat error:", err);
      toast.error("Something went wrong");
    }
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
            onChange={inputHandler}
            type="text"
            placeholder="Search here.."
            value={searchValue}
          />
        </div>
      </div>

      <div className="ls-list">
        {showSearch && users.length > 0 ? (
          users.map((user) => (
            <div
              onClick={() => addChat(user)}
              key={user.id}
              className="friends add-user"
            >
              <img src={user.avatar || profile_img} alt="" />
              <p>{user.username}</p>
            </div>
          ))
        ) : (
          chatList.map((user) => (
            <div key={user.id} className="friends">
              <img src={user.avatar || profile_img} alt="" />
              <div>
                <p>{user.username}</p>
                <span>Start chatting...</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
