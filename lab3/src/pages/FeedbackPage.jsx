// pages/FeedbackPage.js
import React from 'react';
import HeroSection from '../components/feedback/HeroSection';
import SupportOptions from '../components/feedback/SupportOptions';
import FAQSection from '../components/feedback/FAQSection';
import FeedbackForm from '../components/feedback/FeedbackForm';
// import './FeedbackPage.css';

const FeedbackPage = () => {
  return (
    <main>
      <HeroSection />
      <SupportOptions />
      <FAQSection />
      <FeedbackForm />
    </main>
  );
};

export default FeedbackPage;