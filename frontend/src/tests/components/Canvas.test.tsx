// Canvas.minimal.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { Canvas } from "../../components/canvas/Canvas";

jest.mock("../../components/canvas/ComponentRenderer", () => ({
  ComponentRenderer: ({ component }: any) => (
    <div data-testid={`component-${component.id}`}>{component.type}</div>
  ),
}));

describe("Canvas - основные тесты", () => {
  const mockOnSelect = jest.fn();

  test("отображает пустой холст", () => {
    render(
      <Canvas
        site={{ settings: {}, components: [] }}
        selectedComponentId={null}
        isPreviewMode={false}
        onSelectComponent={mockOnSelect}
      />,
    );

    expect(screen.getByText("Холст пуст")).toBeInTheDocument();
  });

  test("отображает компоненты", () => {
    const site = {
      settings: {},
      components: [
        { id: "1", type: "Заголовок" },
        { id: "2", type: "Текст" },
      ],
    };

    render(
      <Canvas
        site={site}
        selectedComponentId={null}
        isPreviewMode={false}
        onSelectComponent={mockOnSelect}
      />,
    );

    expect(screen.getByTestId("component-1")).toHaveTextContent("Заголовок");
    expect(screen.getByTestId("component-2")).toHaveTextContent("Текст");
  });

  test("клик по компоненту вызывает onSelectComponent", () => {
    const site = {
      settings: {},
      components: [{ id: "test-id", type: "Компонент" }],
    };

    render(
      <Canvas
        site={site}
        selectedComponentId={null}
        isPreviewMode={false}
        onSelectComponent={mockOnSelect}
      />,
    );

    fireEvent.click(screen.getByTestId("component-test-id"));
    expect(mockOnSelect).toHaveBeenCalledWith("test-id");
  });

  test("клик по холсту сбрасывает выбор", () => {
    const site = {
      settings: {},
      components: [],
    };

    render(
      <Canvas
        site={site}
        selectedComponentId="selected"
        isPreviewMode={false}
        onSelectComponent={mockOnSelect}
      />,
    );

    fireEvent.click(screen.getByText("Холст пуст"));
    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });
});
