// components/feedback/FAQSection.js
import React, { useState } from 'react';
import './FAQSection.css';

// FAQ item component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <h3>{question}</h3>
        <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
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
      question: 'How do I reserve a parking spot?',
      answer: 'Simply open the CarPark Tracker app, enter your destination, choose your preferred parking spot, and complete the booking with your payment method.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, Apple Pay, Google Pay, and PayPal for your convenience.'
    },
    {
      id: 3,
      question: 'Can I cancel my reservation?',
      answer: 'Yes, you can cancel your reservation up to 1 hour before your scheduled parking time for a full refund.'
    }
  ];

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      
      {faqData.map(faq => (
        <FAQItem 
          key={faq.id} 
          question={faq.question} 
          answer={faq.answer} 
        />
      ))}
    </section>
  );
};

export default FAQSection;
