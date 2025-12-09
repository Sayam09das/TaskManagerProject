import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GetStarted from './components/GetStarted/GetStarted';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
              <GetStarted />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
