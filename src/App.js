import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navbar.js';
import LoginPage from './components/loginPage.js';
import { RouterProvider } from 'react-router-dom';

import axios from 'axios';
import router from './components/router';

function App() {
  const [googleUser, setGoogleUser] = useState();
  const [djangoUser, setDjangoUser] = useState();

  useEffect(() => {
    if (googleUser) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
            headers: {
                Authorization: `Bearer ${googleUser.access_token}`,
                Accept: 'application/json'
            }
        })
        .then(res => {
            setDjangoUser('test');
            // TODO: set django user
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
    ,[googleUser]
  )

  return (
    <div className="App">
      {djangoUser ? (
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
