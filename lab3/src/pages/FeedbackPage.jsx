// pages/FeedbackPage.js
import React from "react";
import HeroSection from "../components/feedback/HeroSection";
import SupportOptions from "../components/feedback/SupportOptions";
import FAQSection from "../components/feedback/FAQSection";
import FeedbackForm from "../components/feedback/FeedbackForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import './FeedbackPage.css';

const FeedbackPage = () => {
  return (
    <>
      {" "}
      <Header></Header>
      <main>
        <HeroSection />
        <SupportOptions />
        <FAQSection />
        <FeedbackForm />
      </main>
      <Footer></Footer>
    </>
  );
};

export default FeedbackPage;
