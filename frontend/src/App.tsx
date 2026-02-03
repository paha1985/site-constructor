import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "./pages/signin/signin";
import Signup from "./pages/signup/signup";
import { NotFound } from "./pages/not-found/not-found";
import { Home } from "./pages/home/home";
import { Provider } from "react-redux";
import { store } from "./store";
import { PrivateRoute } from "./components/common/private-route";
import { Navbar } from "./components/navbar/navbar";
import { Sites } from "./pages/sites/sites";
import { Profile } from "./pages/profile/profile";
import { SiteConstructor } from "./pages/site-constructor/site-constructor";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <Routes>
          <Route element={<Navbar />}>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/constructor"
              element={
                <PrivateRoute>
                  <SiteConstructor />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/constructor/:siteId"
              element={
                <PrivateRoute>
                  <SiteConstructor />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/sites"
              element={
                <PrivateRoute>
                  <Sites />
                </PrivateRoute>
              }
            ></Route>
          </Route>
          <Route path="/login" element={<Signin />}></Route>
          <Route path="/register" element={<Signup />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </Provider>
  );
};

export default App;
