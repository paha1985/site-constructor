import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchSitesAction,
  deleteSiteAction,
  setSearch,
  setSort,
  clearSites,
  createSiteAction,
} from "../../store/actions/siteActions";
import "./sites.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "@/store";

export const Sites: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    sites,
    loading,
    error,
    hasMore,
    page,
    search: reduxSearch,
    sortBy,
    sortOrder,
  } = useAppSelector((state: RootState) => state.sites);

  const [localSearch, setLocalSearch] = useState<string>(reduxSearch);
  const [selectedSites, setSelectedSites] = useState<Set<string | number>>(
    new Set(),
  );
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSitesAction(1, reduxSearch, sortBy, sortOrder));
    return () => {
      dispatch(clearSites());
    };
  }, [dispatch, reduxSearch, sortBy, sortOrder]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !loading &&
        !isLoadingMore
      ) {
        loadMoreSites();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, isLoadingMore]);

  const loadMoreSites = useCallback(async () => {
    if (hasMore && !loading && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        await dispatch(
          fetchSitesAction(page + 1, reduxSearch, sortBy, sortOrder),
        );
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [
    dispatch,
    hasMore,
    loading,
    isLoadingMore,
    page,
    reduxSearch,
    sortBy,
    sortOrder,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(localSearch));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split("_") as [
      string,
      "asc" | "desc",
    ];
    dispatch(setSort(sortBy, sortOrder));
  };

  const handleDelete = async (siteId: string | number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот сайт?")) {
      try {
        await dispatch(deleteSiteAction(siteId));
        setSelectedSites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(siteId);
          return newSet;
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDeleteSelected = () => {
    if (selectedSites.size === 0) return;

    if (
      window.confirm(
        `Вы уверены, что хотите удалить ${selectedSites.size} сайтов?`,
      )
    ) {
      selectedSites.forEach((siteId) => {
        dispatch(deleteSiteAction(siteId));
      });
      setSelectedSites(new Set());
    }
  };

  const handleSelectAll = () => {
    if (selectedSites.size === sites.length) {
      setSelectedSites(new Set());
    } else {
      setSelectedSites(new Set(sites.map((site) => site.site_id)));
    }
  };

  const handleSelectSite = (siteId: string | number) => {
    setSelectedSites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(siteId)) {
        newSet.delete(siteId);
      } else {
        newSet.add(siteId);
      }
      return newSet;
    });
  };

  const handleCreateSite = async () => {
    try {
      const newSite = await dispatch(
        createSiteAction({
          name: "Мой новый сайт",
          description: "Создан в конструкторе",
          status: "draft",
        }),
      );

      navigate(`/constructor/${newSite.site_id}`);
    } catch (error) {
      console.error("Ошибка при создании сайта:", error);
    }
  };

  return (
    <div className="sites-container">
      <div className="sites-header">
        <h1>Мои сайты</h1>
        <button onClick={handleCreateSite} className="btn-create-site">
          + Создать сайт
        </button>
      </div>

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

        <div className="sort-controls">
          <select
            value={`${sortBy}_${sortOrder}`}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="createdAt_desc">Дата создания (новые)</option>
            <option value="createdAt_asc">Дата создания (старые)</option>
            <option value="name_asc">Название (А-Я)</option>
            <option value="name_desc">Название (Я-А)</option>
            <option value="updatedAt_desc">Дата изменения (новые)</option>
            <option value="updatedAt_asc">Дата изменения (старые)</option>
          </select>
        </div>
      </div>

      {selectedSites.size > 0 && (
        <div className="selection-actions">
          <span>Выбрано: {selectedSites.size}</span>
          <button
            onClick={handleDeleteSelected}
            className="btn-delete-selected"
          >
            Удалить выбранные
          </button>
        </div>
      )}

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
              <div key={site.site_id} className="site-card">
                <div className="site-card-header">
                  <input
                    type="checkbox"
                    checked={selectedSites.has(site.site_id)}
                    onChange={() => handleSelectSite(site.site_id)}
                    className="site-checkbox"
                  />
                  <h3 className="site-title">{site.name}</h3>
                </div>

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
                    to={`/constructor/${site.site_id}`}
                    className="btn-edit-site"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => handleDelete(site.site_id)}
                    className="btn-delete-site"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          {loading && <div className="loading-more">Загрузка...</div>}

          {hasMore && !loading && sites.length > 0 && (
            <button
              onClick={loadMoreSites}
              className="btn-load-more"
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Загрузка..." : "Загрузить еще"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Sites;
