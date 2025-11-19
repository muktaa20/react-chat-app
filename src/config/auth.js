import { supabase } from "./supabase";

export const signup = async (username, email, password) => {
  try {
    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user;

    // 2. Insert profile
    const { error: insertErr } = await supabase
      .from("users")
      .insert([
        {
          id: user.id,
          username: username.toLowerCase(),
          email,
          name: "",
          avatar: "",
          bio: "Hey, there I am using chat app",
          lastSeen: Date.now(),
        },
      ]);

    if (insertErr) throw insertErr;

    // 3. Create empty chat row
    const { error: chatErr } = await supabase
      .from("chats")
      .insert([
        {
          user_id: user.id,
          chatData: [],
        },
      ]);

    if (chatErr) throw chatErr;

    return { user };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
