import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng); // Store selected language
  };

  return (
    <div>
      <h2>{i18n.t('change_language')}</h2>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('zh')}>中文 (Chinese)</button>
      <button onClick={() => changeLanguage('ms')}>Bahasa Melayu</button>
      <button onClick={() => changeLanguage('hi')}>हिन्दी (Hindi)</button>
    </div>
  );
};

export default LanguageSelector;

