import { useState } from "react";
import { Link } from "react-router-dom";

import "./signin-form.css";
// import { clearError, login } from "../../../store/actions/authActions";

export const SigninForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});;

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
  };

  const isFormValid =
    formData.email && formData.password && formData.password.length >= 6;

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Вход в систему
        </h2>



        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Введите ваш email"
              value={formData.email}
              onChange={handleChange}             
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
                  />
            {errors.password && (
              <span style={{ color: "red", fontSize: "0.875rem" }}>
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="submitButton"
            disabled={!isFormValid}
          >
           Войти
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
