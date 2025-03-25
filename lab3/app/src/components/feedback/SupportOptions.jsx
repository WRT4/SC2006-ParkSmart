// components/feedback/SupportOptions.js
import React from 'react';
import './SupportOptions.css';

const SupportOptions = () => {
  return (
    <section className="support-options">
      <div className="option-card">
        <div className="icon">
          <span>?</span>
        </div>
        <h2>FAQs</h2>
        <p>Find quick answers to common questions about parking and our service.</p>
      </div>
      
      <div className="option-card">
        <a 
          href="mailto:support@carparkgroup2.com?subject=CarPark Support Request&body=Hello Support Team,%0A%0AI need assistance with:%0A%0A" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="icon">
            <span>✉</span>
          </div>
          <h2>Email Support</h2>
          <p>Get in touch with our support team via email for detailed assistance.</p>
        </a>
      </div>
      
      <div className="option-card">
        <div className="icon">
          <span>☎</span>
        </div>
        <h2>Phone Support</h2>
        <p>Speak directly with our customer service representatives.</p>
      </div>
    </section>
  );
};

export default SupportOptions;