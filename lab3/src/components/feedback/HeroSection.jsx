// components/feedback/HeroSection.js
import React, { useState } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchTerm);
  };

  return (
    <section className="hero-section">
      <h1>How can we help you?</h1>
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search for help articles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;