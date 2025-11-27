import { useEffect } from "react";
import { supabase } from "../../config/supabase";

const AuthCallback = () => {
  useEffect(() => {
    const handleConfirm = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("callback session:", data);

      window.location.href = "/";
    };

    handleConfirm();
  }, []);

  return <h2>Verifying email, please wait...</h2>;
};

export default AuthCallback;

