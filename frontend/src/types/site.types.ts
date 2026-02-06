export interface Site {
  site_id: string | number;
  name: string;
  description?: string;
  preview?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  settings?: any;
}

export interface SitesResponse {
  sites: Site[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CreateSiteData {
  name: string;
  description?: string;
  settings?: any;
  status?: "draft" | "published" | "archived";
}
