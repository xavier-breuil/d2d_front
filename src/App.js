import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navbar.js';

import { RouterProvider } from 'react-router-dom';

import router from './components/router';

function App() {
  return (
    <div className="App">
      <NavBar />
      <RouterProvider router={router}>
      </RouterProvider>
    </div>
  );
}

export default App;
