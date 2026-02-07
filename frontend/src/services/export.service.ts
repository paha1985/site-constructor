import { FullSite, SiteComponent } from "../types/constructor.types";

export const exportService = {
  generateHTML: (site: FullSite): string => {
    const { name, settings, components } = site;

    console.log("Components to export:", components);
    console.log("Number of components:", components.length);
    console.log(
      "Components with sortOrder:",
      components.map((c) => ({
        id: c.id,
        type: c.type,
        sortOrder: c.sortOrder,
      })),
    );

    const css = exportService.generateCSS(site);

    const htmlComponents = components
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((component) => {
        console.log(
          `Processing component: ${component.id} - ${component.type}`,
        );
        return exportService.renderComponentToHTML(component);
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
${css}
    </style>
</head>
<body>
    <div class="site-container">
${htmlComponents}
    </div>
</body>
</html>`;
  },

  generateCSS: (site: FullSite): string => {
    const { settings } = site;

    const baseCSS = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: ${settings.fontFamily || "Arial, sans-serif"};
    background-color: ${settings.backgroundColor || "#ffffff"};
    color: #333333;
    line-height: 1.6;
}

.site-container {
    max-width: ${settings.maxWidth || "1200px"};
    margin: ${settings.margin || "0 auto"};
    padding: 20px;
}`;

    const componentCSS = site.components
      .map((component) => exportService.generateComponentCSS(component))
      .filter(Boolean)
      .join("\n");

    return baseCSS + "\n" + componentCSS;
  },

  renderComponentToHTML: (component: SiteComponent): string => {
    const { type, props, id } = component;
    const elementId = `component-${id}`;

    switch (type) {
      case "header": {
        const { level = 1, text = "" } = props;
        const tag = `h${level}`;
        return `        <${tag} id="${elementId}" class="component-header">${text}</${tag}>`;
      }

      case "paragraph": {
        const { text = "" } = props;
        const formattedText = text.replace(/\n/g, "<br>");
        return `        <p id="${elementId}" class="component-paragraph">${formattedText}</p>`;
      }

      case "button": {
        const { text = "Кнопка" } = props;
        return `        <button id="${elementId}" class="component-button" type="button">${text}</button>`;
      }

      case "image": {
        const { src = "", alt = "Изображение" } = props;
        return `        <img id="${elementId}" class="component-image" src="${src}" alt="${alt}" />`;
      }

      case "divider": {
        return `        <hr id="${elementId}" class="component-divider" />`;
      }

      default:
        return `        <!-- Неизвестный компонент: ${type} -->`;
    }
  },

  generateComponentCSS: (component: SiteComponent): string => {
    const { type, props, id } = component;
    const elementId = `#component-${id}`;
    const { style = {} } = props;

    const baseStyles: Record<string, string> = {
      header: `
${elementId}.component-header {
    margin: ${style.margin || "10px 0"};
    text-align: ${style.textAlign || "left"};
    color: ${style.color || "#333333"};
    font-size: ${style.fontSize || "24px"};
    font-weight: ${style.fontWeight || "bold"};
}`,

      paragraph: `
${elementId}.component-paragraph {
    margin: ${style.margin || "10px 0"};
    color: ${style.color || "#666666"};
    font-size: ${style.fontSize || "16px"};
    line-height: ${style.lineHeight || "1.5"};
    text-align: ${style.textAlign || "left"};
}`,

      button: `
${elementId}.component-button {
    margin: ${style.margin || "10px 0"};
    padding: ${style.padding || "10px 20px"};
    background-color: ${style.backgroundColor || "#007bff"};
    color: ${style.color || "#ffffff"};
    border: ${style.border || "none"};
    border-radius: ${style.borderRadius || "4px"};
    font-size: ${style.fontSize || "16px"};
    cursor: pointer;
    transition: background-color 0.3s;
}

${elementId}.component-button:hover {
    background-color: ${style.hoverBackgroundColor || "#0056b3"};
}`,

      image: `
${elementId}.component-image {
    margin: ${style.margin || "10px 0"};
    width: ${style.width || "300px"};
    height: ${style.height || "200px"};
    max-width: 100%;
    object-fit: ${style.objectFit || "cover"};
    display: block;
}`,

      divider: `
${elementId}.component-divider {
    margin: ${style.margin || "20px 0"};
    border: none;
    height: ${style.height || "1px"};
    background-color: ${style.backgroundColor || "#dddddd"};
    width: 100%;
}`,
    };

    return baseStyles[type] || "";
  },

  downloadFile: (
    filename: string,
    content: string,
    type: string = "text/plain",
  ) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  exportProject: (site: FullSite): void => {
    const html = exportService.generateHTML(site);
    const css = exportService.generateCSS(site);

    exportService.downloadFile(
      `${site.name || "site"}.html`,
      html,
      "text/html",
    );

    exportService.downloadFile(`${site.name || "site"}.css`, css, "text/css");
  },
};
