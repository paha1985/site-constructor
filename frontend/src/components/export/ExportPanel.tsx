import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { exportSite, previewCode } from "../../store/actions/exportActions";
import type { RootState } from "../../store";
import type { FullSite } from "../../types/constructor.types";
import "./ExportPanel.css";

interface ExportPanelProps {
  siteId: string | number;
}

type CodeTab = "html" | "css";

export const ExportPanel: React.FC<ExportPanelProps> = ({ siteId }) => {
  const dispatch = useAppDispatch();

  const site = useAppSelector(
    (state: RootState) => state.constructor.site,
  ) as FullSite | null;

  const exporting = useAppSelector(
    (state: RootState) => state.constructor.exporting,
  );

  const exportedCode = useAppSelector(
    (state: RootState) => state.constructor.exportedCode,
  );

  const [exportType, setExportType] = useState<"html" | "css" | "both">("both");
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<CodeTab>("html");

  const handleExport = () => {
    if (!site) return;
    dispatch(exportSite(site));
    setShowPreview(true);
  };

  const handlePreview = () => {
    if (!site) return;
    if (exportedCode) {
      setShowPreview(true);
    } else {
      dispatch(previewCode(site));
      setShowPreview(true);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    if (!exportedCode?.html) return;
    downloadFile(
      exportedCode.html,
      `${site?.name || "site"}.html`,
      "text/html",
    );
  };

  const handleDownloadCSS = () => {
    if (!exportedCode?.css) return;
    downloadFile(exportedCode.css, `${site?.name || "site"}.css`, "text/css");
  };

  if (!site) return null;

  return (
    <div className="export-panel">
      <h3>Экспорт сайта</h3>

      <div className="export-options">
        <div className="option-group">
          <label>Формат экспорта:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="both"
                checked={exportType === "both"}
                onChange={(e) => setExportType(e.target.value as any)}
              />
              HTML + CSS
            </label>
            <label>
              <input
                type="radio"
                value="html"
                checked={exportType === "html"}
                onChange={(e) => setExportType(e.target.value as any)}
              />
              Только HTML
            </label>
            <label>
              <input
                type="radio"
                value="css"
                checked={exportType === "css"}
                onChange={(e) => setExportType(e.target.value as any)}
              />
              Только CSS
            </label>
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={handlePreview}
            className="btn btn-secondary"
            disabled={exporting}
          >
            Предпросмотр кода
          </button>

          <button
            onClick={handleExport}
            className="btn btn-primary"
            disabled={exporting}
          >
            {exporting ? "Экспорт..." : "Экспортировать сайт"}
          </button>
        </div>

        {exportedCode && (
          <div className="export-results">
            <h4>Экспорт завершен!</h4>
            <p>Сайт "{exportedCode.siteName}" успешно экспортирован.</p>
            <div className="download-buttons">
              <button onClick={handleDownloadHTML} className="btn btn-outline">
                📄 Скачать HTML
              </button>
              <button onClick={handleDownloadCSS} className="btn btn-outline">
                🎨 Скачать CSS
              </button>
            </div>
          </div>
        )}

        {showPreview && exportedCode && (
          <div className="code-preview">
            <div className="code-tabs">
              <div
                className={`tab ${activeTab === "html" ? "active" : ""}`}
                onClick={() => setActiveTab("html")}
              >
                HTML
              </div>
              <div
                className={`tab ${activeTab === "css" ? "active" : ""}`}
                onClick={() => setActiveTab("css")}
              >
                CSS
              </div>
            </div>

            <div className="code-content">
              {activeTab === "html" ? (
                <pre className="code-block">
                  <code>{exportedCode.html}</code>
                </pre>
              ) : (
                <pre className="code-block">
                  <code>{exportedCode.css}</code>
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
