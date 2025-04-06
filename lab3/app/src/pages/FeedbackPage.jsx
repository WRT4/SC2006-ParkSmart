// FeedbackPage.jsx - Fix for the white gap
import React from "react";
import HeroSection from "../components/feedback/HeroSection";
import SupportOptions from "../components/feedback/SupportOptions";
import FAQSection from "../components/feedback/FAQSection";
import FeedbackForm from "../components/feedback/FeedbackForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FeedbackPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#1e293b]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SupportOptions />
        <FAQSection />
        <FeedbackForm />
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackPage;