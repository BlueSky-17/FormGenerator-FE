import React from 'react';
import HomePage from './pages/home/home.page';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
