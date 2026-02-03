import { AppDispatch } from "../index";
import {
  fetchFullSite,
  addComponent as apiAddComponent,
  updateComponent as apiUpdateComponent,
  deleteComponent as apiDeleteComponent,
  updateComponentsOrder,
  saveSite as apiSaveSite,
  generatePreview,
} from "../../http/constructorAPI";
import { createComponent } from "../../utils/createComponent";

export const loadSite =
  (siteId: string | number) => async (dispatch: AppDispatch) => {
    dispatch({ type: "LOAD_SITE_REQUEST" });

    try {
      const site = await fetchFullSite(siteId);

      dispatch({
        type: "LOAD_SITE_SUCCESS",
        payload: site,
      });
    } catch (error: any) {
      dispatch({
        type: "LOAD_SITE_FAILURE",
        payload: error.response?.data?.message || "Ошибка загрузки сайта",
      });
      throw error;
    }
  };

export const addComponent =
  (siteId: string | number, type: string) => async (dispatch: AppDispatch) => {
    try {
      const defaultProps = getDefaultPropsForType(type);
      const newComponent = await apiAddComponent(siteId, type, defaultProps);

      dispatch({
        type: "ADD_COMPONENT_SUCCESS",
        payload: newComponent,
      });

      return newComponent;
    } catch (error: any) {
      dispatch({
        type: "ADD_COMPONENT_FAILURE",
        payload:
          error.response?.data?.message || "Ошибка добавления компонента",
      });
      throw error;
    }
  };

export const updateComponent =
  (siteId: string | number, componentId: string | number, props: any) =>
  async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: "UPDATE_COMPONENT_OPTIMISTIC",
        payload: { componentId, props },
      });

      const updatedComponent = await apiUpdateComponent(
        siteId,
        componentId,
        props,
      );

      dispatch({
        type: "UPDATE_COMPONENT_SUCCESS",
        payload: updatedComponent,
      });
    } catch (error: any) {
      const state = getState();
      const originalComponent = state.constructor.site.components.find(
        (c: any) => c.id === componentId,
      );

      dispatch({
        type: "UPDATE_COMPONENT_FAILURE",
        payload: {
          componentId,
          originalProps: originalComponent?.props,
          error:
            error.response?.data?.message || "Ошибка обновления компонента",
        },
      });
      throw error;
    }
  };

export const deleteComponent =
  (siteId: string | number, componentId: string | number) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: "DELETE_COMPONENT_OPTIMISTIC",
        payload: componentId,
      });

      await apiDeleteComponent(siteId, componentId);

      dispatch({
        type: "DELETE_COMPONENT_SUCCESS",
        payload: componentId,
      });
    } catch (error: any) {
      dispatch({
        type: "DELETE_COMPONENT_FAILURE",
        payload: {
          componentId,
          error: error.response?.data?.message || "Ошибка удаления компонента",
        },
      });
      throw error;
    }
  };

export const updateComponentsOrderAction =
  (siteId: string | number, newOrder: (string | number)[]) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: "UPDATE_COMPONENTS_ORDER_OPTIMISTIC",
        payload: newOrder,
      });

      await updateComponentsOrder(siteId, newOrder);

      dispatch({
        type: "UPDATE_COMPONENTS_ORDER_SUCCESS",
      });
    } catch (error: any) {
      dispatch({
        type: "UPDATE_COMPONENTS_ORDER_FAILURE",
        payload: error.response?.data?.message || "Ошибка обновления порядка",
      });
      throw error;
    }
  };

export const updateSiteSettings =
  (siteId: string | number, settings: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: "SAVE_SITE_SETTINGS_REQUEST",
      });

      const savedSite = await apiSaveSite(siteId, { settings });

      dispatch({
        type: "SAVE_SITE_SETTINGS_SUCCESS",
        payload: savedSite.settings,
      });

      return savedSite;
    } catch (error: any) {
      dispatch({
        type: "SAVE_SITE_SETTINGS_FAILURE",
        payload: error.response?.data?.message || "Ошибка сохранения настроек",
      });
      throw error;
    }
  };

export const saveSiteSettings = updateSiteSettings;

export const createNewSite = () => async (dispatch: AppDispatch) => {
  dispatch({ type: "CREATE_NEW_SITE" });

  const newSite = {
    site_id: "new_" + Date.now(),
    name: "Новый сайт",
    settings: {
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    components: [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dispatch({
    type: "CREATE_NEW_SITE_SUCCESS",
    payload: newSite,
  });

  return newSite;
};

export const createPreview =
  (siteId: string | number, htmlContent: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: "CREATE_PREVIEW_REQUEST",
      });

      const result = await generatePreview(siteId, htmlContent);

      dispatch({
        type: "CREATE_PREVIEW_SUCCESS",
        payload: result.previewUrl,
      });

      return result.previewUrl;
    } catch (error: any) {
      dispatch({
        type: "CREATE_PREVIEW_FAILURE",
        payload: error.response?.data?.message || "Ошибка создания превью",
      });
      throw error;
    }
  };

const getDefaultPropsForType = (type: string) => {
  const defaults: Record<string, any> = {
    header: {
      text: "Заголовок",
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
      text: "Текст",
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
      },
    },
    image: {
      src: "https://avatars.mds.yandex.net/i?id=fa14d553fe7fb48cd18638efd63a5eb3_l-10930201-images-thumbs&n=13",
      alt: "Изображение",
      style: {
        width: "300px",
        height: "200px",
        margin: "10px 0",
      },
    },
    divider: {
      style: {
        height: "1px",
        backgroundColor: "#dddddd",
        margin: "20px 0",
      },
    },
  };

  return defaults[type] || {};
};

export const selectComponent = (componentId: string | null) => ({
  type: "SELECT_COMPONENT",
  payload: componentId,
});

export const togglePreviewMode = () => ({
  type: "TOGGLE_PREVIEW_MODE",
});
