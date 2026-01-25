import { NavLink, Outlet } from "react-router-dom";
import { Suspense, useState } from "react";

import "./navbar.css";
import { logout } from "../../store/actions/authActions";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar-container">
      {isAuthenticated ? (
        <div style={{ marginBottom: "1rem" }}>
          <span>
            Добро пожаловать, {user?.firstName} {user?.lastName}{" "}
          </span>
          <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
            Выйти
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: "1rem" }}>
          <span>Вы не авторизованы. </span>
          <NavLink to="/login">Войти</NavLink>
          <span> или </span>
          <NavLink to="/register">Зарегистрироваться</NavLink>
        </div>
      )}

      <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <NavLink to="/" end>
              Главная
            </NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/profile">Профиль</NavLink>
              </li>
              <li>
                <NavLink to="/sites">Сайты</NavLink>
              </li>
              <li>
                <NavLink to="/constructor">Конструктор</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      
        <Suspense fallback={<div className="loading">Загрузка...</div>}>
          <Outlet />
        </Suspense>
      
    </div>
  );
};
