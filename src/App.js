import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navbar.js';
import LoginPage from './components/loginPage.js';
import { RouterProvider } from 'react-router-dom';

import router from './components/router';
import { getGoogleUserData } from './api/google_api';

function App() {
  const [googleUser, setGoogleUser] = useState();
  const [googleUserData, setGoogleUserData] = useState({});

  useEffect(() => {
    if (googleUser) {
      sessionStorage.setItem('googleAccessToken', googleUser.access_token);
      getGoogleUserData(googleUser.access_token)
        .then(res => {
          setGoogleUserData({mail: res.data.email, name: res.data.name});
        })
        .catch((err) => {
          console.log('error getting user data from google:' + err);
        })
        .then(() => {
          sessionStorage.setItem('djangoUser', 'test');
          window.location.reload(false);
        })
        .catch((err) => {
          console.log('error setting django user data:' + err);
        });
    }
  }
    ,[googleUser]
  )

  return (
    <div className="App">
      {sessionStorage.getItem('djangoUser') ? (
        <div>
          <NavBar />
          <RouterProvider router={router}>
          </RouterProvider>
        </div>
      ) : <LoginPage setUser={setGoogleUser} />}
    </div>
  );
}

export default App;
