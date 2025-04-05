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
      login__welcomeBack: "Welcome Back",
      login__loginToAccessAccount:
        "Login to access your account and continue your journey with us.",
      login__loginHeader: "Login",
      login__enterCredentials: "Enter your credentials to access your account.",
      login__emailAddress: "Email Address",
      login__enterEmail: "Enter your email",
      login__password: "Password",
      login__enterPassword: "Enter your password",
      login__rememberMe: "Remember me",
      login__loginButton: "Login",
      login__noAccount: "Don't have an account? ",
      login__signUp: "Sign up",
      login__incorrectCredentials:
        "Credentials are incorrect. Please try again.",
      login__checkFields:
        "Please check that you have filled up all fields correctly.",

      //signup page
      signup__joinParkingCommunity: "Join Our Parking Community",
      signup__connectEasyAccessBody:
        "Connect and have easy access to carparks in Singapore",
      signup__alreadyHaveAccount: "Already have an account? ",
      signup__signIn: "Sign in",
      signup__createAccountHeader: "Create Account",
      signup__fillInDetailsBody: "Fill in your details to get started.",
      signup__emailAddress: "Email Address",
      signup__enterEmail: "Enter your email",
      signup__carPlateNumber: "Car Plate Number",
      signup__enterCarPlate: "Enter plate number",
      signup__format: "Format: ABC-1234",
      signup__name: "Name",
      signup__enterName: "Enter Name",
      signup__username: "Username",
      signup__enterUsername: "Choose a username",
      signup__password: "Password",
      signup__createPassword: "Create a password",
      signup__p8Characters: "Password must be at least 8 characters long.",
      signup__pSpecialCharacter:
        "Password must include at least one special character.",
      signup__pOneNumber: "Password must contain at least one number.",
      signup__pOneUppercase:
        "Password must have at least one uppercase letter.",
      signup__agree: "I agree to the ",
      signup__termsOfService: "Terms of Service ",
      signup__and: "and ",
      signup__privacyPolicy: "Privacy Policy.",
      signup__createAccountButton: "Create Account",
      signup__error: "An error occurred. Please try again later.",
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
      login__welcomeBack: "欢迎回来",
      login__loginToAccessAccount: "登录以访问您的账户并继续您的旅程",
      login__loginHeader: "登录",
      login__enterCredentials: "输入您的凭据以访问您的账户",
      login__emailAddress: "电子邮件地址",
      login__enterEmail: "输入您的电子邮件",
      login__password: "密码",
      login__enterPassword: "输入密码",
      login__rememberMe: "记住我",
      login__loginButton: "登录",
      login__noAccount: "还没有账户？",
      login__signUp: "注册",
      login__incorrectCredentials: "凭证不正确。请重试。",
      login__checkFields: "请检查您是否已正确填写所有字段。",

      //signup page
      signup__joinParkingCommunity: "加入我们的停车社区",
      signup__connectEasyAccessBody: "连接并轻松访问新加坡的停车场",
      signup__alreadyHaveAccount: "已经有账户？",
      signup__signIn: "登录",
      signup__createAccountHeader: "创建账户",
      signup__fillInDetailsBody: "填写您的详细信息以开始",
      signup__emailAddress: "电子邮件地址",
      signup__enterEmail: "输入您的电子邮件",
      signup__carPlateNumber: "车牌号码",
      signup__enterCarPlate: "输入车牌号码",
      signup__format: "格式: ABC-1234",
      signup__name: "姓名",
      signup__enterName: "输入姓名",
      signup__username: "用户名",
      signup__enterUsername: "选择一个用户名",
      signup__password: "密码",
      signup__createPassword: "创建密码",
      signup__p8Characters: "密码必须至少8个字符长。",
      signup__pSpecialCharacter: "密码必须包含至少一个特殊字符。",
      signup__pOneNumber: "密码必须包含至少一个数字。",
      signup__pOneUppercase: "密码必须包含至少一个大写字母。",
      signup__agree: "我同意",
      signup__termsOfService: "服务条款",
      signup__and: "和",
      signup__privacyPolicy: "隐私政策。",
      signup__createAccountButton: "创建账户",
      signup__error: "发生错误。请稍后重试。",
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
      login__welcomeBack: "Selamat kembali",
      login__loginToAccessAccount:
        "Log masuk untuk mengakses akaun anda dan meneruskan perjalanan anda",
      login__loginHeader: "Log Masuk",
      login__enterCredentials:
        "Masukkan kelayakan anda untuk mengakses akaun anda.",
      login__emailAddress: "Alamat Emel",
      login__enterEmail: "Masukkan emel anda",
      login__password: "Kata Laluan",
      login__enterPassword: "Masukkan kata laluan",
      login__rememberMe: "Ingat saya",
      login__loginButton: "Log Masuk",
      login__noAccount: "Belum ada akaun? ",
      login__signUp: "Daftar",
      login__incorrectCredentials: "Kelayakan tidak betul. Sila cuba lagi.",
      login__checkFields:
        "Sila pastikan anda telah mengisi semua medan dengan betul.",

      //signup page
      signup__joinParkingCommunity: "Sertai komuniti parkir kami",
      signup__connectEasyAccessBody:
        "Berhubung dan dapatkan akses mudah ke tempat letak kereta di Singapura",
      signup__alreadyHaveAccount: "Sudah ada akaun? Log masuk",
      signup__signIn: "Log masuk",
      signup__createAccountHeader: "Cipta Akaun",
      signup__fillInDetailsBody: "Isi butiran anda untuk bermula",
      signup__emailAddress: "Alamat Emel",
      signup__enterEmail: "Masukkan emel anda",
      signup__carPlateNumber: "Nombor Plat Kereta",
      signup__enterCarPlate: "Masukkan Nombor Plat",
      signup__format: "Format: ABC-1234",
      signup__name: "Nama",
      signup__enterName: "Masukkan Nama",
      signup__username: "Nama Pengguna",
      signup__enterUsername: "Pilih nama pengguna",
      signup__password: "Kata Laluan",
      signup__createPassword: "Cipta kata laluan",
      signup__p8Characters:
        "Kata laluan mesti sekurang-kurangnya 8 aksara panjang.",
      signup__pSpecialCharacter:
        "Kata laluan mesti mengandungi sekurang-kurangnya satu aksara khas.",
      signup__pOneNumber:
        "Kata laluan mesti mengandungi sekurang-kurangnya satu nombor.",
      signup__pOneUppercase:
        "Kata laluan mesti mengandungi sekurang-kurangnya satu huruf besar.",
      signup__agree: "Saya bersetuju dengan ",
      signup__termsOfService: "Terma Perkhidmatan ",
      signup__and: "dan ",
      signup__privacyPolicy: "Dasar Privasi.",
      signup__createAccountButton: "Cipta Akaun",
      signup__error: "Ralat berlaku. Sila cuba lagi kemudian.",
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
      login__welcomeBack: "वापसी पर स्वागत है",
      login__loginToAccessAccount:
        "अपने खाते तक पहुंचने और अपनी यात्रा जारी रखने के लिए लॉग इन करें",
      login__loginHeader: "लॉगिन",
      login__enterCredentials:
        "अपने खाते तक पहुंचने के लिए अपनी साख दर्ज करें।",
      login__emailAddress: "ईमेल पता",
      login__enterEmail: "अपना ईमेल दर्ज करें",
      login__password: "पासवर्ड",
      login__enterPassword: "पासवर्ड दर्ज करें",
      login__rememberMe: "मुझे याद रखें",
      login__loginButton: "लॉगिन",
      login__noAccount: "खाता नहीं है? ",
      login__signUp: "साइन अप करें",
      login__incorrectCredentials:
        "क्रेडेंशियल गलत हैं. कृपया पुन: प्रयास करें.",
      login__checkFields:
        "कृपया जाँच लें कि आपने सभी फ़ील्ड सही ढंग से भरे हैं।.",

      //signup page
      signup__joinParkingCommunity: "हमारे पार्किंग समुदाय से जुड़ें",
      signup__connectEasyAccessBody:
        "कनेक्ट करें और सिंगापुर में कार पार्क तक आसान पहुंच प्राप्त करें",
      signup__alreadyHaveAccount: "पहले से खाता है? ",
      signup__signIn: "साइन इन करें",
      signup__createAccountHeader: "खाता बनाएं",
      signup__fillInDetailsBody: "शुरू करने के लिए अपनी जानकारी भरें",
      signup__emailAddress: "ईमेल पता",
      signup__enterEmail: "अपना ईमेल दर्ज करें",
      signup__carPlateNumber: "कार प्लेट नंबर",
      signup__enterCarPlate: "प्लेट नंबर दर्ज करें",
      signup__format: "प्रारूप: ABC-1234",
      signup__name: "नाम",
      signup__enterName: "नाम दर्ज करें",
      signup__username: "उपयोगकर्ता नाम",
      signup__enterUsername: "उपयोगकर्ता नाम चुनें",
      signup__password: "पासवर्ड",
      signup__createPassword: "पासवर्ड बनाएं",
      signup__p8Characters: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
      signup__pSpecialCharacter:
        "पासवर्ड में कम से कम एक विशेष वर्ण होना चाहिए।",
      signup__pOneNumber: "पासवर्ड में कम से कम एक संख्या होनी चाहिए।",
      signup__pOneUppercase: "पासवर्ड में कम से कम एक बड़ा अक्षर होना चाहिए।",
      signup__agree: "से सहमत हूं",
      signup__termsOfService: "सेवा की शर्तों ",
      signup__and: "और ",
      signup__privacyPolicy: "गोपनीयता नीति.",
      signup__createAccountButton: "खाता बनाएं",
      signup__error: "ஒரு பிழை ஏற்பட்டது. பிறகு முயற்சிக்கவும்.",
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
