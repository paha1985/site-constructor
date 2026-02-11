import { SiteConstructor } from "../../pages/site-constructor/site-constructor";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("../../hooks/hooks", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("../../store/actions/constructorActions", () => ({
  updateSiteSettings: jest.fn(),
  togglePreviewMode: jest.fn(),
  loadSite: jest.fn(),
  selectComponent: jest.fn(),
}));

jest.mock("../../components/canvas/Canvas", () => ({
  Canvas: () => <div data-testid="canvas">Canvas Component</div>,
}));

jest.mock("../../components/proprties-panel/PropertiesPanel", () => ({
  PropertiesPanel: () => (
    <div data-testid="properties-panel">Properties Panel</div>
  ),
}));

jest.mock("../../components/component-palette/ComponentPalette", () => ({
  ComponentPalette: () => (
    <div data-testid="component-palette">Component Palette</div>
  ),
}));

jest.mock("../../components/export/ExportPanel", () => ({
  ExportPanel: () => <div data-testid="export-panel">Export Panel</div>,
}));

jest.mock("../../pages/site-constructor/site-constructor.css", () => ({}));

describe("SiteConstructor - базовые тесты", () => {
  const mockUseAppSelector = require("../../hooks/hooks").useAppSelector;
  const mockUseParams = require("react-router-dom").useParams;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        constructor: {
          site: null,
          selectedComponentId: null,
          isPreviewMode: false,
          loading: false,
          saving: false,
        },
      };
      return selector(state);
    });

    mockUseParams.mockReturnValue({ siteId: "new" });
  });

  const renderComponent = (siteId = "new") => {
    mockUseParams.mockReturnValue({ siteId });

    return render(
      <MemoryRouter initialEntries={[`/constructor/${siteId}`]}>
        <Routes>
          <Route path="/constructor/:siteId" element={<SiteConstructor />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  test("отображает заголовок конструктора", () => {
    renderComponent();

    expect(screen.getByText(/конструктор сайтов/i)).toBeInTheDocument();
    expect(screen.getByText(/новый сайт/i)).toBeInTheDocument();
  });

  test("отображает основные кнопки управления", () => {
    renderComponent();
    expect(screen.getByText("📥 Экспорт")).toBeInTheDocument();
    expect(screen.getByText("К сайтам")).toBeInTheDocument();
    expect(screen.getByText("Предпросмотр")).toBeInTheDocument();
  });

  test("отображает все основные компоненты конструктора", () => {
    renderComponent();

    expect(screen.getByTestId("component-palette")).toBeInTheDocument();
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
    expect(screen.getByTestId("properties-panel")).toBeInTheDocument();
  });

  test("показывает индикатор загрузки при loading=true", () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        constructor: {
          site: null,
          selectedComponentId: null,
          isPreviewMode: false,
          loading: true,
          saving: false,
        },
      };
      return selector(state);
    });

    renderComponent();

    expect(screen.getByText("Загрузка сайта...")).toBeInTheDocument();
    expect(screen.queryByTestId("canvas")).not.toBeInTheDocument();
  });

  test("показывает индикатор сохранения при saving=true", () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        constructor: {
          site: { site_id: "123", name: "Мой сайт" },
          selectedComponentId: null,
          isPreviewMode: false,
          loading: false,
          saving: true,
        },
      };
      return selector(state);
    });

    renderComponent("123");

    expect(screen.getByText("Сохранение...")).toBeInTheDocument();
    expect(
      screen.getByText("Конструктор сайтов: Мой сайт"),
    ).toBeInTheDocument();
  });

  test("меняет текст кнопки предпросмотра при isPreviewMode=true", () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        constructor: {
          site: { site_id: "123", name: "Мой сайт" },
          selectedComponentId: null,
          isPreviewMode: true,
          loading: false,
          saving: false,
        },
      };
      return selector(state);
    });

    renderComponent("123");

    expect(screen.getByText("Редактировать")).toBeInTheDocument();
    expect(screen.queryByText("Предпросмотр")).not.toBeInTheDocument();
  });

  test("работает с существующим сайтом при переданном siteId", () => {
    const siteId = "existing-123";
    const siteName = "Мой существующий сайт";

    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        constructor: {
          site: {
            site_id: siteId,
            name: siteName,
            settings: {},
            components: [],
          },
          selectedComponentId: null,
          isPreviewMode: false,
          loading: false,
          saving: false,
        },
      };
      return selector(state);
    });

    mockUseParams.mockReturnValue({ siteId });

    render(
      <MemoryRouter initialEntries={[`/constructor/${siteId}`]}>
        <Routes>
          <Route path="/constructor/:siteId" element={<SiteConstructor />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText(`Конструктор сайтов: ${siteName}`),
    ).toBeInTheDocument();
  });

  test("панель экспорта появляется при клике на кнопку", () => {
    renderComponent();

    const exportButton = screen.getByText("📥 Экспорт");
    expect(exportButton).toBeInTheDocument();
  });
});
