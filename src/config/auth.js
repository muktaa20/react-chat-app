import { toast } from "react-toastify";
import { supabase } from "./supabase";

// ---------------- SIGNUP ---------------- //
export const signup = async (username, email, password) => {
  const { data: exists } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (exists) {
    throw new Error("Email already exists!");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error("Signup failed");

  // INSERT IN USERS TABLE
  const { error: insertErr } = await supabase.from("users").insert([
    {
      id: user.id,
      username,
      email,
      name: "",
      avatar: "",
      bio: "Hey! I am using chat app.",
      lastSeen: Math.floor(Date.now() / 1000),
    },
  ]);

  if (insertErr) throw insertErr;

  return data;
};

// ---------------- LOGIN ---------------- //
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// ---------------- Reset Password ---------------- //
export const resetPass = async (email) => {
  if(!email){
    toast.error("Enter your email");
    return null
  }
  try {
    const userRef = collection(db,'users');
    const q = query(userRef,where("email","==",email))
    const querySnap = await getDoc(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth,email)
      toast.success("Reset email send")
    }
    else{
      toast.error("Email not exists")
    }
  } catch (error) {
    console.error(error)
    toast.error(error.message)
  }
}

// ------------------ LOGOUT ------------------ //
export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  window.location.href = "/";
};
