import { useState, useEffect } from "react";
import {
  updateComponent,
  deleteComponent,
  updateSiteName,
} from "../../store/actions/constructorActions";
import { updateComponentsOrderAction } from "../../store/actions/constructorActions";
import { useAppDispatch } from "../../hooks/hooks";

interface PropertiesPanelProps {
  siteId: string | undefined;
  site: any;
  selectedComponentId: string | null;
  isPreviewMode: boolean;
  onUpdateSiteSettings: (settings: any) => void;
  onUpdateSiteName?: (name: string) => void;
}

interface ComponentFormData {
  text?: string;
  level?: number;
  src?: string;
  alt?: string;
  style?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  siteId,
  site,
  selectedComponentId,
  isPreviewMode,
  onUpdateSiteSettings,
}) => {
  const [localFormData, setLocalFormData] = useState<ComponentFormData>({});

  const selectedComponent = (site.components || []).find(
    (c: any) => c.id === selectedComponentId,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedComponent) {
      setLocalFormData(selectedComponent.props || {});
    } else {
      setLocalFormData({});
    }
  }, [selectedComponent]);

  const updateComponentProperty = (field: string, value: any) => {
    if (!selectedComponentId || !siteId) return;

    const updatedProps = { ...localFormData, [field]: value };
    setLocalFormData(updatedProps);

    dispatch(updateComponent(siteId, selectedComponentId, updatedProps));
  };

  const updateComponentStyle = (field: string, value: any) => {
    if (!selectedComponentId || !siteId) return;

    const updatedProps: ComponentFormData = {
      ...localFormData,
      style: {
        ...(localFormData.style || {}),
        [field]: value,
      },
    };

    setLocalFormData(updatedProps);
    dispatch(updateComponent(siteId, selectedComponentId, updatedProps));
  };

  const handleDeleteComponent = () => {
    if (!selectedComponentId || !siteId) return;

    if (window.confirm("Удалить этот компонент?")) {
      dispatch(deleteComponent(siteId, selectedComponentId));
    }
  };

  const handleMoveComponent = (direction: "up" | "down") => {
    if (!selectedComponentId || !siteId || !site.components) return;

    const currentIndex = site.components.findIndex(
      (c: any) => c.id === selectedComponentId,
    );
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= site.components.length) return;

    const newOrder = [...site.components.map((c: any) => c.id)];
    [newOrder[currentIndex], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[currentIndex],
    ];

    dispatch(updateComponentsOrderAction(siteId, newOrder));
  };

  const updateSiteSetting = (field: string, value: string) => {
    const newSettings = {
      ...(site.settings || {}),
      [field]: value,
    };

    onUpdateSiteSettings(newSettings);
  };

  const handleSiteNameChange = (name: string) => {
    if (!siteId) return;

    dispatch(updateSiteName(siteId, name));
  };

  if (isPreviewMode) return null;

  const props = localFormData;

  return (
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
                onChange={(e) => handleSiteNameChange(e.target.value)}
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
                <option value="'Courier New', monospace">Courier New</option>
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
                onChange={(e) => updateSiteSetting("maxWidth", e.target.value)}
              />
            </div>
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
              onChange={(e) => updateComponentProperty("text", e.target.value)}
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
              onChange={(e) => updateComponentStyle("fontSize", e.target.value)}
              placeholder="24px"
            />
          </div>
          <div className="form-group">
            <label>Цвет текста:</label>
            <input
              type="color"
              value={props.style?.color || "#333333"}
              onChange={(e) => updateComponentStyle("color", e.target.value)}
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
              onChange={(e) => updateComponentProperty("text", e.target.value)}
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>Размер шрифта:</label>
            <input
              type="text"
              value={props.style?.fontSize || "16px"}
              onChange={(e) => updateComponentStyle("fontSize", e.target.value)}
              placeholder="16px"
            />
          </div>
          <div className="form-group">
            <label>Цвет текста:</label>
            <input
              type="color"
              value={props.style?.color || "#666666"}
              onChange={(e) => updateComponentStyle("color", e.target.value)}
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
              onChange={(e) => updateComponentProperty("text", e.target.value)}
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
              onChange={(e) => updateComponentStyle("color", e.target.value)}
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
              onChange={(e) => updateComponentStyle("padding", e.target.value)}
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
              onChange={(e) => updateComponentProperty("src", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="form-group">
            <label>Альтернативный текст:</label>
            <input
              type="text"
              value={props.alt || "Изображение"}
              onChange={(e) => updateComponentProperty("alt", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Ширина:</label>
            <input
              type="text"
              value={props.style?.width || "300px"}
              onChange={(e) => updateComponentStyle("width", e.target.value)}
              placeholder="300px"
            />
          </div>
          <div className="form-group">
            <label>Высота:</label>
            <input
              type="text"
              value={props.style?.height || "200px"}
              onChange={(e) => updateComponentStyle("height", e.target.value)}
              placeholder="200px"
            />
          </div>
        </>
      )}

      <div className="properties-form"></div>
    </div>
  );
};
