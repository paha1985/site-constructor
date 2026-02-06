import { NavLink, Outlet } from "react-router-dom";
import { Suspense } from "react";

import "./navbar.css";
import { logout } from "../../store/actions/authActions";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "15px",
        }}
      >
        <div style={{ fontWeight: 600 }}>Конструктор сайтов</div>
        <nav className={`nav-links `}>
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
              </>
            )}
          </ul>
        </nav>

        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>
              👤 {user?.firstName} {user?.lastName}{" "}
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
      </div>

      <Suspense fallback={<div className="loading">Загрузка...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};
