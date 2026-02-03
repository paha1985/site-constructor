import { useAppSelector } from "../../../../store/hooks";
import { addComponent } from "../../../../store/actions/constructorActions";
import { ComponentType } from "@/types";
import { useAppDispatch } from "../../../../store/hooks";

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

interface ComponentPaletteProps {
  siteId: string | undefined;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  siteId,
}) => {
  const dispatch = useAppDispatch();
  const { isPreviewMode } = useAppSelector((state) => state.constructor);

  if (isPreviewMode) return null;

  const handleAddComponent = (type: ComponentType) => {
    if (siteId) {
      dispatch(addComponent(siteId, type));
    } else {
      dispatch(addComponent("new", type));
    }
  };

  return (
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
  );
};
