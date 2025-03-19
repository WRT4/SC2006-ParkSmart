import { useContext, useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { useNavigate, Navigate } from "react-router-dom";
import "../styles/HomePage.css";
import { AuthContext } from "../auth/AuthWrapper";
import axios from "axios";

function Home() {
  const [count, setCount] = useState(0);
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

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="logo">ParkSmart</div>
        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Services</a>
          <a href="#">Locations</a>
          <a href="#">Support</a>
          <button onClick={handleSignOut}>Sign Out</button>
        </nav>
      </header>
      
      {/* Welcome Section */}
      <section className="welcome">
        <div className="welcome-text">
          <h1>Welcome to ParkSmart</h1>
          <p>Manage your parking experience efficiently with our smart parking solutions.</p>
        </div>
        <div className="welcome-image">
          <img src="/assets/parking.jpg" alt="Parking Area" />
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="quick-access">
        <div className="access-card blue">
          <h3>My Profile</h3>
          <p>View and manage your account settings and preferences</p>
          <a href="/profile">Access &gt;</a>
        </div>
        <div className="access-card green">
          <h3>Carpark Location</h3>
          <p>Find and navigate to available parking spaces</p>
          <a href="/searchpage">Access &gt;</a>
        </div>
        <div className="access-card purple">
          <h3>Carpark Information</h3>
          <p>View real-time parking availability and rates</p>
          <a href="#">Access &gt;</a>
        </div>
        <div className="access-card yellow">
          <h3>Provide Feedback</h3>
          <p>Share your experience and help us improve</p>
          <a href="/support">Access &gt;</a>
        </div>
        <div className="access-card pink">
          <h3>Community Forum</h3>
          <p>Connect with other users and share insights</p>
          <a href="forum">Access &gt;</a>
        </div>
        <div className="access-card light-blue">
          <h3>FAQs & Support</h3>
          <p>Get help and find answers to common questions</p>
          <a href="support">Access &gt;</a>
        </div>
      </section>
    </div>
  );
}

export default Home;
