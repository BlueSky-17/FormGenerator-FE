import SignInSide from './pages/SignIn';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import './App.css';
import UserManage from './pages/home/user-manage';
import HomePage from './pages/home/home.page';

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
                <UserManage />
                {/* <MyForms getToken={getToken} /> */}
              </HomePage>
            }
          />)}
          <Route path="/signin" element={<SignInSide setToken={setToken} />} />
        </Routes>

      </BrowserRouter>
    </div>

  );
}

export default App;
