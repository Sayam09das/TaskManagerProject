import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GetStarted from './components/GetStarted/GetStarted';
import LoginPage from './components/LoginPage/Login';
import Signup from './components/Signup/Signup';
import Schedulo from './components/TaskMange/TaskManager';
import PrivateRoute from './components/PrivateRoute';
import PublicRouteWithRedirect from './components/PublicRouteWithRedirect';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import OtpVerification from './components/OtpVerification/OtpVerification';
import ConfirmPassword from './components/ConfirmPassword/ConfirmPassword';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRouteWithRedirect>
              <GetStarted />
            </PublicRouteWithRedirect>
          }
        />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<Signup />} />
        <Route path='/auth/forgot-password' element={<ForgotPassword />} />
        <Route path='/auth/verify-otp' element={<OtpVerification />} />
        <Route path='/auth/reset-password' element={<ConfirmPassword />} />
        <Route
          path="/schedulo"
          element={
            <PrivateRoute>
              <Schedulo />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
