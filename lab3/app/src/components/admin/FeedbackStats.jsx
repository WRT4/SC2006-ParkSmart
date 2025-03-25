// components/admin/FeedbackStats.js
import React from 'react';
import './FeedbackStats.css';

const FeedbackStats = ({ totalCount, avgRating }) => {
  return (
    <div className="feedback-stats">
      <div className="stat-card">
        <h3>Total Feedback</h3>
        <p>{totalCount}</p>
      </div>
      <div className="stat-card">
        <h3>Average Rating</h3>
        <p>{avgRating}</p>
      </div>
    </div>
  );
};

export default FeedbackStats;