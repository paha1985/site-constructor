import { render, screen, fireEvent } from "@testing-library/react";
import { NotFound } from "../../pages/not-found/not-found";
import { BrowserRouter } from "react-router-dom";

const mockBack = jest.fn();
Object.defineProperty(window, "history", {
  value: {
    back: mockBack,
  },
  writable: true,
});

describe("NotFound Component", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  test("отображает страницу 404", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Страница не найдена")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "На главную" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "К моим сайтам" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Вернуться назад" }),
    ).toBeInTheDocument();
  });

  test("ссылки имеют правильные атрибуты", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    const homeLink = screen.getByRole("link", { name: "На главную" });
    const sitesLink = screen.getByRole("link", { name: "К моим сайтам" });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(sitesLink).toHaveAttribute("href", "/sites");
  });

  test('кнопка "Вернуться назад" вызывает history.back', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    const backButton = screen.getByRole("button", { name: "Вернуться назад" });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
