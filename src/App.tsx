import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signin from './pages/signin/signin';

const App: React.FC = () => {
  return (
    <div>
      <Routes><Route path="/" element={<Signin />}></Route></Routes>
    </div>
  );
};

export default App;