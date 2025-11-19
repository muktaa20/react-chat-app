import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://knkjhkilkmurfxzrgnii.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtua2poa2lsa211cmZ4enJnbmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODgxMTAsImV4cCI6MjA3ODk2NDExMH0.kARO9E5JjfUe0zzWMlP4Pt02B5ftEil_t5ZumpQKiC4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);




// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://knkjhkilkmurfxzrgnii.supabase.co";
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtua2poa2lsa211cmZ4enJnbmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODgxMTAsImV4cCI6MjA3ODk2NDExMH0.kARO9E5JjfUe0zzWMlP4Pt02B5ftEil_t5ZumpQKiC4";

// export const supabase = createClient(supabaseUrl, supabaseKey);


// import { supabase } from "./supabaseClient";

// const signup = async (username, email, password) => {
//   try {
//     // 1. Sign up user using Supabase
//     const { data: authData, error: authError } = await supabase.auth.signUp({
//       email: email,
//       password: password,
//     });

//     if (authError) throw authError;

//     const user = authData.user;

//     // 2. Insert user data in "users" table
//     const { error: userError } = await supabase.from("users").insert([
//       {
//         id: user.id,
//         username: username.toLowerCase(),
//         email: email,
//         name: "",
//         avatar: "",
//         bio: "Hey, there I am using chat app",
//         lastSeen: Date.now(),
//       },
//     ]);

//     if (userError) throw userError;

//     // 3. Insert empty chat doc in "chats" table
//     const { error: chatError } = await supabase.from("chats").insert([
//       {
//         id: user.id,
//         chatData: [],
//       },
//     ]);

//     if (chatError) throw chatError;

//     console.log("Signup successful!");
//   } catch (error) {
//     console.error(error);
//   }
// };


