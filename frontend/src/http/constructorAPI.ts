import { $authHost } from "./index";

export interface SiteComponent {
  id: string | number;
  type: string;
  props: any;
  sortOrder?: number;
}

export interface FullSite {
  site_id: string | number;
  name: string;
  description?: string;
  settings: any;
  preview?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  components: SiteComponent[];
}

export const fetchFullSite = async (
  siteId: string | number,
): Promise<FullSite> => {
  console.log("Ищем сайт по id:", siteId);
  console.log("Current token:", localStorage.getItem("token"));

  try {
    const { data } = await $authHost.get<FullSite>(`api/site/${siteId}/full`);
    console.log("Site data received:", data);
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching site:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const addComponent = async (
  siteId: string | number,
  type: string,
  props: any = {},
): Promise<SiteComponent> => {
  const { data } = await $authHost.post<SiteComponent>(
    `api/site/${siteId}/components`,
    { type, props },
  );
  return data;
};

export const updateComponent = async (
  siteId: string | number,
  componentId: string | number,
  props: any,
): Promise<SiteComponent> => {
  const { data } = await $authHost.put<SiteComponent>(
    `api/site/${siteId}/components/${componentId}`,
    { props },
  );
  return data;
};

export const deleteComponent = async (
  siteId: string | number,
  componentId: string | number,
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await $authHost.delete<{
    success: boolean;
    message?: string;
  }>(`api/site/${siteId}/components/${componentId}`);
  return data;
};

export const updateComponentsOrder = async (
  siteId: string | number,
  order: (string | number)[],
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await $authHost.put<{ success: boolean; message?: string }>(
    `api/site/${siteId}/components-order`,
    { order },
  );
  return data;
};

export const saveSite = async (
  siteId: string | number,
  siteData: Partial<FullSite>,
): Promise<FullSite> => {
  const { data } = await $authHost.put<FullSite>(
    `api/site/${siteId}`,
    siteData,
  );
  return data;
};

export const generatePreview = async (
  siteId: string | number,
  htmlContent: string,
): Promise<{ previewUrl: string }> => {
  const { data } = await $authHost.post<{ previewUrl: string }>(
    `api/site/${siteId}/preview`,
    { htmlContent },
  );
  return data;
};
