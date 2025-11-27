import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup, login } from "../../config/auth";
import { useNavigate } from "react-router-dom";

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
    await signup(userName, email, password);
    alert("Verification email sent! Please verify then login.");
    setCurrState("Login");
  } else {
    await login(email, password);
    navigate("/chat");
  }
} catch (error) {
  if (error.message.includes("already registered")) {
    alert("Email already registered! Redirecting to login…");
    setCurrState("Login");
    return;
  }
  alert(error.message);
}


};

return ( <div className="login"> <img className="logo" src={assets.logo_big} alt="" />


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
      autoComplete="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      className="form-input"
      type="password"
      placeholder="Password"
      autoComplete="current-password"
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
    </div>
  </form>
</div>


);
};

export default Login;



