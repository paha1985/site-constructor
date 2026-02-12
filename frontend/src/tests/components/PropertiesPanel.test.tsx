import { render, screen, fireEvent } from "@testing-library/react";
import { PropertiesPanel } from "../../components/proprties-panel/PropertiesPanel";

jest.mock("../../hooks/hooks", () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock("../../store/actions/constructorActions", () => ({
  updateComponent: jest.fn(),
  deleteComponent: jest.fn(),
  updateSiteName: jest.fn(),
  updateComponentsOrderAction: jest.fn(),
}));

const mockConfirm = jest.fn(() => true);
window.confirm = mockConfirm;

describe("PropertiesPanel", () => {
  const mockDispatch = jest.fn();
  const mockUseAppDispatch = require("../../hooks/hooks").useAppDispatch;
  const mockActions = require("../../store/actions/constructorActions");
  const mockOnUpdateSiteSettings = jest.fn();

  const defaultSite = {
    name: "Тестовый сайт",
    settings: {
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
    },
    components: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
  });

  test("не рендерится в режиме предпросмотра", () => {
    render(
      <PropertiesPanel
        siteId="test-123"
        site={defaultSite}
        selectedComponentId={null}
        isPreviewMode={true}
        onUpdateSiteSettings={mockOnUpdateSiteSettings}
      />,
    );

    expect(screen.queryByText("Компонент")).not.toBeInTheDocument();
    expect(screen.queryByText("Настройки сайта")).not.toBeInTheDocument();
  });

  describe("Настройки сайта (нет выбранного компонента)", () => {
    const renderSiteSettings = () => {
      return render(
        <PropertiesPanel
          siteId="test-123"
          site={defaultSite}
          selectedComponentId={null}
          isPreviewMode={false}
          onUpdateSiteSettings={mockOnUpdateSiteSettings}
        />,
      );
    };

    test("отображает настройки сайта", () => {
      renderSiteSettings();

      expect(screen.getByText("Настройки сайта")).toBeInTheDocument();
      expect(screen.getByText("Название сайта:")).toBeInTheDocument();
      expect(screen.getByText("Цвет фона:")).toBeInTheDocument();
      expect(screen.getByText("Шрифт:")).toBeInTheDocument();
      expect(screen.getByText("Макс. ширина:")).toBeInTheDocument();
    });

    test("обновляет название сайта", () => {
      renderSiteSettings();

      const nameInput = screen.getByDisplayValue("Тестовый сайт");
      fireEvent.change(nameInput, { target: { value: "Новый сайт" } });

      expect(mockActions.updateSiteName).toHaveBeenCalledWith(
        "test-123",
        "Новый сайт",
      );
      expect(mockDispatch).toHaveBeenCalled();
    });

    test("обновляет цвет фона", () => {
      renderSiteSettings();

      const colorInput = screen.getByDisplayValue("#ffffff");
      expect(colorInput).toHaveAttribute("type", "color");

      fireEvent.change(colorInput, { target: { value: "#000000" } });

      expect(mockOnUpdateSiteSettings).toHaveBeenCalledWith({
        ...defaultSite.settings,
        backgroundColor: "#000000",
      });
    });

    test("обновляет шрифт", () => {
      renderSiteSettings();

      const fontSelect = screen.getByDisplayValue("Arial");
      fireEvent.change(fontSelect, { target: { value: "Georgia, serif" } });

      expect(mockOnUpdateSiteSettings).toHaveBeenCalledWith({
        ...defaultSite.settings,
        fontFamily: "Georgia, serif",
      });
    });

    test("обновляет максимальную ширину", () => {
      renderSiteSettings();

      const widthInput = screen.getByDisplayValue("1200px");
      fireEvent.change(widthInput, { target: { value: "800px" } });

      expect(mockOnUpdateSiteSettings).toHaveBeenCalledWith({
        ...defaultSite.settings,
        maxWidth: "800px",
      });
    });
  });

  describe("Редактирование компонента Header", () => {
    const headerComponent = {
      id: "header-1",
      type: "header",
      props: {
        text: "Заголовок",
        level: 2,
        style: {
          fontSize: "24px",
          color: "#333333",
          textAlign: "left",
        },
      },
    };

    const siteWithHeader = {
      ...defaultSite,
      components: [headerComponent],
    };

    const renderHeaderEditor = () => {
      return render(
        <PropertiesPanel
          siteId="test-123"
          site={siteWithHeader}
          selectedComponentId="header-1"
          isPreviewMode={false}
          onUpdateSiteSettings={mockOnUpdateSiteSettings}
        />,
      );
    };

    test("отображает поля для заголовка (альтернативная версия)", () => {
      renderHeaderEditor();

      expect(screen.getByDisplayValue("Заголовок")).toBeInTheDocument();

      const selects = screen.getAllByRole("combobox");

      const levelSelect = selects[0];
      expect(levelSelect).toBeInTheDocument();

      expect(levelSelect).toHaveValue("2");

      expect(screen.getByDisplayValue("24px")).toBeInTheDocument();
      expect(screen.getByDisplayValue("#333333")).toBeInTheDocument();

      const alignSelect = selects[1];
      expect(alignSelect).toBeInTheDocument();
      expect(alignSelect).toHaveValue("left");
    });

    test("обновляет уровень заголовка (альтернативная версия)", () => {
      renderHeaderEditor();

      const selects = screen.getAllByRole("combobox");
      const levelSelect = selects[0];

      fireEvent.change(levelSelect, { target: { value: "3" } });

      expect(mockActions.updateComponent).toHaveBeenCalledWith(
        "test-123",
        "header-1",
        expect.objectContaining({ level: 3 }),
      );
    });

    test("обновляет выравнивание (альтернативная версия)", () => {
      renderHeaderEditor();

      const selects = screen.getAllByRole("combobox");
      const alignSelect = selects[1];

      fireEvent.change(alignSelect, { target: { value: "center" } });

      expect(mockActions.updateComponent).toHaveBeenCalledWith(
        "test-123",
        "header-1",
        expect.objectContaining({
          style: expect.objectContaining({ textAlign: "center" }),
        }),
      );
    });

    test("обновляет текст заголовка", () => {
      renderHeaderEditor();

      const textInput = screen.getByDisplayValue("Заголовок");
      fireEvent.change(textInput, { target: { value: "Новый заголовок" } });

      expect(mockActions.updateComponent).toHaveBeenCalledWith(
        "test-123",
        "header-1",
        expect.objectContaining({ text: "Новый заголовок" }),
      );
    });

    test("обновляет размер шрифта", () => {
      renderHeaderEditor();

      const fontSizeInput = screen.getByDisplayValue("24px");
      fireEvent.change(fontSizeInput, { target: { value: "32px" } });

      expect(mockActions.updateComponent).toHaveBeenCalledWith(
        "test-123",
        "header-1",
        expect.objectContaining({
          style: expect.objectContaining({ fontSize: "32px" }),
        }),
      );
    });

    test("обновляет цвет текста", () => {
      renderHeaderEditor();

      const colorInput = screen.getByDisplayValue("#333333");
      fireEvent.change(colorInput, { target: { value: "#ff0000" } });

      expect(mockActions.updateComponent).toHaveBeenCalledWith(
        "test-123",
        "header-1",
        expect.objectContaining({
          style: expect.objectContaining({ color: "#ff0000" }),
        }),
      );
    });
  });

  describe("Управление компонентами", () => {
    const component = {
      id: "comp-1",
      type: "header",
      props: {},
    };

    const siteWithComponent = {
      ...defaultSite,
      components: [component],
    };

    const renderComponentControls = () => {
      return render(
        <PropertiesPanel
          siteId="test-123"
          site={siteWithComponent}
          selectedComponentId="comp-1"
          isPreviewMode={false}
          onUpdateSiteSettings={mockOnUpdateSiteSettings}
        />,
      );
    };

    test("отображает кнопку удаления", () => {
      renderComponentControls();

      const deleteButton = screen.getByText("×");
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveAttribute("title", "Удалить");
    });
  });

  describe("Редактирование компонента Paragraph", () => {
    const paragraphComponent = {
      id: "p-1",
      type: "paragraph",
      props: {
        text: "Текст параграфа",
        style: {
          fontSize: "16px",
          color: "#666666",
          lineHeight: "1.5",
        },
      },
    };

    const siteWithParagraph = {
      ...defaultSite,
      components: [paragraphComponent],
    };

    const renderParagraphEditor = () => {
      return render(
        <PropertiesPanel
          siteId="test-123"
          site={siteWithParagraph}
          selectedComponentId="p-1"
          isPreviewMode={false}
          onUpdateSiteSettings={mockOnUpdateSiteSettings}
        />,
      );
    };

    test("отображает поля для параграфа", () => {
      renderParagraphEditor();

      expect(screen.getByDisplayValue("Текст параграфа")).toBeInTheDocument();
      expect(screen.getByDisplayValue("16px")).toBeInTheDocument();
      expect(screen.getByDisplayValue("#666666")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1.5")).toBeInTheDocument();
    });
  });

  describe("Редактирование компонента Button", () => {
    const buttonComponent = {
      id: "btn-1",
      type: "button",
      props: {
        text: "Кнопка",
        style: {
          backgroundColor: "#007bff",
          color: "#ffffff",
          borderRadius: "4px",
          padding: "10px 20px",
        },
      },
    };

    const siteWithButton = {
      ...defaultSite,
      components: [buttonComponent],
    };

    const renderButtonEditor = () => {
      return render(
        <PropertiesPanel
          siteId="test-123"
          site={siteWithButton}
          selectedComponentId="btn-1"
          isPreviewMode={false}
          onUpdateSiteSettings={mockOnUpdateSiteSettings}
        />,
      );
    };

    test("отображает поля для кнопки", () => {
      renderButtonEditor();

      expect(screen.getByDisplayValue("Кнопка")).toBeInTheDocument();
      expect(screen.getByDisplayValue("#007bff")).toBeInTheDocument();
      expect(screen.getByDisplayValue("#ffffff")).toBeInTheDocument();
      expect(screen.getByDisplayValue("4px")).toBeInTheDocument();
      expect(screen.getByDisplayValue("10px 20px")).toBeInTheDocument();
    });
  });

  describe("Редактирование компонента Image", () => {
    const imageComponent = {
      id: "img-1",
      type: "image",
      props: {
        src: "https://example.com/image.jpg",
        alt: "Тестовое изображение",
        style: {
          width: "300px",
          height: "200px",
        },
      },
    };

    const siteWithImage = {
      ...defaultSite,
      components: [imageComponent],
    };

    const renderImageEditor = () => {
      return render(
        <PropertiesPanel
          siteId="test-123"
          site={siteWithImage}
          selectedComponentId="img-1"
          isPreviewMode={false}
          onUpdateSiteSettings={mockOnUpdateSiteSettings}
        />,
      );
    };

    test("отображает поля для изображения", () => {
      renderImageEditor();

      expect(
        screen.getByDisplayValue("https://example.com/image.jpg"),
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Тестовое изображение"),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("300px")).toBeInTheDocument();
      expect(screen.getByDisplayValue("200px")).toBeInTheDocument();
    });
  });
});
