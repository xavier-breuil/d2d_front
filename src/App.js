import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navbar.js';

import { RouterProvider } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import router from './components/router';

function App() {

  const responseMessage = (response) => {
    console.log(response);
  };

  const errorMessage = (error) => {
      console.log(error);
  };

  return (
    <div className="App">
      <NavBar />
      <RouterProvider router={router}>
      </RouterProvider>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
}

export default App;
