import { useContext, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { useNavigate, Navigate } from 'react-router-dom';
import './styles/HomePage.css';
import { AuthContext } from './auth/AuthWrapper';
import axios from 'axios';

function Home() {
  const [count, setCount] = useState(0);
  const { user, setUser } = useContext(AuthContext);  // Assuming AuthContext has setUser to update user state
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleSignOut = async () => {
    try {
      // Optional: Call the server to invalidate JWT if needed (if using cookies)
      await axios.post('http://localhost:5000/logout');  // Replace with your actual server logout URL
  
      // Clear local JWT (if stored in localStorage/sessionStorage)
      localStorage.removeItem('jwtToken');  // Or sessionStorage.removeItem('jwtToken')
  
      // Clear user context and redirect
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={handleSignOut}>
        Sign Out
      </button>
    </>
  );
}

export default Home;
