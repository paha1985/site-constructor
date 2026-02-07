import { Site } from "./site.types";

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
export interface ConstructorState {
  site: Site | null;
  selectedComponentId: string | null;
  isPreviewMode: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  exporting: boolean;
  exportedCode: {
    html: string;
    css: string;
    siteName: string;
  } | null;
  lastExported: Date | null;
}
