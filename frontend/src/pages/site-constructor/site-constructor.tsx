import { useAppDispatch, useAppSelector } from "../../store/hooks";
import "./site-constructor.css";
import {
  addComponent,
  selectComponent,
  updateComponent,
  updateSiteSettings,
  deleteComponent,
  updateComponentsOrderAction,
  togglePreviewMode,
  loadSite,
} from "../../store/actions/constructorActions";
import { Component, ComponentType } from "@/types";
import { ComponentRenderer } from "./ComponentRenderer.jsx";
import { CSSProperties, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const componentTypes: Array<{
  id: ComponentType;
  name: string;
  icon: string;
}> = [
  { id: "header", name: "Заголовок", icon: "H" },
  { id: "paragraph", name: "Текст", icon: "T" },
  { id: "button", name: "Кнопка", icon: "B" },
  { id: "image", name: "Изображение", icon: "📷" },
  { id: "divider", name: "Разделитель", icon: "—" },
];

interface SiteSettings {
  backgroundColor?: string;
  fontFamily?: string;
  maxWidth?: string;
  margin?: string;
}

export const SiteConstructor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { siteId } = useParams<{ siteId: string }>();

  const {
    site: siteFromState,
    selectedComponentId,
    isPreviewMode,
    loading,
    saving,
  } = useAppSelector((state) => state.constructor);

  const navigate = useNavigate();

  useEffect(() => {
    if (siteId && siteId !== "new") {
      // Загружаем существующий сайт
      dispatch(loadSite(siteId));
    } else {
      // Создаем новый сайт
      // dispatch(createNewSite());
    }
  }, [siteId, dispatch]);

  const site = siteFromState || {
    site_id: "new",
    name: "Новый сайт",
    settings: {
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    components: [],
  };

  const settings: SiteSettings = site.settings || {};

  const canvasStyle: CSSProperties = {
    backgroundColor: settings.backgroundColor || "#ffffff",
    fontFamily: settings.fontFamily || "Arial, sans-serif",
    maxWidth: settings.maxWidth || "1200px",
    margin: settings.margin || "0 auto",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    position: "relative" as const,
    overflowY: "auto" as const,
    minHeight: "600px",
    background: "#fff",
  };

  const handleAddComponent = (type: ComponentType) => {
    if (siteId) {
      dispatch(addComponent(siteId, type));
    } else {
      // Для локального режима без сохранения
      dispatch(addComponent("new", type));
    }
  };

  const handleSelectComponent = (id: string) => {
    if (!isPreviewMode) {
      dispatch(selectComponent(id));
    }
  };

  const handleCanvasClick = () => {
    if (!isPreviewMode) {
      dispatch(selectComponent(null));
    }
  };

  const updateSiteSetting = (field: string, value: string) => {
    if (!siteId) return;

    const newSettings = {
      ...(site.settings || {}),
      [field]: value,
    };

    dispatch(updateSiteSettings(siteId, newSettings));
  };

  const selectedComponent = (site.components || []).find(
    (c: Component) => c.id === selectedComponentId,
  );

  const [localFormData, setLocalFormData] = useState<Record<string, any>>({});

  // Инициализация localFormData при выборе компонента
  useEffect(() => {
    if (selectedComponent) {
      setLocalFormData(selectedComponent.props || {});
    } else {
      setLocalFormData({});
    }
  }, [selectedComponent]);

  // Функция для мгновенного обновления компонента
  const updateComponentProperty = (field: string, value: any) => {
    if (!selectedComponentId || !siteId) return;

    const updatedProps = { ...localFormData, [field]: value };
    setLocalFormData(updatedProps);

    // Немедленно диспатчим обновление
    dispatch(updateComponent(siteId, selectedComponentId, updatedProps));
  };

  // Функция для обновления стилей
  const updateComponentStyle = (field: string, value: any) => {
    if (!selectedComponentId || !siteId) return;

    const updatedProps = {
      ...localFormData,
      style: {
        ...(localFormData.style || {}),
        [field]: value,
      },
    };

    setLocalFormData(updatedProps);
    dispatch(updateComponent(siteId, selectedComponentId, updatedProps));
  };

  // Удаление компонента
  const handleDeleteComponent = () => {
    if (!selectedComponentId || !siteId) return;

    if (window.confirm("Удалить этот компонент?")) {
      dispatch(deleteComponent(siteId, selectedComponentId));
    }
  };

  // Перемещение компонента
  const handleMoveComponent = (direction: "up" | "down") => {
    if (!selectedComponentId || !siteId || !site.components) return;

    const currentIndex = site.components.findIndex(
      (c) => c.id === selectedComponentId,
    );
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= site.components.length) return;

    const newOrder = [...site.components.map((c) => c.id)];
    [newOrder[currentIndex], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[currentIndex],
    ];

    dispatch(updateComponentsOrderAction(siteId, newOrder));
  };

  const props = localFormData;

  if (loading) {
    return (
      <div className="site-constructor">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка сайта...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="site-constructor">
      <div className="constructor-header">
        <h1>Конструктор сайтов</h1>
        <div className="header-controls">
          <button onClick={() => navigate(-1)}>К сайтам</button>
          <button
            onClick={() => dispatch(togglePreviewMode())}
            className={`preview-btn ${isPreviewMode ? "active" : ""}`}
          >
            {isPreviewMode ? "Редактировать" : "Предпросмотр"}
          </button>
          {saving && <span className="saving-indicator">Сохранение...</span>}
        </div>
      </div>
      <div className="constructor-layout">
        <div className="component-palette">
          <h3>Компоненты</h3>
          <div className="palette-items">
            {componentTypes.map((component) => (
              <div
                key={component.id}
                className="palette-item"
                onClick={() => handleAddComponent(component.id)}
                title={component.name}
              >
                <span className="palette-icon">{component.icon}</span>
                <span className="palette-name">{component.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="canvas" style={canvasStyle} onClick={handleCanvasClick}>
          {(site.components || []).map((component: any) => (
            <div
              key={component.id}
              className={`canvas-component ${
                selectedComponentId === component.id ? "selected" : ""
              } ${isPreviewMode ? "preview-mode" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectComponent(component.id);
              }}
            >
              <ComponentRenderer component={component} />

              {selectedComponentId === component.id && (
                <div className="component-overlay">
                  <div className="component-drag-handle">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(!site.components || site.components.length === 0) && (
            <div className="canvas-empty">
              <div className="empty-icon">📄</div>
              <h3>Холст пуст</h3>
              <p>Добавьте компоненты из панели слева</p>
            </div>
          )}
        </div>

        <div className="properties-panel">
          <div className="properties-header">
            <h3> Компонент</h3>
            <div className="component-actions">
              <button
                className="btn-move"
                title="Поднять выше"
                onClick={() => handleMoveComponent("up")}
              >
                ↑
              </button>
              <button
                className="btn-move"
                title="Опустить ниже"
                onClick={() => handleMoveComponent("down")}
              >
                ↓
              </button>
              <button
                className="delete-btn"
                title="Удалить"
                onClick={handleDeleteComponent}
              >
                ×
              </button>
            </div>
          </div>
          {!selectedComponentId && (
            <div className="properties-panel">
              <h3>Настройки сайта</h3>
              <div className="properties-form">
                <div className="form-group">
                  <label>Название сайта:</label>
                  <input
                    type="text"
                    value={site.name || "Мой сайт"}
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Цвет фона:</label>
                  <input
                    type="color"
                    value={site.settings?.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      updateSiteSetting("backgroundColor", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Шрифт:</label>
                  <select
                    value={site.settings?.fontFamily || "Arial, sans-serif"}
                    onChange={(e) =>
                      updateSiteSetting("fontFamily", e.target.value)
                    }
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Courier New', monospace">
                      Courier New
                    </option>
                    <option value="'Times New Roman', serif">
                      Times New Roman
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Макс. ширина:</label>
                  <input
                    type="text"
                    value={site.settings?.maxWidth || "1200px"}
                    onChange={(e) =>
                      updateSiteSetting("maxWidth", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="site-info">
                <h4>Информация о сайте</h4>
                <p>Компонентов: {(site.components || []).length}</p>
                <p>ID: {site.site_id || "Нет"}</p>
              </div>
            </div>
          )}

          {selectedComponent?.type === "header" && (
            <>
              <div className="form-group">
                <label>Текст:</label>
                <input
                  type="text"
                  value={props.text || ""}
                  onChange={(e) =>
                    updateComponentProperty("text", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Уровень:</label>
                <select
                  value={props.level || 1}
                  onChange={(e) =>
                    updateComponentProperty("level", parseInt(e.target.value))
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <option key={level} value={level}>
                      H{level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Размер шрифта:</label>
                <input
                  type="text"
                  value={props.style?.fontSize || "24px"}
                  onChange={(e) =>
                    updateComponentStyle("fontSize", e.target.value)
                  }
                  placeholder="24px"
                />
              </div>
              <div className="form-group">
                <label>Цвет текста:</label>
                <input
                  type="color"
                  value={props.style?.color || "#333333"}
                  onChange={(e) =>
                    updateComponentStyle("color", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Выравнивание:</label>
                <select
                  value={props.style?.textAlign || "left"}
                  onChange={(e) =>
                    updateComponentStyle("textAlign", e.target.value)
                  }
                >
                  <option value="left">Слева</option>
                  <option value="center">По центру</option>
                  <option value="right">Справа</option>
                  <option value="justify">По ширине</option>
                </select>
              </div>
            </>
          )}

          {selectedComponent?.type === "paragraph" && (
            <>
              <div className="form-group">
                <label>Текст:</label>
                <textarea
                  value={props.text || ""}
                  onChange={(e) =>
                    updateComponentProperty("text", e.target.value)
                  }
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Размер шрифта:</label>
                <input
                  type="text"
                  value={props.style?.fontSize || "16px"}
                  onChange={(e) =>
                    updateComponentStyle("fontSize", e.target.value)
                  }
                  placeholder="16px"
                />
              </div>
              <div className="form-group">
                <label>Цвет текста:</label>
                <input
                  type="color"
                  value={props.style?.color || "#666666"}
                  onChange={(e) =>
                    updateComponentStyle("color", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Межстрочный интервал:</label>
                <input
                  type="text"
                  value={props.style?.lineHeight || "1.5"}
                  onChange={(e) =>
                    updateComponentStyle("lineHeight", e.target.value)
                  }
                  placeholder="1.5"
                />
              </div>
            </>
          )}

          {selectedComponent?.type === "button" && (
            <>
              <div className="form-group">
                <label>Текст кнопки:</label>
                <input
                  type="text"
                  value={props.text || ""}
                  onChange={(e) =>
                    updateComponentProperty("text", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Цвет фона:</label>
                <input
                  type="color"
                  value={props.style?.backgroundColor || "#007bff"}
                  onChange={(e) =>
                    updateComponentStyle("backgroundColor", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Цвет текста:</label>
                <input
                  type="color"
                  value={props.style?.color || "#ffffff"}
                  onChange={(e) =>
                    updateComponentStyle("color", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Радиус границ:</label>
                <input
                  type="text"
                  value={props.style?.borderRadius || "4px"}
                  onChange={(e) =>
                    updateComponentStyle("borderRadius", e.target.value)
                  }
                  placeholder="4px"
                />
              </div>
              <div className="form-group">
                <label>Отступы:</label>
                <input
                  type="text"
                  value={props.style?.padding || "10px 20px"}
                  onChange={(e) =>
                    updateComponentStyle("padding", e.target.value)
                  }
                  placeholder="10px 20px"
                />
              </div>
            </>
          )}

          {selectedComponent?.type === "image" && (
            <>
              <div className="form-group">
                <label>URL изображения:</label>
                <input
                  type="text"
                  value={
                    props.src ||
                    "https://avatars.mds.yandex.net/i?id=fa14d553fe7fb48cd18638efd63a5eb3_l-10930201-images-thumbs&n=13"
                  }
                  onChange={(e) =>
                    updateComponentProperty("src", e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label>Альтернативный текст:</label>
                <input
                  type="text"
                  value={props.alt || "Изображение"}
                  onChange={(e) =>
                    updateComponentProperty("alt", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Ширина:</label>
                <input
                  type="text"
                  value={props.style?.width || "300px"}
                  onChange={(e) =>
                    updateComponentStyle("width", e.target.value)
                  }
                  placeholder="300px"
                />
              </div>
              <div className="form-group">
                <label>Высота:</label>
                <input
                  type="text"
                  value={props.style?.height || "200px"}
                  onChange={(e) =>
                    updateComponentStyle("height", e.target.value)
                  }
                  placeholder="200px"
                />
              </div>
            </>
          )}

          <div className="properties-form"></div>
        </div>
      </div>
    </div>
  );
};
