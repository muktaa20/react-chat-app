import { initializeApp } from "firebase/app";
import { toast } from "react-toastify";
import {doc, getFirestore, setDoc} from 'firebase/firestore'
import {toast} from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBJZe4WH2ihSSWkxhfrqMZudLKN6RywYhY",
  authDomain: "chat-app-34f34.firebaseapp.com",
  projectId: "chat-app-34f34",
  storageBucket: "chat-app-34f34.firebasestorage.app",
  messagingSenderId: "194332116250",
  appId: "1:194332116250:web:05a0ff6c102fd03e2c18a3"
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

const signup = async (username, email,password) =>{
  try{
    const res = await createUserWithEmailAndPassword(auth , email, password);
    const user = res.user;
    await setDoc(doc(db,"users", user.uid),{
      id:user.uid,
      username:username.toLowerCase(),
      email,
      name:"",
      avatar:"",
      bio:"Hey, there i am using chat app",
      lastSeen:Date.now()
    })
    await setDoc(doc(db,"chats",user.uid),{
      chatData:[]
    })
  }
  catch(error){
console.error(error)
toast.error(error.code)
  };
  
}
export {signup}
