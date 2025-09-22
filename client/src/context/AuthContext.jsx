// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

let decodedCode;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, email, role, ... }
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      try {
        console.log(token)
        const decoded = jwtDecode(token.toString());
        decodedCode = decoded;
        console.log("Decoded token:", decoded);
        setUser(decoded); // decoded should include role, email, id, etc.
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const userData = () => decodedCode;

export const useAuth = () => useContext(AuthContext);
