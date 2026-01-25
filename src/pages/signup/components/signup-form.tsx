import { useState } from "react";
import { Link } from "react-router-dom";


import "./signup-form.css";

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибку при изменении поля
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Имя:</label>
            <input
              type="text"
              name="firstName"
              placeholder="Введите ваше имя"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Фамилия:</label>
            <input
              type="text"
              name="lastName"
              placeholder="Введите вашу фамилию"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>E-mail:</label>
            <input
              type="email"
              name="email"
              placeholder="Введите ваш email"
              value={formData.email}
              onChange={handleChange}
            />
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
          </div>

          <div className="form-group">
            <label>Повтор пароля:</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>


          <button type="submit" className="submitButton" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>

          <div className="form-group">
            <span>Есть аккаунт? </span>
            <Link to="/login">Войти</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
