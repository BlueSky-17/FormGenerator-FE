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

function setToken(userToken: any) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  // if (tokenString) {
  //   const userToken = JSON.parse(tokenString);
  //   return userToken?.accessToken;
  // }
  try{
    const userToken = JSON.parse(tokenString as string);
    return userToken?.accessToken;
  }
  catch(error){
    console.log(error);
  }
  return null;
}


function App() {
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

  const token = getToken();

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInSide setToken={setToken} />} />
          <Route path="/signin" element={<SignInSide setToken={setToken} />} />
          <Route path="/home" element={<HomePage pageComponent={MyForms} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route path="/" element={<HomePage pageComponent={MyForms} />} />
          <Route path="/home" element={<HomePage pageComponent={MyForms} />} />
          <Route
            path="/form/:formID"
            element={<HomePage pageComponent={DetailForm} />}
          />
          <Route path="/form/:formID/view" element={<Form />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignInSide setToken={setToken} />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
