import { createContext, useEffect, useState } from 'react';

// Create context for user authentication
export const AuthContext = createContext();

export function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);

  // Check if there's a valid token saved in localStorage to determine the authenticated user
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // You can send the token to your backend to validate the session
      fetch('http://localhost:5000/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in request headers
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            setUser(data.user); // Set user if the token is valid
          } else {
            // Handle token invalidation (e.g., redirect to login page)
            localStorage.removeItem('token');
            setUser(null);
          }
        })
        .catch(error => {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
