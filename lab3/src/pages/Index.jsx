import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthWrapper";

export default function Index() {
  const { user, setUser } = useContext(AuthContext);
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
          return <Navigate to="/home" />;
        } else {
          // Handle token invalidation (e.g., redirect to login page)
          localStorage.removeItem("token");
          setUser(null);
          return <Navigate to="/login" />;
        }
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        setUser(null);
        return <Navigate to="/login" />;
      });

    // return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
  }
  return <Navigate to="/login" />;
}
