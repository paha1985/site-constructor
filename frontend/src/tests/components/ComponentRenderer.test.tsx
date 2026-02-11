import { render, screen } from "@testing-library/react";
import { ComponentRenderer } from "../../components/canvas/ComponentRenderer";

describe("ComponentRenderer - основные сценарии", () => {
  test("рендерит заголовок", () => {
    const component = {
      type: "header",
      props: { text: "Привет мир" },
    };

    render(<ComponentRenderer component={component} />);

    expect(screen.getByText("Привет мир")).toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent("Привет мир");
  });

  test("рендерит параграф", () => {
    const component = {
      type: "paragraph",
      props: { text: "Текст параграфа" },
    };

    render(<ComponentRenderer component={component} />);

    expect(screen.getByText("Текст параграфа")).toBeInTheDocument();
  });

  test("рендерит кнопку", () => {
    const component = {
      type: "button",
      props: { text: "Кликни" },
    };

    render(<ComponentRenderer component={component} />);

    expect(screen.getByText("Кликни")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Кликни");
  });

  test("рендерит изображение", () => {
    const component = {
      type: "image",
      props: { alt: "Картинка" },
    };

    render(<ComponentRenderer component={component} />);

    expect(screen.getByAltText("Картинка")).toBeInTheDocument();
  });

  test("не рендерит неизвестный тип", () => {
    const component = {
      type: "unknown",
      props: { text: "Что-то" },
    };

    const { container } = render(<ComponentRenderer component={component} />);
    expect(container).toBeEmptyDOMElement();
  });
});
