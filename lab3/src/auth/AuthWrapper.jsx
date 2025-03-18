import { createContext, useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoadingPage from "../pages/LoadingPage";
import { useNavigate, Navigate, Link } from "react-router-dom";

// Create context for user authentication
export const AuthContext = createContext();

export function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const auth = getAuth();

  //   const unsubscribe = onAuthStateChanged(auth, (newUser) => {
  //     setUser(newUser);
  //     setLoading(false); // Authentication check complete
  //   });

  //   return unsubscribe; // Cleanup on unmount
  // }, []);

  // if (loading) {
  //   return <LoadingPage></LoadingPage>;
  // }

  // Check if there's a valid token saved in localStorage to determine the authenticated user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // You can send the token to your backend to validate the session
      fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in request headers
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user); // Set user if the token is valid
            setLoading(false);
          } else {
            throw new Error("Invalid token!");
            // Handle token invalidation (e.g., redirect to login page)
            // localStorage.removeItem("token");
            // setUser(null);
            // navigate('/login');
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          localStorage.removeItem("token");
          setUser(null);
          // navigate("/login");
        });
    }
  }, []);

  if (loading) {
    return <LoadingPage></LoadingPage>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
