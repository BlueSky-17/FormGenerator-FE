import React from 'react';
import HomePage from './pages/home/home.page';
import MyForms from './pages/home/MyForms';
import DetailForm from './pages/home/DetailForm';
import Form from './pages/viewer';
import SignInSide from './pages/SignIn';
import SignUp from './pages/SignUp';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
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

  // const token = getToken()
  // console.log(token.refreshToken)

  //const [token, setToken] = React.useState();
  // const token = getToken();

  // try {
  //   const token = getToken();
  //   if (!token) {
  //     return (
  //       <BrowserRouter>
  //         <SignInSide setToken={setToken} />
  //       </BrowserRouter>)
  //   }
  // }
  // catch (error) {
  //   sessionStorage.removeItem('token');
  // }

  // const token = getToken();

  // if (!token) {
  //   return (
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/" element={<SignInSide setToken={setToken} />} />
  //         <Route path="/signin" element={<SignInSide setToken={setToken} />} />
  //         <Route path="/home" element={<HomePage pageComponent={MyForms} />} />
  //       </Routes>
  //     </BrowserRouter>
  //   );
  // }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignInSide setToken={setToken} />} />
          <Route path="/" element={<SignInSide setToken={setToken} />} />
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
