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
