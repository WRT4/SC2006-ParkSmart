import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from './config/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    try {
      console.log(email, password);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
    }
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
          signUp();
          document.querySelector('#email').value = '';
          document.querySelector('#password').value = '';
        }}
      >
        Submit
      </button>
    </>
  );
}
