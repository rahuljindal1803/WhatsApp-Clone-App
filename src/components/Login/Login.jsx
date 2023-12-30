import { Button } from "@mui/material";
import React, { useState } from "react";
import "./Login.css";
import { useSelector, useDispatch } from "react-redux";
import { setUser, selectUser } from "../features/userSlice";
import { db, auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { GoogleButton } from "react-google-button";

const Login = ({ onLogin }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const provider = new GoogleAuthProvider();
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        dispatch(setUser(user));
        onLogin(user);
      })
      .catch((error) => {
        console.log("Login Failed:", error);
      });
  };

  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/598px-WhatsApp_icon.png"
          alt="Whatsapp"
        />
        <div className="login_text">
          <h1>Sign in to WhatsApp</h1>
        </div>
        <GoogleButton className="GoogleButton" onClick={signIn}>
          Sign in with Google
        </GoogleButton>
        {/* {currentUser ? (
          <p>You are logged in as {currentUser.displayName}</p>
        ) : (
          <p>Please sign in to continue</p>
        )} */}
      </div>
    </div>
  );
};

export default Login;
