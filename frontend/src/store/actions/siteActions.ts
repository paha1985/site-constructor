import { AppDispatch } from "../index";
import {
  fetchSites,
  createSite,
  deleteSite,
  updateSite,
} from "../../services/site.service";

export const fetchSitesAction =
  (
    page = 1,
    search = "",
    sortBy = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: "FETCH_SITES_REQUEST" });

    try {
      const response = await fetchSites(page, search, sortBy, sortOrder);

      dispatch({
        type: "FETCH_SITES_SUCCESS",
        payload: {
          sites: response.sites,
          page: response.page,
          hasMore: response.hasMore,
          total: response.total,
        },
      });
    } catch (error: any) {
      dispatch({
        type: "FETCH_SITES_FAILURE",
        payload: error.response?.data?.message || "Ошибка загрузки сайтов",
      });
    }
  };

export const deleteSiteAction =
  (siteId: string | number) => async (dispatch: AppDispatch) => {
    dispatch({ type: "DELETE_SITE_REQUEST" });

    try {
      await deleteSite(siteId);

      dispatch({
        type: "DELETE_SITE_SUCCESS",
        payload: siteId,
      });
    } catch (error: any) {
      dispatch({
        type: "DELETE_SITE_FAILURE",
        payload: error.response?.data?.message || "Ошибка удаления сайта",
      });
      throw error;
    }
  };

export const createSiteAction =
  (siteData: any) => async (dispatch: AppDispatch) => {
    dispatch({ type: "CREATE_SITE_REQUEST" });

    try {
      const newSite = await createSite(siteData);

      dispatch({
        type: "CREATE_SITE_SUCCESS",
        payload: newSite,
      });

      return newSite;
    } catch (error: any) {
      dispatch({
        type: "CREATE_SITE_FAILURE",
        payload: error.response?.data?.message || "Ошибка создания сайта",
      });
      throw error;
    }
  };

export const updateSiteAction =
  (siteId: string | number, siteData: any) => async (dispatch: AppDispatch) => {
    dispatch({ type: "UPDATE_SITE_REQUEST" });

    try {
      const updatedSite = await updateSite(siteId, siteData);

      dispatch({
        type: "UPDATE_SITE_SUCCESS",
        payload: updatedSite,
      });

      return updatedSite;
    } catch (error: any) {
      dispatch({
        type: "UPDATE_SITE_FAILURE",
        payload: error.response?.data?.message || "Ошибка обновления сайта",
      });
      throw error;
    }
  };

export const setSearch = (search: string) => ({
  type: "SET_SEARCH",
  payload: search,
});

export const setSort = (sortBy: string, sortOrder: "asc" | "desc") => ({
  type: "SET_SORT",
  payload: { sortBy, sortOrder },
});

export const clearSites = () => ({
  type: "CLEAR_SITES",
});
