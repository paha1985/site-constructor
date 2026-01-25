import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signin from './pages/signin/signin';
import Signup from './pages/signup/signup';
import { NotFound } from './pages/not-found/not-found';
import { Home } from './pages/home/home';

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Signin />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

export default App;