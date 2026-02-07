import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import "./site-constructor.css";
import {
  updateSiteSettings,
  togglePreviewMode,
  loadSite,
  selectComponent,
} from "../../store/actions/constructorActions";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Canvas } from "../../components/canvas/Canvas";
import { PropertiesPanel } from "../../components/proprties-panel/PropertiesPanel";
import { ComponentPalette } from "../../components/component-palette/ComponentPalette";
import { ExportPanel } from "../../components/export/ExportPanel";

export const SiteConstructor: React.FC = () => {
  const [showExportPanel, setShowExportPanel] = useState(false);
  const dispatch = useAppDispatch();
  const { siteId } = useParams<{ siteId: string }>();

  const { site, selectedComponentId, isPreviewMode, loading, saving } =
    useAppSelector((state) => state.constructor);

  const navigate = useNavigate();

  useEffect(() => {
    if (siteId && siteId !== "new") {
      dispatch(loadSite(siteId));
    }
  }, [siteId, dispatch]);

  const handleSelectComponent = (id: string | null) => {
    dispatch(selectComponent(id));
  };

  const handleUpdateSiteSettings = (settings: any) => {
    if (!siteId) return;
    dispatch(updateSiteSettings(siteId, settings));
  };

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

  const currentSite = site || {
    site_id: siteId || "new",
    name: "Новый сайт",
    settings: {
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    components: [],
  };

  return (
    <div className="site-constructor">
      <div className="constructor-header">
        <button
          onClick={() => setShowExportPanel(!showExportPanel)}
          className="export-btn"
        >
          📥 Экспорт
        </button>
        {showExportPanel && <ExportPanel siteId={siteId || "new"} />}
        <h1>Конструктор сайтов: {currentSite.name}</h1>
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
        <ComponentPalette siteId={siteId} />

        <Canvas
          site={currentSite}
          selectedComponentId={selectedComponentId}
          isPreviewMode={isPreviewMode}
          onSelectComponent={handleSelectComponent}
        />

        <PropertiesPanel
          siteId={siteId}
          site={currentSite}
          selectedComponentId={selectedComponentId}
          isPreviewMode={isPreviewMode}
          onUpdateSiteSettings={handleUpdateSiteSettings}
        />
      </div>
    </div>
  );
};
