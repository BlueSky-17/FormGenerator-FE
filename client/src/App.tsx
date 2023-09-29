import React from 'react';
import HomePage from './pages/home/home.page';
import MyForms from './pages/home/MyForms';
import DetailForm from './pages/home/DetailForm';
import Form from './pages/viewer';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<HomePage pageComponent={MyForms} />} />
        <Route path="/detail" element={<HomePage pageComponent={DetailForm} />} />
        <Route path="/form/view" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
