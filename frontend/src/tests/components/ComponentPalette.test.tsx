import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ComponentPalette,
  componentTypes,
} from "../../components/component-palette/ComponentPalette";

jest.mock("../../hooks/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("../../store/actions/constructorActions", () => ({
  addComponent: jest.fn(),
}));

jest.mock("./component-palette.css", () => ({}), { virtual: true });

describe("ComponentPalette", () => {
  const mockUseAppSelector = require("../../hooks/hooks").useAppSelector;
  const mockUseAppDispatch = require("../../hooks/hooks").useAppDispatch;
  const mockDispatch = jest.fn();
  const mockAddComponent =
    require("../../store/actions/constructorActions").addComponent;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);

    mockUseAppSelector.mockReturnValue({
      isPreviewMode: false,
    });
  });

  test('рендерит заголовок "Компоненты"', () => {
    render(<ComponentPalette siteId="test-site" />);

    expect(screen.getByText("Компоненты")).toBeInTheDocument();
  });

  test("рендерит все компоненты из componentTypes", () => {
    render(<ComponentPalette siteId="test-site" />);

    componentTypes.forEach((component) => {
      expect(screen.getByText(component.name)).toBeInTheDocument();
      expect(screen.getByText(component.icon)).toBeInTheDocument();
    });
  });

  test("не рендерится в режиме предпросмотра", () => {
    mockUseAppSelector.mockReturnValue({
      isPreviewMode: true,
    });

    const { container } = render(<ComponentPalette siteId="test-site" />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("Компоненты")).not.toBeInTheDocument();
  });

  test("вызывает addComponent с siteId при клике на компонент", () => {
    render(<ComponentPalette siteId="test-site-123" />);

    const firstComponent = screen.getByText(componentTypes[0].name);
    fireEvent.click(firstComponent);

    expect(mockAddComponent).toHaveBeenCalledWith(
      "test-site-123",
      componentTypes[0].id,
    );
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('вызывает addComponent с "new" если siteId не передан', () => {
    render(<ComponentPalette siteId={undefined} />);

    const firstComponent = screen.getByText(componentTypes[0].name);
    fireEvent.click(firstComponent);

    expect(mockAddComponent).toHaveBeenCalledWith("new", componentTypes[0].id);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test("все компоненты кликабельны", () => {
    render(<ComponentPalette siteId="test-site" />);

    componentTypes.forEach((component) => {
      const element = screen.getByText(component.name);
      fireEvent.click(element);

      expect(mockAddComponent).toHaveBeenCalledWith("test-site", component.id);
    });

    expect(mockAddComponent).toHaveBeenCalledTimes(componentTypes.length);
  });
});
