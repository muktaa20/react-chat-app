import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup, login, resetPass} from "../../config/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (currState === "Sign up") {
        signup(userName, email, password);
        toast.success("Account created successfully! Please login.");
        // setCurrState("Login");
      } else {
         login(email, password);
        toast.success("Login successful!");
        // navigate("/chat");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login">
      <img className="logo" src={assets.logo_big} alt="" />

      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currState}</h2>

        {currState === "Sign up" && (
          <input
            className="form-input"
            placeholder="username"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        )}

        <input
          className="form-input"
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-input"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          {currState === "Sign up" ? "Create account" : "Login now"}
        </button>

        <div className="login-term">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="login-forgot">
          {currState === "Sign up" ? (
            <p className="login-toggle">
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>Login here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create an account{" "}
              <span onClick={() => setCurrState("Sign up")}>Click here</span>
            </p>
          )}

          {currState === "Login" ?  <p className="login-toggle">
             Forgot Password
              <span onClick={() => setCurrState("Sign up")}>Reset Password ?<span onClick={()=> resetPass(email)}> reset here</span></span> 
            </p>: null}
        </div>
      </form>
    </div>
  );
};

export default Login;
