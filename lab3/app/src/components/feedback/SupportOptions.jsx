// components/feedback/SupportOptions.js
import React from "react";
import "./SupportOptions.css";
import { useTranslation } from "react-i18next";

const SupportOptions = () => {
  const { t } = useTranslation();

  return (
    <section className="support-options">
      <div className="option-card">
        <div className="icon">
          <span>?</span>
        </div>
        <h2>{t("feedback__fAQs")}</h2>
        <p>{t("feedback__findQuickAnswers")}</p>
      </div>

      <div className="option-card">
        <a
          href="mailto:support@carparkgroup2.com?subject=CarPark Support Request&body=Hello Support Team,%0A%0AI need assistance with:%0A%0A"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="icon">
            <span>✉</span>
          </div>
          <h2>{t("feedback__emailSupport")}</h2>
          <p>{t("feedback__getInTouch")}</p>
        </a>
      </div>

      <div className="option-card">
        <div className="icon">
          <span>☎</span>
        </div>
        <h2>{t("feedback__phoneSupport")}</h2>
        <p>{t("feedback__speakDirectly")}</p>
      </div>
    </section>
  );
};

export default SupportOptions;
