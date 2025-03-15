import { useNavigate, Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from './auth/AuthWrapper';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Added state for username
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);  // Assuming you have a setUser method to update the user context

  if (user) {
    return <Navigate to="/home" />;
  }

  const signUp = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {  // Updated to the correct signup endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),  // Send username along with email and password
      });

      const data = await response.json();

      if (response.ok) {
        // Set user data (you can adjust this depending on your backend response)
        setUser(data.user);
        // Optionally, save the token in localStorage/sessionStorage if using JWT
        localStorage.setItem('token', data.token); // assuming the server returns a token
        navigate('/home');
      } else {
        console.error('Signup failed:', data.message);
        alert('Signup failed');
      }
    } catch (err) {
      console.log('Error during signup:', err);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);  // Handle username input change
        }}
      />
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);  // Handle email input change
        }}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);  // Handle password input change
        }}
      />
      <button
        type="submit"
        onClick={() => {
          signUp();  // Call the signUp function
          setUsername('');  // Reset the form fields after submission
          setEmail('');
          setPassword('');
        }}
      >
        Sign Up
      </button>
    </>
  );
}
