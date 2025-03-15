import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { auth } from './config/firebase';
import { useContext, useState } from 'react';
import { AuthContext } from './auth/AuthWrapper';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/home" />;
  }

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate('/home');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  return (
    <>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></input>
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <button
        type="submit"
        onClick={() => {
          signIn();
          document.querySelector('#email').value = '';
          document.querySelector('#password').value = '';
        }}
      >
        Login
      </button>
    </>
  );
}
