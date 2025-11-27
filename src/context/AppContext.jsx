import { createContext, useState } from "react";
import { supabase } from "../config/supabase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
const navigate = useNavigate();
const [userData, setUserData] = useState(null);

// Load user profile from Supabase
const loadUserData = async (uid) => {
const { data, error } = await supabase
.from("users")
.select("*")
.eq("id", uid)
.single();

if (!error) {
  setUserData(data);
  navigate(data.avatar && data.name ? "/chat" : "/profile");
}

};

return (
<AppContext.Provider value={{ userData, setUserData, loadUserData }}>
{children}
</AppContext.Provider>
);
};

export default AppContextProvider;

// useEffect(() => {
//    if(userData){
//     const chatRef = doc(db,'chat',userData.id);
//     const unSub = onSnapshot(chatRef, async(res) =>{
//       const chatItems = res.data().chatsData;
//       const tempData = [];
//       for(const item of chatItems){
//          const userRef = doc(db,'user',item.rId);
//          const userSnap = await getDoc(userRef);
//          const userData = userSnap.data()
//          tempData.push({...item,userData})
//       }
//       setChatData(tempData.sort((a,b) => b.updatedAt - a.updatedAt))
//     })
//     return () => {
//       unSub()
//     }
//    }
// },[userData])

// const value = {
//    userData,setUserData
// }