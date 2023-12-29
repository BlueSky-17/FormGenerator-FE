import React from 'react';
import HomePage from './pages/home/home.page';
import MyForms from './pages/home/MyForms';
import DetailForm from './pages/home/DetailForm';
import Form from './pages/viewer';
import SignInSide from './pages/SignIn';
import SignUp from './pages/SignUp';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { error } from 'console';

  
function App() {
  function setToken(userToken: any) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
  }
  
  function getToken() {
    const tokenString = sessionStorage.getItem('token');
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
          <Route path="/signup" element={<SignUp setToken={setToken}/>} />
          <Route path="/signin" element={<SignInSide setToken={setToken} />} />
          <Route path="/profile"/>
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
              <HomePage>
                <DetailForm />
                {/* <DetailForm getToken={getToken} /> */}
              </HomePage>
            }
          />
          <Route path="/form/:formID/view" element={<Form />}
          />
          {/* <Route path="/signin" element={<SignInSide setToken={setToken} />} /> */}
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
