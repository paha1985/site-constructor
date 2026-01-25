import { Site } from "../../types";
import { AppDispatch } from "../index";

// Моковые данные для демонстрации - как у вас
const generateMockSites = (count: number): Site[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Мой сайт ${i + 1}`,
    description: i % 2 === 0 ? "Личный блог" : "Корпоративный сайт",
    preview: i % 3 === 0 ? "https://via.placeholder.com/300x200" : null,
    status: i % 4 === 0 ? "published" : "draft",
    createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  }));
};

const mockSites = generateMockSites(35);

export const fetchSites = (search = "") => async (dispatch: AppDispatch) => {


  dispatch({ type: "FETCH_SITES_REQUEST" });

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredSites = [...mockSites];

    // Поиск
    if (search) {
      filteredSites = filteredSites.filter(
        (site) =>
          site.name.toLowerCase().includes(search.toLowerCase()) ||
          (site.description &&
            site.description.toLowerCase().includes(search.toLowerCase()))
      );
    }    

    dispatch({
      type: "FETCH_SITES_SUCCESS",
      payload: {
        sites: filteredSites,
      },
    });
  } catch (error) {
    dispatch({
      type: "FETCH_SITES_FAILURE",
      payload: error instanceof Error ? error.message : "Ошибка загрузки сайтов",
    });
  }
};

export const deleteSite = (siteId: string | number) => async (dispatch: AppDispatch) => {
  dispatch({ type: "DELETE_SITE_REQUEST" });

  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    dispatch({
      type: "DELETE_SITE_SUCCESS",
      payload: siteId,
    });
  } catch (error) {
    dispatch({
      type: "DELETE_SITE_FAILURE",
      payload: error instanceof Error ? error.message : "Ошибка удаления сайта",
    });
  }
};

export const createSite = (siteData: Partial<Site>) => async (dispatch: AppDispatch) => {
  dispatch({ type: "CREATE_SITE_REQUEST" });

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newSite: Site = {
      id: mockSites.length + 1,
      name: siteData.name || "Новый сайт",
      description: siteData.description || "",
      preview: null,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...siteData,
    };

    mockSites.unshift(newSite);

    dispatch({
      type: "CREATE_SITE_SUCCESS",
      payload: newSite,
    });

    return newSite;
  } catch (error) {
    dispatch({
      type: "CREATE_SITE_FAILURE",
      payload: error instanceof Error ? error.message : "Ошибка создания сайта",
    });
    throw error;
  }
};

export const updateSite = (siteId: string | number, siteData: Partial<Site>) => async (dispatch: AppDispatch) => {
  dispatch({ type: "UPDATE_SITE_REQUEST" });

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockSites.findIndex((site) => site.id === siteId);
    if (index !== -1) {
      mockSites[index] = {
        ...mockSites[index],
        ...siteData,
        updatedAt: new Date().toISOString(),
      };
    }

    dispatch({
      type: "UPDATE_SITE_SUCCESS",
      payload: mockSites[index],
    });
  } catch (error) {
    dispatch({
      type: "UPDATE_SITE_FAILURE",
      payload: error instanceof Error ? error.message : "Ошибка обновления сайта",
    });
    throw error;
  }
};

export const setSearch = (search: string) => (dispatch: AppDispatch) => {
  dispatch({
    type: "SET_SEARCH",
    payload: search,
  });
};

export const clearSites = () => (dispatch: AppDispatch) => {
  dispatch({ type: "CLEAR_SITES" });
};