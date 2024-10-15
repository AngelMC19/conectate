// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnjhoiqZ6nkthpxx2KWQiYiBrCXKWFPbs",
  authDomain: "conectate-7690c.firebaseapp.com",
  projectId: "conectate-7690c",
  storageBucket: "conectate-7690c.appspot.com",
  messagingSenderId: "207958253991",
  appId: "1:207958253991:web:d68094db3194c91f1bd682",
  measurementId: "G-E6ZEFMLPSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Inicializa Authentication
const auth = getAuth(app);
export { auth };