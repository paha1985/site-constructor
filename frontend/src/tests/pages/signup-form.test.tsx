import { SignupForm } from "../../pages/signup/components/signup-form";
import { render, screen } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: null, pathname: "/register" }),
}));

jest.mock("../../store/actions/authActions", () => ({
  register: jest.fn(),
}));

jest.mock("../../hooks/hooks", () => ({
  useAppDispatch: () => jest.fn(),
}));

jest.mock("../../pages/signup/components/signup-form.css", () => ({}));

describe("SignupForm - базовые тесты", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("отображает все поля формы регистрации", () => {
    render(<SignupForm />);

    expect(screen.getByPlaceholderText("Введите ваше имя")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Введите вашу фамилию"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Введите ваш email"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Введите ваш пароль"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Повторите пароль")).toBeInTheDocument();
  });

  test("отображает все лейблы полей", () => {
    render(<SignupForm />);

    expect(screen.getByText("Имя:")).toBeInTheDocument();
    expect(screen.getByText("Фамилия:")).toBeInTheDocument();
    expect(screen.getByText("E-mail:")).toBeInTheDocument();
    expect(screen.getByText("Пароль:")).toBeInTheDocument();
    expect(screen.getByText("Повтор пароля:")).toBeInTheDocument();
  });

  test("рендерит кнопку регистрации", () => {
    render(<SignupForm />);

    const submitButton = screen.getByRole("button", {
      name: "Зарегистрироваться",
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("отображает ссылку на вход", () => {
    render(<SignupForm />);

    expect(screen.getByText("Есть аккаунт?")).toBeInTheDocument();
    const loginLink = screen.getByText("Войти");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  test("все поля имеют правильные атрибуты", () => {
    render(<SignupForm />);

    const firstNameInput = screen.getByPlaceholderText("Введите ваше имя");
    expect(firstNameInput).toHaveAttribute("type", "text");
    expect(firstNameInput).toHaveAttribute("name", "firstName");

    const lastNameInput = screen.getByPlaceholderText("Введите вашу фамилию");
    expect(lastNameInput).toHaveAttribute("type", "text");
    expect(lastNameInput).toHaveAttribute("name", "lastName");

    const emailInput = screen.getByPlaceholderText("Введите ваш email");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");

    const passwordInput = screen.getByPlaceholderText("Введите ваш пароль");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");

    const confirmPasswordInput =
      screen.getByPlaceholderText("Повторите пароль");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("name", "confirmPassword");
  });

  test("кнопка изначально активна (не disabled)", () => {
    render(<SignupForm />);

    const submitButton = screen.getByRole("button", {
      name: "Зарегистрироваться",
    });
    expect(submitButton).not.toBeDisabled();
  });
});
