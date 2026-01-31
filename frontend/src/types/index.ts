export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  siteCount?: number;
}

export interface UserProfile extends User {
  siteCount: number;
  lastLogin?: string;
}

export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProfileFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Site {
  id: string | number;
  name: string;
  description?: string;
  preview?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  settings?: SiteSettings;
  components?: Component[];
}

export interface SitesState {
  sites: Site[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  total: number;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface SiteSettings {
  backgroundColor: string;
  fontFamily: string;
  maxWidth: string;
  margin: string;
}

export interface ConstructorState {
  site: Site;
  selectedComponentId: string | null;
  isPreviewMode: boolean;
  loading: boolean;
  error: string | null;
}

export interface ComponentProps {
  text?: string;
  level?: number;
  src?: string;
  alt?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface UpdateComponentAction {
  type: "UPDATE_COMPONENT";
  payload: { id: string; props: ComponentProps };
}

export type ComponentType =
  | "header"
  | "paragraph"
  | "button"
  | "image"
  | "divider";
