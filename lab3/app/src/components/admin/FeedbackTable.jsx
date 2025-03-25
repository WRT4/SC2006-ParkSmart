// components/admin/FeedbackTable.js
import React from 'react';
import './FeedbackTable.css';

const FeedbackTable = ({ feedbackData }) => {
  // Sort by most recent first
  const sortedData = [...feedbackData].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const truncateMessage = (message, maxLength = 100) => {
    if (!message) return '';
    return message.length > maxLength 
      ? `${message.substring(0, maxLength)}...` 
      : message;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="feedback-table-container">
      <h2>Recent Feedback</h2>
      
      {sortedData.length === 0 ? (
        <p>No feedback data available.</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <td>{formatDate(item.createdAt)}</td>
                <td>{item.name || 'N/A'}</td>
                <td>{item.subject || 'N/A'}</td>
                <td>{truncateMessage(item.message)}</td>
                <td>{item.rating}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbackTable;