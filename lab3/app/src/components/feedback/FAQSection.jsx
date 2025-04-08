// components/feedback/FAQSection.js
import React, { useState } from "react";
import "./FAQSection.css";

// FAQ item component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <h3>{question}</h3>
        <span className="toggle-icon">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

// Main FAQ Section component
const FAQSection = () => {
  // FAQ data
  const faqData = [
    {
      id: 1,
      question: "How frequently is the carpark availability data updated?",
      answer:
        "Availability is updated every minute, subject to the responsiveness and availability of the API.",
    },
    {
      id: 2,
      question:
        "Do you store user data, and why do you request location access?",
      answer:
        "We securely store user credentials using industry-standard encryption methods like bcrypt. We request location access solely to enhance user experience, allowing us to default to your current location when you access the search page. This location data is not stored.",
    },
    {
      id: 3,
      question:
        "Why does the carpark availability data sometimes return errors?",
      answer:
        "Not all carparks are included in the carpark availability API, particularly older ones, which may result in missing or incomplete availability data for those carparks.",
    },
  ];

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>

      {faqData.map((faq) => (
        <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
      ))}
    </section>
  );
};

export default FAQSection;
