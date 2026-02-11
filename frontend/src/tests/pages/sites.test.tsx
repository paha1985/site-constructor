import { render, screen } from "@testing-library/react";
import { Sites } from "../../pages/sites/sites";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
}));

jest.mock("../../store/actions/siteActions", () => ({
  fetchSitesAction: jest.fn(),
  deleteSiteAction: jest.fn(),
  setSearch: jest.fn(),
  setSort: jest.fn(),
  clearSites: jest.fn(),
  createSiteAction: jest.fn(),
}));

jest.mock("../../hooks/hooks", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("../../store", () => ({
  RootState: {},
}));

jest.mock("../../pages/sites/sites.css", () => ({}));

beforeAll(() => {
  Object.defineProperty(window, "confirm", {
    value: jest.fn(() => true),
    writable: true,
  });

  Object.defineProperty(window, "scrollTo", {
    value: jest.fn(),
    writable: true,
  });
});

describe("Sites Component - базовые тесты", () => {
  const mockUseAppSelector = require("../../hooks/hooks").useAppSelector;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        sites: {
          sites: [],
          loading: false,
          error: null,
          hasMore: true,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc" as const,
        },
      };
      return selector(state);
    });
  });

  test('отображает заголовок "Мои сайты"', () => {
    render(<Sites />);
    expect(screen.getByText("Мои сайты")).toBeInTheDocument();
  });

  test("отображает кнопку создания сайта", () => {
    render(<Sites />);
    const createButton = screen.getByText("+ Создать сайт");
    expect(createButton).toBeInTheDocument();
    expect(createButton.tagName).toBe("BUTTON");
  });

  test("отображает поле поиска", () => {
    render(<Sites />);

    const searchInput = screen.getByPlaceholderText(
      "Поиск по названию сайта...",
    );
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("type", "text");

    const searchButton = screen.getByText("Поиск");
    expect(searchButton).toBeInTheDocument();
  });

  test("отображает селект сортировки", () => {
    render(<Sites />);

    const sortSelect = screen.getByRole("combobox");
    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveValue("createdAt_desc");
  });

  test('показывает состояние "нет сайтов" когда массив пуст', () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        sites: {
          sites: [],
          loading: false,
          error: null,
          hasMore: false,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      };
      return selector(state);
    });

    render(<Sites />);

    expect(screen.getByText("У вас пока нет сайтов")).toBeInTheDocument();
    expect(
      screen.getByText("Создайте свой первый сайт с помощью конструктора"),
    ).toBeInTheDocument();

    const createFirstButton = screen.getByText("Создать первый сайт");
    expect(createFirstButton).toBeInTheDocument();
  });

  test("отображает список сайтов когда они есть", () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        sites: {
          sites: [
            {
              site_id: "1",
              name: "Мой первый сайт",
              description: "Описание сайта",
              status: "draft",
              createdAt: "2024-01-01T00:00:00.000Z",
              updatedAt: "2024-01-02T00:00:00.000Z",
              preview: null,
            },
            {
              site_id: "2",
              name: "Второй сайт",
              description: "Еще один сайт",
              status: "published",
              createdAt: "2024-01-03T00:00:00.000Z",
              updatedAt: "2024-01-04T00:00:00.000Z",
              preview: "https://example.com/preview.jpg",
            },
          ],
          loading: false,
          error: null,
          hasMore: true,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      };
      return selector(state);
    });

    render(<Sites />);

    expect(screen.getByText("Мой первый сайт")).toBeInTheDocument();
    expect(screen.getByText("Второй сайт")).toBeInTheDocument();

    const editButtons = screen.getAllByText("Редактировать");
    expect(editButtons.length).toBe(2);

    const deleteButtons = screen.getAllByText("Удалить");
    expect(deleteButtons.length).toBe(2);
  });

  test("отображает статусы сайтов", () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        sites: {
          sites: [
            {
              site_id: "1",
              name: "Черновик сайта",
              status: "draft",
              createdAt: "2024-01-01T00:00:00.000Z",
              updatedAt: "2024-01-01T00:00:00.000Z",
              preview: null,
            },
          ],
          loading: false,
          error: null,
          hasMore: false,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      };
      return selector(state);
    });

    render(<Sites />);

    expect(screen.getByText("Черновик")).toBeInTheDocument();
  });

  test("отображает ошибку если есть error в store", () => {
    const errorMessage = "Ошибка загрузки сайтов";

    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        sites: {
          sites: [],
          loading: false,
          error: errorMessage,
          hasMore: false,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      };
      return selector(state);
    });

    render(<Sites />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("показывает индикатор загрузки", () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        sites: {
          sites: [],
          loading: true,
          error: null,
          hasMore: false,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      };
      return selector(state);
    });

    render(<Sites />);

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  test('кнопка "Загрузить еще" отображается когда есть больше сайтов', () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        sites: {
          sites: [
            {
              site_id: "1",
              name: "Сайт",
              createdAt: "2024-01-01",
              updatedAt: "2024-01-01",
              status: "draft",
            },
          ],
          loading: false,
          error: null,
          hasMore: true,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      };
      return selector(state);
    });

    render(<Sites />);

    expect(screen.getByText("Загрузить еще")).toBeInTheDocument();
  });
});
