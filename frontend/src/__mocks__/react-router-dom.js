// __mocks__/react-router-dom.js
import React from "react";

export const Link = ({ to, children, ...props }) =>
  React.createElement("a", { href: to, ...props }, children);

export const useNavigate = () => jest.fn();
export const useLocation = () => ({ pathname: "/" });
export const BrowserRouter = ({ children }) =>
  React.createElement("div", {}, children);
export const Routes = ({ children }) =>
  React.createElement("div", {}, children);
export const Route = ({ element }) => element;
