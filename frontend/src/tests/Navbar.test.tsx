import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

test("самый простой тест", () => {
  render(<div>Тестовый элемент</div>);
  expect(screen.getByText("Тестовый элемент")).toBeInTheDocument();
});

test("рендерит кнопку", () => {
  const Button = () => <button>Нажми меня</button>;
  render(<Button />);
  expect(screen.getByText("Нажми меня")).toBeInTheDocument();
});
