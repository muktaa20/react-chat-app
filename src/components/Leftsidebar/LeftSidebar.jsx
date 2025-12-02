// import React, { useContext, useState } from 'react'
// import logo from "../../assets/logo.png";
// import menu_icon from "../../assets/menu_icon.png";
// import search_icon from "../../assets/search_icon.png";
// import profile_img from "../../assets/profile_richard.png"; 
// import './LeftSidebar.css'
// import { useNavigate } from 'react-router-dom';
// const LeftSidebar = () => {

//   const navigate = useNavigate();
//   const {userData} = useContext(AppContext)
//   const [user, setUser] = useState(null);
//   const [showSearch,setShowSearch] = useState(false);

//   const inputHandler = async (e) => {
//   const value = e.target.value.trim();
//   setSearchValue(value);

//   if (value === "") {
//     setUsers([]);
//     return;
//   }

//   const { data, error } = await supabase
//     .from("users")
//     .select("id, username")
//     .ilike("username", `%${value}%`);

//   if (error) {
//     console.log(error);
//     return;
//   }

//   setUsers(data);
// };


//   // const inputHandler = async (e) => {
//   //   try{
//   //          const input = e.target.value;
//   //        if(input){
//   //         setShowSearch(true);
//   //           const userRef = collection(db,'users');
//   //          const q = query(userRef, where('username',"==",input.toLowerCase()))
//   //          const querysnap = await getDocs(q);
//   //          if(!querysnap.empty && querysnap.docs[0].data().id !==userData.id){
//   //           // console.log(querysnap.docs[0].data());
//   //           setUser(querysnap.docs[0].data())
//   //          }
//   //          else{
//   //           setUser(null);
//   //          }
//   //        }
//   //        else{
//   //         setShowSearch(false)
//   //        }
//   //   } catch (error){

//   //   }
//   // }

//   return (
//     <div className='ls'>
//      <div className="ls-top">
//       <div className="ls-nav">
//         <img src={logo} className='logo' alt="" />
//         <div className="menu">
//            <img src={menu_icon} alt="" />
//            <div className="sub-menu">
//             <p onClick={() => navigate('/profile')}>Edit Profile</p>
//             <hr />
//             <p>Logout</p>
//            </div>
//         </div>
//       </div>
//       <div className="ls-search">
//         <img src={search_icon} alt="" />
//         <input onChange={inputHandler} type="text" placeholder='Search here..' />
//       </div>
//      </div>
//      <div className="ls-list">
//       {showSearch && user
//       ? <div className='friends add-user'>
//         <img src={user.avatar} alt=''/>
//         <p>{user.name}</p>
//       </div>
//       :Array(12).fill("").map((item,index)=>(
//        <div key={index} className="friends">
//         <img src={profile_img} alt="" />
//         <div>
//           <p>Mukta Suryavanshi</p>
//           <span>Hello how are you.</span>
//         </div>
//       </div>
//      ))

//       }
   
//      </div>
//     </div>
//   )
// }

// export default LeftSidebar

import React, { useContext, useState } from "react";
import logo from "../../assets/logo.png";
import menu_icon from "../../assets/menu_icon.png";
import search_icon from "../../assets/search_icon.png";
import profile_img from "../../assets/profile_richard.png";
import "./LeftSidebar.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../config/auth.js"; 
import { supabase } from "../../config/supabase.js";
import { AppContext } from "../../context/AppContext"; // ADD THIS
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  // const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState(null)
  // const [users, setUsers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // ------------------ SEARCH USERS ------------------ //
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
      .select("id, username, name, avatar")
      .ilike("username", `%${value}%`);

    if (error) {
      console.log(error);
      return;
    }

    // remove yourself from search
    const filtered = data.filter((u) => u.id !== userData?.id);

    setUsers(filtered);
  };

  const addChat = async () =>{
     const messagesRef = collection(db,"messages");
     const chatsRef = collection(db,"chats");
     try {
      const newMessagesRef = doc(messagesRef)

      await setDoc(newMessagesRef,{
        createAt:serverTimestamp(),
        messages:[]
      })

      await updateDoc(doc(chatsRef,user.id),{
        chatsData:arrayUnion({
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:userData.id,
          updateAt:Date.now(),
          messageSeen:true
        })
      })

      await updateDoc(doc(chatsRef,userData.id),{
        chatsData:arrayUnion({
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:user.id,
          updateAt:Date.now(),
          messageSeen:true
        })
      })
     } catch (error) {
      toast.error(error.message)
      console.error(error);
      
     }
  }

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
          />
        </div>
      </div>

      <div className="ls-list">
        {showSearch && users.length > 0
          ? users.map((user) => (
              <div onClick={addChat} key={user.id} className="friends add-user">
                <img src={user.avatar || profile_img} alt="" />
                <p>{user.username}</p>
              </div>
            ))
          : Array(10)
              .fill("")
              .map((_, index) => (
                <div key={index} className="friends">
                  <img src={profile_img} alt="" />
                  <div>
                    <p>mukta</p>
                    <span>Hey! How are you?</span>
                  </div>
                </div>
              ))}
      </div>
    </div>
  );
};

export default LeftSidebar;