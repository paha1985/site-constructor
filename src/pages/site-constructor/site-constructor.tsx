import "./site-constructor.css";

export const componentTypes = [
  { id: "header", name: "Заголовок", icon: "H" },
  { id: "paragraph", name: "Текст", icon: "T" },
  { id: "button", name: "Кнопка", icon: "B" },
  { id: "image", name: "Изображение", icon: "📷" },
  { id: "divider", name: "Разделитель", icon: "—" },
];

export const SiteConstructor: React.FC = () => {
  const handleAddComponent = (type: any) => {
    console.log(type);
  };

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

        <div className="canvas">
          <div className="canvas-empty">
            <div className="empty-icon">📄</div>
            <h3>Холст пуст</h3>
            <p>Добавьте компоненты из панели слева</p>
          </div>
        </div>

        <div className="properties-panel">
          <div className="properties-header">
            <h3> Компонент</h3>
            <div className="component-actions">
              <button title="Поднять выше">↑</button>
              <button title="Опустить ниже">↓</button>
              <button className="delete-btn" title="Удалить">
                ×
              </button>
            </div>
          </div>

          <div className="properties-form"></div>
        </div>
      </div>
    </div>
  );
};
