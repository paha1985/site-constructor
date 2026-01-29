import { ComponentType } from "../types";


export const getDefaultProps = (type: ComponentType) => {
  const defaults = {
    header: {
      text: "Новый заголовок",
      level: 1,
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        margin: "10px 0",
        textAlign: "left",
        color: "#333333",
      },
    },
    paragraph: {
      text: "Введите текст здесь",
      style: {
        fontSize: "16px",
        lineHeight: "1.5",
        margin: "10px 0",
        color: "#666666",
      },
    },
    button: {
      text: "Кнопка",
      style: {
        backgroundColor: "#007bff",
        color: "#ffffff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        margin: "10px 0",
      },
    },
    image: {
      src: "https://avatars.mds.yandex.net/i?id=fa14d553fe7fb48cd18638efd63a5eb3_l-10930201-images-thumbs&n=13",
      alt: "Изображение",
      style: {
        width: "300px",
        height: "200px",
        margin: "10px 0",
        maxWidth: "100%",
      },
    },
    divider: {
      style: {
        height: "1px",
        backgroundColor: "#dddddd",
        margin: "20px 0",
        border: "none",
        width: "100%",
      },
    },
  };

  return defaults[type] || {};
};

export const createComponent = (type: ComponentType, props = {}) => {
  const baseProps = {
    id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    props: {
      ...getDefaultProps(type),
      ...props,
    },
  };

  return baseProps;
};