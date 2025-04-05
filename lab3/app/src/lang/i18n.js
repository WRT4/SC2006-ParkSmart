import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

const resources = {
  en: {
    translation: {
      // header
      header__home: "Home",
      header__search: "Search",
      header__forum: "Forum",
      header__support: "Support",
      header__profile: "Profile",
      header__signOut: "Sign out",
      header__login: "Login",

      // footer
      footer__aboutUs: "About us",
      footer__license: "License",
      footer__forum: "Forum",
      footer__contactUs: "Contact us",

      //login page
      welcomeBack: "Welcome Back",
      loginToAccessAccount:
        "Login to access your account and continue your journey with us.",
      loginHeader: "Login",
      enterCredentials: "Enter your credentials to access your account.",
      emailAddress: "Email Address",
      enterEmail: "Enter your email",
      password: "Password",
      enterPassword: "Enter your password",
      rememberMe: "Remember me",
      loginButton: "Login",
      noAccountSignUp: "Don't have an account? Sign up",
    },
  },
  zh: {
    translation: {
      // header
      header__home: "首页",
      header__search: "搜索",
      header__forum: "论坛",
      header__support: "支持",
      header__profile: "个人资料",
      header__signOut: "登出",
      header__login: "登录",

      // footer
      footer__aboutUs: "关于我们",
      footer__license: "许可证",
      footer__forum: "论坛",
      footer__contactUs: "联系我们",

      //login page
      welcomeBack: "欢迎回来",
      loginToAccessAccount: "登录以访问您的账户并继续您的旅程",
      loginHeader: "登录",
      enterCredentials: "输入您的凭据以访问您的账户",
      emailAddress: "电子邮件地址",
      enterEmail: "输入您的电子邮件",
      password: "密码",
      enterPassword: "输入密码",
      rememberMe: "记住我",
      loginButton: "登录",
      noAccountSignUp: "还没有账户？注册",
    },
  },
  ms: {
    translation: {
      // header
      header__home: "Laman Utama",
      header__search: "Cari",
      header__forum: "Forum",
      header__support: "Sokongan",
      header__profile: "Profil",
      header__signOut: "Log Keluar",
      header__login: "Log Masuk",

      // footer
      footer__aboutUs: "Tentang Kami",
      footer__license: "Lesen",
      footer__forum: "Lesen",
      footer__contactUs: "Hubungi Kami",

      //login page
      welcomeBack: "Selamat kembali",
      loginToAccessAccount:
        "Log masuk untuk mengakses akaun anda dan meneruskan perjalanan anda",
      loginHeader: "Log Masuk",
      enterCredentials: "Masukkan kelayakan anda untuk mengakses akaun anda.",
      emailAddress: "Alamat Emel",
      enterEmail: "Masukkan emel anda",
      password: "Kata Laluan",
      enterPassword: "Masukkan kata laluan",
      rememberMe: "Ingat saya",
      loginButton: "Log Masuk",
      noAccountSignUp: "Belum ada akaun? Daftar",
    },
  },

  hi: {
    translation: {
      // header
      header__home: "मुखपृष्ठ",
      header__search: "खोजें",
      header__forum: "फ़ोरम",
      header__support: "सहायता",
      header__profile: "प्रोफ़ाइल",
      header__signOut: "साइन आउट",
      header__login: "लॉगिन",

      // footer
      footer__aboutUs: "हमारे बारे में",
      footer__license: "लाइसेंस",
      footer__forum: "फ़ोरम",
      footer__contactUs: "संपर्क करें",

      //login page
      welcomeBack: "वापसी पर स्वागत है",
      loginToAccessAccount:
        "अपने खाते तक पहुंचने और अपनी यात्रा जारी रखने के लिए लॉग इन करें",
      loginHeader: "लॉगिन",
      enterCredentials: "अपने खाते तक पहुंचने के लिए अपनी साख दर्ज करें।",
      emailAddress: "ईमेल पता",
      enterEmail: "अपना ईमेल दर्ज करें",
      password: "पासवर्ड",
      enterPassword: "पासवर्ड दर्ज करें",
      rememberMe: "मुझे याद रखें",
      loginButton: "लॉगिन",
      noAccountSignUp: "खाता नहीं है? साइन अप करें",
    },
  },
};
i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
