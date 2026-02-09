import { render, screen } from "@testing-library/react";
import { SigninForm } from "../../pages/signin/components/signin-form";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: null, pathname: "/login" }),
}));

jest.mock("../../store/actions/authActions", () => ({
  login: jest.fn(),
  clearError: jest.fn(),
}));

jest.mock("../../hooks/hooks", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => ({
    loading: false,
    error: null,
    isAuthenticated: false,
  }),
}));

jest.mock("../../pages/signin/components/signin-form.css", () => ({}));

const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe("SigninForm - базовые тесты", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("рендерит заголовок формы", () => {
    render(<SigninForm />);
    expect(screen.getByText("Вход в систему")).toBeInTheDocument();
  });

  test("рендерит поля ввода email и пароль", () => {
    render(<SigninForm />);
    const emailInput = screen.getByPlaceholderText("Введите ваш email");
    const passwordInput = screen.getByPlaceholderText("Введите ваш пароль");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
  });

  test("рендерит тексты лейблов", () => {
    render(<SigninForm />);
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Пароль:")).toBeInTheDocument();
  });

  test("рендерит кнопку отправки формы", () => {
    render(<SigninForm />);
    const submitButton = screen.getByRole("button", { name: "Войти" });

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).toBeDisabled();
  });

  test("рендерит ссылку на регистрацию", () => {
    render(<SigninForm />);

    expect(screen.getByText("Нет аккаунта?")).toBeInTheDocument();

    const registerLink = screen.getByText("Зарегистрироваться");
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");
  });
});
