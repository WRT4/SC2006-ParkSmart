import { useContext, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import './styles/HomePage.css';
import { AuthContext } from './auth/AuthWrapper';

function Home() {
  const [count, setCount] = useState(0);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" />;
  }

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
      <button
        onClick={() => {
          const auth = getAuth();
          signOut(auth)
            .then(() => {
              // Sign-out successful.
              navigate('/login');
            })
            .catch((error) => {
              // An error happened.
              console.log(error);
            });
        }}
      >
        Sign Out
      </button>
    </>
  );
}

export default Home;
