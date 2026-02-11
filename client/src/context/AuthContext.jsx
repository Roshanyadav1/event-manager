import { createContext, useState, useEffect } from "react";
import axios from "axios";

// 1. Create the Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Check Session on Load (Keep user logged in on refresh)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      // In a real app, you would verify this token with the backend here.
      // For speed, we will decode the basic state or just trust the token existence.
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  // 3. Login Action
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      
      // Save to LocalStorage (Session)
      localStorage.setItem("token", res.data.token);
      
      // Set Global Header for future requests
      axios.defaults.headers.common["x-auth-token"] = res.data.token;
      
      // Update State
      setUser({ token: res.data.token, role: res.data.role });
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, msg: err.response?.data?.msg || "Login Failed" };
    }
  };

  // 4. Logout Action
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};