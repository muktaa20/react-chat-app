import { createContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {
const navigate = useNavigate
     const[userData, setUserData] = useState(null);
     const [chatData, setChatData] = useState(null)

    const loadUserData = async (uid) => {
        try{
            const userRef = doc(db, 'users',uid);
            const userSnap = await getDoc(useRef);
            const userData = userSnap.data()
            // console.log(userSnap);
            //  console.log(userData);
            setUserData(userData);
             if(userData.avatar && userData.name) {
                navigate('/chat')
             }            
             else{
                navigate('/profile')
             }
             await updateDoc(useRef,{
                lastSeen:Date.now()
             })
             setInterval(async() => {
                if (auth.chatUser) {
                    await updateDoc(useRef,{
                       lastSeen:Date.now() 
                    })
                }
             }, interval);
        } catch(error){

        }
    }

    const value = {
            userData,setUserData,
            chatData,setChatData,
            loadUserData
    }
    return(
        <AppContext.Provider value={value}>
               {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider
