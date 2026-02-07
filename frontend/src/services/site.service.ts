import { CreateSiteData, SitesResponse } from "../types/site.types";
import { $authHost } from "../http/index";
import { Site } from "@/types";

export const fetchSites = async (
  page = 1,
  search = "",
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
): Promise<SitesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
    ...(search && { search }),
    sortBy,
    sortOrder,
  });

  const { data } = await $authHost.get<SitesResponse>(`api/site?${params}`);
  return data;
};

export const createSite = async (siteData: CreateSiteData): Promise<Site> => {
  const { data } = await $authHost.post<Site>("api/site", siteData);
  return data;
};

export const deleteSite = async (
  siteId: string | number,
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await $authHost.delete<{
    success: boolean;
    message?: string;
  }>(`api/site/${siteId}`);
  return data;
};

export const updateSite = async (
  siteId: string | number,
  siteData: Partial<CreateSiteData>,
): Promise<Site> => {
  const { data } = await $authHost.put<Site>(`api/site/${siteId}`, siteData);
  return data;
};

export const setSitePreview = async (
  siteId: string | number,
  previewUrl: string,
): Promise<{ previewUrl: string }> => {
  const { data } = await $authHost.post<{ previewUrl: string }>(
    `api/site/${siteId}/preview`,
    { previewUrl },
  );
  return data;
};
