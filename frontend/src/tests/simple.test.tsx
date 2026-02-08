import { render, screen } from "@testing-library/react";

test("рендерит текст", () => {
  render(<div>Тестовый текст</div>);
  expect(screen.getByText("Тестовый текст")).toBeInTheDocument();
});
