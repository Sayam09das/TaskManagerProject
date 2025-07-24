import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GetStarted from './components/GetStarted/GetStarted';
import LoginPage from './components/LoginPage/Login';
import Signup from './components/Signup/Signup';
import Schedulo from './components/TaskMange/TaskManager'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path='/auth/login' element={<LoginPage />} />
        <Route path='/auth/register' element={<Signup />} />
        <Route path='/schedulo' element={<Schedulo />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
