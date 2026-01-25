import { SitesState } from "../../types";

const initialState: SitesState = {
  sites: [],
  loading: false,
  error: null,
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

type SitesAction = 
  | { type: 'FETCH_SITES_REQUEST' }
  | { type: 'FETCH_SITES_SUCCESS'; payload: { sites: any[], page: number, hasMore: boolean, total: number } }
  | { type: 'FETCH_SITES_FAILURE'; payload: string }
  | { type: 'DELETE_SITE_REQUEST' }
  | { type: 'DELETE_SITE_SUCCESS'; payload: string | number }
  | { type: 'DELETE_SITE_FAILURE'; payload: string }
  | { type: 'CREATE_SITE_REQUEST' }
  | { type: 'CREATE_SITE_SUCCESS'; payload: any }
  | { type: 'CREATE_SITE_FAILURE'; payload: string }
  | { type: 'UPDATE_SITE_REQUEST' }
  | { type: 'UPDATE_SITE_SUCCESS'; payload: any }
  | { type: 'UPDATE_SITE_FAILURE'; payload: string }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_SORT'; payload: { sortBy: string, sortOrder: 'asc' | 'desc' } }
  | { type: 'CLEAR_SITES' };

const siteReducer = (state = initialState, action: SitesAction): SitesState => {
  switch (action.type) {
    case "FETCH_SITES_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_SITES_SUCCESS":
      return {
        ...state,
        loading: false,
        sites: action.payload.sites
      };

    case "FETCH_SITES_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "DELETE_SITE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "DELETE_SITE_SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "DELETE_SITE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CREATE_SITE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "CREATE_SITE_SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "CREATE_SITE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "UPDATE_SITE_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "UPDATE_SITE_SUCCESS":
      return {
        ...state,
        loading: false,
        sites: state.sites.map((site) =>
          site.id === action.payload.id ? action.payload : site
        ),
      };

    case "UPDATE_SITE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

          case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,        
      };

      case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
      };

    default:
      return state;
  }
};

export default siteReducer;