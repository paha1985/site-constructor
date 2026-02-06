import { Link, useNavigate } from "react-router-dom";

import { createSiteAction } from "../../store/actions/siteActions";
import "./home.css";
import { useAppDispatch } from "../../hooks/hooks";
import { Site } from "../../types";

export const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCreateSite = async () => {
    try {
      const newSite = (await dispatch(
        createSiteAction({
          name: "Мой новый сайт",
          description: "Создан в конструкторе",
          status: "draft",
        }),
      )) as unknown as Site;

      navigate(`/constructor/${newSite.site_id}`);
    } catch (error) {
      console.error("Ошибка при создании сайта:", error);
      alert("Не удалось создать сайт. Попробуйте еще раз.");
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="container">
          <h1 className="home-title">Конструктор сайтов</h1>
          <p className="home-subtitle">
            Создавайте красивые сайты без написания кода
          </p>
        </div>
      </header>

      <main className="home-content">
        <div className="container">
          <section className="features-section">
            <h2 className="section-title">Возможности конструктора</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3 className="feature-title">Визуальный редактор</h3>
                <p className="feature-description">
                  Перетаскивайте компоненты, настраивайте стили в реальном
                  времени
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3 className="feature-title">Быстрая разработка</h3>
                <p className="feature-description">
                  Создавайте сайты в разы быстрее традиционных методов
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3 className="feature-title">Адаптивный дизайн</h3>
                <p className="feature-description">
                  Автоматическая адаптация под мобильные устройства и планшеты
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">💾</div>
                <h3 className="feature-title">Автосохранение</h3>
                <p className="feature-description">
                  Все изменения сохраняются автоматически. Не бойтесь потерять
                  работу
                </p>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <h2 className="section-title">Начните создавать прямо сейчас</h2>
            <p className="cta-description">
              Создайте свой первый сайт за несколько минут
            </p>
            <div className="cta-buttons">
              <button onClick={handleCreateSite} className="btn btn-primary">
                Создать новый сайт
              </button>
              <Link to="/sites" className="btn btn-secondary">
                Мои сайты
              </Link>
            </div>
          </section>

          <section className="quick-start-section">
            <h2 className="section-title">Инструкция</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="step-title">Создайте сайт</h3>
                <p className="step-description">
                  Нажмите "Создать новый сайт" или выберите шаблон
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="step-title">Добавьте компоненты</h3>
                <p className="step-description">
                  Перетащите нужные элементы из панели слева
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="step-title">Настройте дизайн</h3>
                <p className="step-description">
                  Измените цвета, шрифты и расположение в панели справа
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3 className="step-title">Опубликуйте</h3>
                <p className="step-description">
                  Сохраните и опубликуйте ваш готовый сайт
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
