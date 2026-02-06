import { Link } from "react-router-dom";
import "./not-found.css";

export const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1 className="error-title">Страница не найдена</h1>
          <p className="error-description">
            К сожалению, запрашиваемая страница не существует или была
            перемещена.
          </p>
          <div className="action-buttons">
            <Link to="/" className="btn btn-primary">
              На главную
            </Link>
            <Link to="/sites" className="btn btn-secondary">
              К моим сайтам
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline"
            >
              Вернуться назад
            </button>
          </div>
        </div>
        <div className="not-found-illustration">
          <div className="illustration">🔍</div>
        </div>
      </div>
    </div>
  );
};
