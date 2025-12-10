// import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   "https://knkjhkilkmurfxzrgnii.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtua2poa2lsa211cmZ4enJnbmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODgxMTAsImV4cCI6MjA3ODk2NDExMH0.kARO9E5JjfUe0zzWMlP4Pt02B5ftEil_t5ZumpQKiC4"
// );

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
