import { useAppDispatch, useAppSelector } from "../../store/hooks";
import "./site-constructor.css";
import {
  addComponent,
  selectComponent,
} from "../../store/actions/constructorActions";
import { ComponentType } from "@/types";
import { ComponentRenderer } from "./ComponentRenderer.jsx";
import { CSSProperties } from "react";

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

  const {
    site: siteFromState,
    selectedComponentId,
    isPreviewMode,
  } = useAppSelector((state) => state.constructor);

  const site = siteFromState || {
    id: "site_1",
    name: "Мой сайт",
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
    dispatch(addComponent(type));
  };

  const handleSelectComponent = (id: string) => {
    console.log(isPreviewMode);
    console.log(id);

    if (!isPreviewMode) {
      dispatch(selectComponent(id));
    }
  };

  const handleCanvasClick = () => {
    if (!isPreviewMode) {
      dispatch(selectComponent(null));
    }
  };

  const updateSiteSetting = (param: any, val: any): void => {
    console.log(param, val);
  };

  console.log(selectedComponentId);
  console.log(isPreviewMode);

  return (
    <div className="site-constructor">
      <div className="constructor-header">
        <h1>Конструктор сайтов</h1>
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
              <button className="btn-move" title="Поднять выше">
                ↑
              </button>
              <button className="btn-move" title="Опустить ниже">
                ↓
              </button>
              <button className="delete-btn" title="Удалить">
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
                <p>ID: {site.id || "Нет"}</p>
              </div>
            </div>
          )}
          <div className="properties-form"></div>
        </div>
      </div>
    </div>
  );
};
