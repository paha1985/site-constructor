// src/__mocks__/react-router-dom.js
const React = require("react");

// Моки для react-router-dom
const Link = ({ to, children, ...props }) => {
  return React.createElement(
    "a",
    {
      href: to,
      ...props,
      "data-testid": `link-${to}`,
    },
    children,
  );
};

const useNavigate = jest.fn(() => jest.fn());
const useLocation = jest.fn(() => ({
  pathname: "/",
  search: "",
  hash: "",
  state: null,
}));
const useParams = jest.fn(() => ({}));
const useSearchParams = jest.fn(() => [new URLSearchParams(), jest.fn()]);

// Простые обертки для всех необходимых компонентов
const BrowserRouter = ({ children }) =>
  React.createElement("div", { "data-testid": "browser-router" }, children);

const MemoryRouter = ({ children }) =>
  React.createElement("div", { "data-testid": "memory-router" }, children);

const Routes = ({ children }) =>
  React.createElement("div", { "data-testid": "routes" }, children);

const Route = ({ element, path, children }) => element || children || null;

const Navigate = ({ to }) =>
  React.createElement("div", { "data-testid": `navigate-to-${to}` });

const Outlet = () => React.createElement("div", { "data-testid": "outlet" });

module.exports = {
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
};
