import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from 'firebase/app';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const firebaseConfig = {
  apiKey: "AIzaSyBFmFynvFCXgHiq3feHOwwF2IY6dF3ZTRw",
  authDomain: "form-generator-16444.firebaseapp.com",
  projectId: "form-generator-16444",
  storageBucket: "form-generator-16444.appspot.com",
  messagingSenderId: "17922720641",
  appId: "1:17922720641:web:e99629a93bd6ef39c5de80",
  measurementId: "G-LKR3P94PQV"
};

const app = initializeApp(firebaseConfig);

root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
