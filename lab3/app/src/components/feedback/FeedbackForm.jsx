// components/feedback/FeedbackForm.js
import React, { useState } from 'react';
import axios from "axios";
import './FeedbackForm.css';

const FeedbackForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: ''
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      
      // Create new feedback entry with ID and timestamp
      const newFeedback = {
        ...formData,
      };
      
      // Send feedback to server
      axios.post("http://localhost:5000/api/feedback", newFeedback, {
        headers: { "Content-Type": "application/json" },  // Set content type to JSON)
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      
      alert('Thank you for your feedback! We appreciate your input.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        rating: ''
      });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting your feedback. Please try again.');
    }
  };
  
  return (
    <section className="feedback-form-section">
      <h2>Send Us Your Feedback</h2>
      <p>We value your input! Please share your thoughts, suggestions, or concerns with us.</p>
      
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <select 
            id="subject" 
            name="subject" 
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select a subject</option>
            <option value="question">Question</option>
            <option value="suggestion">Suggestion</option>
            <option value="problem">Report a Problem</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea 
            id="message" 
            name="message" 
            rows="5" 
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>How would you rate our service? (1-5)</label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map(num => (
              <React.Fragment key={num}>
                <input 
                  type="radio" 
                  id={`rating-${num}`} 
                  name="rating" 
                  value={num}
                  checked={formData.rating === num.toString()}
                  onChange={handleChange}
                  required 
                />
                <label htmlFor={`rating-${num}`}>{num}</label>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <button type="submit" className="submit-btn">Submit Feedback</button>
      </form>
    </section>
  );
};

export default FeedbackForm;