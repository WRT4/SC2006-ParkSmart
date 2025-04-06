// pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import FeedbackStats from '../components/admin/FeedbackStats';
import FeedbackTable from '../components/admin/FeedbackTable';
import axios from "axios";
import '../styles/AdminDashboard.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      setLoading(true);
      try {
        // Request feedback data from the backend API using Axios
        const response = await axios.get('http://localhost:5000/api/feedbacks');
        console.log(response.data); // Debugging to verify response structure
        setFeedbackData(response.data || []); // Safeguard: default to empty array if response is invalid
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('An error occurred while fetching feedback data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchFeedbackData();
  }, []);
  
  // Safeguard against unexpected non-array values
  const totalCount = Array.isArray(feedbackData) ? feedbackData.length : 0;
  const avgRating = totalCount > 0
    ? (
        feedbackData.reduce((sum, item) => sum + (item.rating || 0), 0) / totalCount
      ).toFixed(1)
    : 0;


  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <section className="admin-section mx-auto max-w-6xl px-4 py-8">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-white">Feedback Dashboard</h1>
          
          {loading ? (
            <p className="text-center text-gray-700 dark:text-gray-300">Loading feedback data...</p>
          ) : error ? (
            <p className="error-message text-center text-red-600 dark:text-red-400">{error}</p>
          ) : (
            <>
              <FeedbackStats 
                totalCount={totalCount} 
                avgRating={avgRating} 
              />
              
              <FeedbackTable 
                feedbackData={feedbackData} 
              />
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;
