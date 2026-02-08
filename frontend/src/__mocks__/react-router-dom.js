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

// Экспортируем только моки, не пытаемся получить оригинальный модуль
module.exports = {
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  // Простые обертки для других компонентов
  BrowserRouter: ({ children }) =>
    React.createElement("div", { "data-testid": "browser-router" }, children),
  Routes: ({ children }) =>
    React.createElement("div", { "data-testid": "routes" }, children),
  Route: ({ element }) => element,
  Navigate: ({ to }) =>
    React.createElement("div", { "data-testid": `navigate-to-${to}` }),
  Outlet: () => React.createElement("div", { "data-testid": "outlet" }),
};
