import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Home } from "../../pages/home/home";
import { store } from "../../store";

describe("Home Page", () => {
  test("отображает основной заголовок", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText("Конструктор сайтов")).toBeInTheDocument();
  });

  test("отображает ссылку 'Мои сайты'", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>,
    );

    const link = screen.getByRole("link", { name: /мои сайты/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/sites");
  });

  test("отображает кнопку создания сайта", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>,
    );

    const button = screen.getByRole("button", {
      name: /создать новый сайт/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test("отображает все секции возможностей", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText("Возможности конструктора")).toBeInTheDocument();
    expect(
      screen.getByText("Начните создавать прямо сейчас"),
    ).toBeInTheDocument();
    expect(screen.getByText("Инструкция")).toBeInTheDocument();

    expect(screen.getByText("Визуальный редактор")).toBeInTheDocument();
    expect(screen.getByText("Быстрая разработка")).toBeInTheDocument();
    expect(screen.getByText("Адаптивный дизайн")).toBeInTheDocument();
    expect(screen.getByText("Автосохранение")).toBeInTheDocument();
  });
});
