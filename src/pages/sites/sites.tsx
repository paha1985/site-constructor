import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RootState } from "../../types";
import { fetchSites, deleteSite, setSearch, clearSites } from "../../store/actions/siteActions";
import "./sites.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export const Sites: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sites, loading, error, search: reduxSearch } =
    useAppSelector((state: RootState) => state.sites);
  const [localSearch, setLocalSearch] = useState<string>(reduxSearch);

  useEffect(() => {
    dispatch(fetchSites(reduxSearch));
    return () => {
      dispatch(clearSites());
    };
  }, [dispatch, reduxSearch]);

  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(localSearch));
  };



  const handleDelete = async (siteId: string | number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот сайт?")) {
      try {
        await dispatch(deleteSite(siteId));        
      } catch (err) {
        console.log(err)
      }
    }
  };

  const handleCreateSite = () => {
    window.location.href = "/constructor";
  };

  return (
    <div className="sites-container">
      <div className="sites-header">
        <h1>Мои сайты</h1>
        <button onClick={handleCreateSite} className="btn-create-site">
          + Создать сайт
        </button>

      <div className="sites-controls">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Поиск по названию сайта..."
            value={localSearch}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            Поиск
          </button>
        </form>
      </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {sites.length === 0 && !loading ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>У вас пока нет сайтов</h3>
          <p>Создайте свой первый сайт с помощью конструктора</p>
          <button onClick={handleCreateSite} className="btn-create-first">
            Создать первый сайт
          </button>
        </div>
      ) : (
        <>
          <div className="sites-grid">
            {sites.map((site) => (
              <div key={site.id} className="site-card">
                <div className="site-preview">
                  {site.preview ? (
                    <img src={site.preview} alt={site.name} />
                  ) : (
                    <div className="site-preview-placeholder">
                      <span>Превью</span>
                    </div>
                  )}
                </div>

                <div className="site-info">
                  <div className="info-item">
                    <span className="info-label">Создан:</span>
                    <span className="info-value">
                      {new Date(site.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Изменен:</span>
                    <span className="info-value">
                      {new Date(site.updatedAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Статус:</span>
                    <span
                      className={`status-badge status-${
                        site.status || "draft"
                      }`}
                    >
                      {site.status === "published" ? "Опубликован" : "Черновик"}
                    </span>
                  </div>
                </div>

                <div className="site-actions">
                  <Link
                    to={`/constructor/${site.id}`}
                    className="btn-edit-site"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => handleDelete(site.id)}
                    className="btn-delete-site"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
};

export default Sites;