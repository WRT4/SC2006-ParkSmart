import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import Index from './Index';
import Forum from './Forum';
import PostDetail from './PostDetail';
import EditPost from './EditPost';

function App() {
  return (
    <div className="app-container">
      {/* Wrap everything with Router */}
      <Router>
        {/* Navigation Bar */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/forum">Forum</Link></li>
          </ul>
        </nav>

        <hr />

        {/* Define your routes here */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
