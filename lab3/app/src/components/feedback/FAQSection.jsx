// components/feedback/FAQSection.js
import React, { useState } from "react";
import "./FAQSection.css";
import { useTranslation } from "react-i18next";

// FAQ item component
const FAQItem = ({ question, answer }) => {
  const { t } = useTranslation();

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
  const { t } = useTranslation();

  // FAQ data
  const faqData = [
    {
      id: 1,
      question: t("feedback__howFrequentDataUpdatedQ"),
      answer: t("feedback__howFrequentDataUpdatedA"),
    },
    {
      id: 2,
      question: t("feedback__storeUserDataAndLocationAccessQ"),
      answer: t("feedback__storeUserDataAndLocationAccessA"),
    },
    {
      id: 3,
      question: t("feedback__carparkAvailabilityErrorQ"),
      answer: t("feedback__carparkAvailabilityErrorA"),
    },
  ];

  return (
    <section className="faq-section">
      <h2>{t("feedback__frequentlyAskedQns")}</h2>

      {faqData.map((faq) => (
        <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
      ))}
    </section>
  );
};

export default FAQSection;
