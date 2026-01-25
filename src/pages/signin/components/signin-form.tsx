import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useNavigation } from "react-router-dom";

import "./signin-form.css";
import { clearError, login } from "../../../store/actions/authActions";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

export const SigninForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

    const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const from = location.state?.from || "/";

  // Перенаправляем если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

    useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  

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
    await dispatch(login(formData.email, formData.password));
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
