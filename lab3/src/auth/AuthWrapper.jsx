import { createContext, useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoadingPage from "../pages/LoadingPage";

export const AuthContext = createContext();

export function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setLoading(false); // Authentication check complete
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  if (loading) {
    return <LoadingPage></LoadingPage>;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
