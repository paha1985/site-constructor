import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./signin-form.css";
import { clearError, login } from "../../../store/actions/authActions";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";

interface SigninFormProps {
  onSubmit?: () => void;
}

export const SigninForm: React.FC<SigninFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  const from = location.state?.from || "/";

  // useEffect(() => {
  //   console.log("Auth state changed:", {
  //     isAuthenticated,
  //     loading,
  //     error,
  //     token: localStorage.getItem("token"),
  //     user: localStorage.getItem("user"),
  //   });
  // }, [isAuthenticated, loading, error]);

  useEffect(() => {
    console.log("Auth state changed:", {
      isAuthenticated,
      loading,
      error,
      token: localStorage.getItem("token"),
      user: localStorage.getItem("user"),
    });

    // Перенаправляем только если авторизация успешна и не загружается
    if (isAuthenticated && !loading) {
      console.log("Redirecting to:", from);
      navigate(from, { replace: true });
      if (onSubmit) {
        onSubmit();
      }
    }
  }, [isAuthenticated, loading, error, navigate, from, onSubmit]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await dispatch(
      login({ email: formData.email, password: formData.password }),
    );

    console.log("Dispatch result:", result);
  };

  const isFormValid =
    formData.email && formData.password && formData.password.length >= 6;

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Вход в систему
        </h2>

        {location.state?.message && (
          <div
            style={{
              backgroundColor: "#e6f7ff",
              border: "1px solid #91d5ff",
              padding: "0.75rem",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            {location.state.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Введите ваш email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              name="password"
              placeholder="Введите ваш пароль"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>
                {errors.password}
              </span>
            )}
          </div>

          {error && (
            <div className="form-group" style={{ color: "red" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submitButton"
            disabled={!isFormValid || loading}
          >
            {loading ? "Вход..." : "Войти"}
          </button>

          <div
            className="form-group"
            style={{ textAlign: "center", marginTop: "1rem" }}
          >
            <span>Нет аккаунта? </span>
            <Link to="/register">Зарегистрироваться</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
