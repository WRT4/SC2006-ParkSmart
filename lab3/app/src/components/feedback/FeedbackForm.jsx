// components/feedback/FeedbackForm.js
import React, { useState } from "react";
import axios from "axios";
import "./FeedbackForm.css";
import { useTranslation } from "react-i18next";

const FeedbackForm = () => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    rating: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      axios
        .post("http://localhost:5000/api/feedback", newFeedback, {
          headers: { "Content-Type": "application/json" }, // Set content type to JSON)
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      alert("Thank you for your feedback! We appreciate your input.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        rating: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while submitting your feedback. Please try again.",
      );
    }
  };

  return (
    <section className="feedback-form-section">
      <h2>{t("feedback__sendUsFeedback")}</h2>
      <p>{t("feedback__weValueInput")}</p>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">{t("feedback__name")}</label>
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
          <label htmlFor="email">{t("feedback__email")}</label>
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
          <label htmlFor="subject">{t("feedback__selectSubject")}</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">{t("feedback__selectSubject")}</option>
            <option value="question">{t("feedback__question")}</option>
            <option value="suggestion">{t("feedback__suggestion")}</option>
            <option value="problem">{t("feedback__problem")}</option>
            <option value="other">{t("feedback__other")}</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">{t("feedback__message")}</label>
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
          <label>{t("feedback__rateService")}</label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((num) => (
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

        <button type="submit" className="submit-btn">
          {t("feedback__submitFeedbackButton")}
        </button>
      </form>
    </section>
  );
};

export default FeedbackForm;
