import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import SignUpPage from './SignUpPage';
import Home from './Home';

function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      setUser(user);
    }
  });
  if (user) {
    return <Home></Home>;
  }
  return <SignUpPage></SignUpPage>;
}

export default App;
