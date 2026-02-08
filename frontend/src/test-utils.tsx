import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./store";

// Создаем полный тип состояния
type AppState = ReturnType<typeof rootReducer>;

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: DeepPartial<AppState>;
  store?: ReturnType<typeof configureStore>;
  route?: string;
}

// Вспомогательный тип для глубокого partial
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export function setupStore(preloadedState?: DeepPartial<AppState>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any, // Кастинг для совместимости
  });

  return store;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    route = "/",
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  if (route) {
    window.history.pushState({}, "Test page", route);
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

export * from "@testing-library/react";
