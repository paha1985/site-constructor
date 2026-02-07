import { AppDispatch } from "../index";
import { exportService } from "../../services/export.service";
import { FullSite } from "../../types/constructor.types";

export const previewCode =
  (site: FullSite) => async (dispatch: AppDispatch) => {
    try {
      const html = exportService.generateHTML(site);
      const css = exportService.generateCSS(site);

      dispatch({
        type: "EXPORT_SITE_SUCCESS",
        payload: { html, css, siteName: site.name },
      });

      return { html, css };
    } catch (error: any) {
      dispatch({
        type: "EXPORT_SITE_FAILURE",
        payload: error.message || "Ошибка генерации кода",
      });
      throw error;
    }
  };

export const exportSite = (site: FullSite) => async (dispatch: AppDispatch) => {
  try {
    dispatch({ type: "EXPORT_SITE_REQUEST" });

    const html = exportService.generateHTML(site);
    const css = exportService.generateCSS(site);

    exportService.exportProject(site);

    dispatch({
      type: "EXPORT_SITE_SUCCESS",
      payload: { html, css, siteName: site.name },
    });

    return { html, css };
  } catch (error: any) {
    dispatch({
      type: "EXPORT_SITE_FAILURE",
      payload: error.message || "Ошибка экспорта сайта",
    });
    throw error;
  }
};
