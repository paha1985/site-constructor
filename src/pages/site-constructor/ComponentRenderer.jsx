import React from "react";

export const ComponentRenderer = ({ component }) => {
  if (!component || !component.props) return null;

  const { type, props } = component;

  switch (type) {
    case "header": {
      const { level = 1, text = "Заголовок", style = {} } = props;
      const Tag = `h${level}`;

      const mergedStyle = {
        fontSize: style.fontSize || "24px",
        fontWeight: style.fontWeight || "bold",
        margin: style.margin || "10px 0",
        textAlign: style.textAlign || "left",
        color: style.color || "#333333",
        fontFamily: style.fontFamily || "inherit",
        ...style,
      };

      return <Tag style={mergedStyle}>{text}</Tag>;
    }

    case "paragraph": {
      const { text = "Текст", style = {} } = props;

      const mergedStyle = {
        fontSize: style.fontSize || "16px",
        lineHeight: style.lineHeight || "1.5",
        margin: style.margin || "10px 0",
        color: style.color || "#666666",
        fontFamily: style.fontFamily || "inherit",
        textAlign: style.textAlign || "left",
        ...style,
      };

      return <p style={mergedStyle}>{text}</p>;
    }

    case "button": {
      const { text = "Кнопка", style = {} } = props;

      const mergedStyle = {
        backgroundColor: style.backgroundColor || "#007bff",
        color: style.color || "#ffffff",
        padding: style.padding || "10px 20px",
        border: style.border || "none",
        borderRadius: style.borderRadius || "4px",
        cursor: "pointer",
        fontSize: style.fontSize || "16px",
        margin: style.margin || "10px 0",
        fontFamily: style.fontFamily || "inherit",
        ...style,
      };

      return <button style={mergedStyle}>{text}</button>;
    }

    case "image": {
      const {
        src = "https://avatars.mds.yandex.net/i?id=fa14d553fe7fb48cd18638efd63a5eb3_l-10930201-images-thumbs&n=13",
        alt = "Изображение",
        style = {},
      } = props;

      const mergedStyle = {
        width: style.width || "300px",
        height: style.height || "200px",
        margin: style.margin || "10px 0",
        maxWidth: "100%",
        display: "block",
        ...style,
      };

      return <img src={src} alt={alt} style={mergedStyle} />;
    }

    case "divider": {
      const { style = {} } = props;

      const mergedStyle = {
        height: style.height || "1px",
        backgroundColor: style.backgroundColor || "#dddddd",
        margin: style.margin || "20px 0",
        border: "none",
        width: "100%",
        ...style,
      };

      return <hr style={mergedStyle} />;
    }

    default:
      return null;
  }
};
