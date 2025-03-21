import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "../styles/HomePage.css";
import { AuthContext } from "../auth/AuthWrapper";
import axios from "axios";
import Header from "../components/Header";

function Home() {
  const { user, setUser } = useContext(AuthContext); // Assuming AuthContext has setUser to update user state
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleSignOut = async () => {
    try {
      // Optional: Call the server to invalidate JWT if needed (if using cookies)
      await axios.post("http://localhost:5000/logout"); // Replace with your actual server logout URL

      // Clear local JWT (if stored in localStorage/sessionStorage)
      localStorage.removeItem("token"); // Or sessionStorage.removeItem('jwtToken')

      // Clear user context and redirect
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return <Header></Header>;
}

export default Home;
