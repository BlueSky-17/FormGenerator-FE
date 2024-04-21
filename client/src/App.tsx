import React from 'react';
import HomePage from './pages/home/home.page';
import MyForms from './pages/home/MyForms';
import DetailForm from './pages/home/DetailForm';
import FormViewer from './pages/viewer';
import SignInSide from './pages/SignIn';
import SignUp from './pages/SignUp';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { error } from 'console';
import Profile from './pages/home/profile';
import History from './pages/home/history';
import HistoryDetail from './pages/home/history/detail';
import Error404 from './components/error-page/404';
import Error403 from './components/error-page/403';

function App() {
  function setToken(userToken: any) {
    localStorage.setItem('token', JSON.stringify(userToken));
  }

  function getToken() {
    const tokenString = localStorage.getItem('token');
    // if (tokenString) {
    //   const userToken = JSON.parse(tokenString);
    //   return userToken?.accessToken;
    // }
    try {
      const userToken = JSON.parse(tokenString as string);
      return userToken;
    }
    catch (error) {
      console.log(error);
    }
  }

  const token = getToken();

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          {!token ? (
            <Route
              path="*"
              element={<Navigate to="/signin" />}
            />
          ) : (<Route
            path="/"
            element={
              <HomePage>
                <MyForms />
                {/* <MyForms getToken={getToken} /> */}
              </HomePage>
            }
          />)}
          <Route path="/signup" element={<SignUp setToken={setToken} />} />
          <Route path="/signin" element={<SignInSide setToken={setToken} />} />
          <Route path="/profile" element={
            <HomePage>
              <Profile />
            </HomePage>
          } />
          <Route path="/history" element={
            <HomePage>
              <History />
            </HomePage>
          } />
          <Route path="/history/:id" element={
            <HomePage>
              <HistoryDetail />
            </HomePage>
          } />
          <Route
            path="/myforms"
            element={
              <HomePage>
                <MyForms />
                {/* <MyForms getToken={getToken} /> */}
              </HomePage>
            }
          />
          <Route
            path="/myForm"
            element={
              <HomePage>
                <MyForms />
                {/* <MyForms getToken={getToken} /> */}
              </HomePage>
            }
          />
          <Route
            path="/form/:formID"
            element={
                <DetailForm />
            }
          />
          <Route path="/form/:formID/view" element={<FormViewer />}
          />
          <Route path="*" element={<Error404 />} />
          {/* <Route element={<Error403 />} */}
          
          {/* <Route path="/signin" element={<SignInSide setToken={setToken} />} /> */}
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
