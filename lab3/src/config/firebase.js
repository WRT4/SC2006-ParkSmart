// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDmfZ7KstGUpn1mVJ463PBQ18TR8yU1lJQ',
  authDomain: 'sc2006-e42ec.firebaseapp.com',
  projectId: 'sc2006-e42ec',
  storageBucket: 'sc2006-e42ec.firebasestorage.app',
  messagingSenderId: '543190690782',
  appId: '1:543190690782:web:aed6e635633f6a3f1dcb4f',
  measurementId: 'G-QEKB9RG2HT',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
