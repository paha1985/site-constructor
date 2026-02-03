import { ComponentRenderer } from "./ComponentRenderer";
import { CSSProperties } from "react";

interface CanvasProps {
  site: any;
  selectedComponentId: string | null;
  isPreviewMode: boolean;
  onSelectComponent: (id: string | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  site,
  selectedComponentId,
  isPreviewMode,
  onSelectComponent,
}) => {
  const settings = site.settings || {};

  const handleSelectComponent = (id: string) => {
    if (!isPreviewMode) {
      onSelectComponent(id);
    }
  };

  const handleCanvasClick = () => {
    if (!isPreviewMode) {
      onSelectComponent(null);
    }
  };

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

  return (
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

          {selectedComponentId === component.id && !isPreviewMode && (
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
  );
};
