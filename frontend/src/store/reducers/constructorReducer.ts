import { ConstructorState } from "../../types";

const initialState: ConstructorState = {
  site: null,
  selectedComponentId: null,
  isPreviewMode: false,
  loading: false,
  saving: false,
  error: null,
  lastSaved: null,
  autoSaveEnabled: true,
};

type ConstructorAction =
  | { type: "LOAD_SITE_REQUEST" }
  | { type: "LOAD_SITE_SUCCESS"; payload: any }
  | { type: "LOAD_SITE_FAILURE"; payload: string }
  | { type: "ADD_COMPONENT_SUCCESS"; payload: any }
  | { type: "ADD_COMPONENT_FAILURE"; payload: string }
  | {
      type: "UPDATE_COMPONENT_OPTIMISTIC";
      payload: { componentId: string; props: any };
    }
  | { type: "UPDATE_COMPONENT_SUCCESS"; payload: any }
  | {
      type: "UPDATE_COMPONENT_FAILURE";
      payload: { componentId: string; originalProps: any; error: string };
    }
  | { type: "DELETE_COMPONENT_OPTIMISTIC"; payload: string }
  | { type: "DELETE_COMPONENT_SUCCESS"; payload: string }
  | {
      type: "DELETE_COMPONENT_FAILURE";
      payload: { componentId: string; error: string };
    }
  | { type: "UPDATE_COMPONENTS_ORDER_OPTIMISTIC"; payload: (string | number)[] }
  | { type: "UPDATE_COMPONENTS_ORDER_SUCCESS" }
  | { type: "UPDATE_COMPONENTS_ORDER_FAILURE"; payload: string }
  | { type: "SAVE_SITE_SETTINGS_REQUEST" }
  | { type: "SAVE_SITE_SETTINGS_SUCCESS"; payload: any }
  | { type: "SAVE_SITE_SETTINGS_FAILURE"; payload: string }
  | { type: "CREATE_PREVIEW_REQUEST" }
  | { type: "CREATE_PREVIEW_SUCCESS"; payload: string }
  | { type: "CREATE_PREVIEW_FAILURE"; payload: string }
  | { type: "SELECT_COMPONENT"; payload: string | null }
  | { type: "TOGGLE_PREVIEW_MODE" }
  | { type: "ENABLE_AUTO_SAVE" }
  | { type: "DISABLE_AUTO_SAVE" }
  | { type: "SET_LAST_SAVED"; payload: Date }
  | { type: "CREATE_NEW_SITE" }
  | { type: "CREATE_NEW_SITE_SUCCESS"; payload: any }
  | { type: "UPDATE_SITE_NAME_REQUEST" }
  | { type: "UPDATE_SITE_NAME_SUCCESS"; payload: any }
  | { type: "UPDATE_SITE_NAME_FAIL"; payload: any };

const constructorReducer = (
  state = initialState,
  action: ConstructorAction,
): ConstructorState => {
  switch (action.type) {
    case "CREATE_NEW_SITE":
      return {
        ...state,
        loading: true,
      };

    case "CREATE_NEW_SITE_SUCCESS":
      return {
        ...state,
        loading: false,
        site: action.payload,
      };
    case "LOAD_SITE_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOAD_SITE_SUCCESS":
      return {
        ...state,
        loading: false,
        site: action.payload,
        error: null,
      };

    case "LOAD_SITE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "ADD_COMPONENT_SUCCESS":
      if (!state.site) return state;

      return {
        ...state,
        site: {
          ...state.site,
          components: [...(state.site.components || []), action.payload],
        },
      };

    case "UPDATE_COMPONENT_OPTIMISTIC":
      if (!state.site || !state.site.components) return state;

      return {
        ...state,
        site: {
          ...state.site,
          components: state.site.components.map((comp) =>
            comp.id === action.payload.componentId
              ? { ...comp, props: { ...comp.props, ...action.payload.props } }
              : comp,
          ),
        },
      };

    case "UPDATE_COMPONENT_SUCCESS":
      if (!state.site || !state.site.components) return state;

      return {
        ...state,
        site: {
          ...state.site,
          components: state.site.components.map((comp) =>
            comp.id === action.payload.id ? action.payload : comp,
          ),
        },
      };

    case "UPDATE_COMPONENT_FAILURE":
      if (!state.site || !state.site.components) return state;

      return {
        ...state,
        site: {
          ...state.site,
          components: state.site.components.map((comp) =>
            comp.id === action.payload.componentId
              ? { ...comp, props: action.payload.originalProps }
              : comp,
          ),
        },
        error: action.payload.error,
      };

    case "DELETE_COMPONENT_OPTIMISTIC":
      if (!state.site || !state.site.components) return state;

      return {
        ...state,
        site: {
          ...state.site,
          components: state.site.components.filter(
            (comp) => comp.id !== action.payload,
          ),
        },
        selectedComponentId:
          state.selectedComponentId === action.payload
            ? null
            : state.selectedComponentId,
      };

    case "DELETE_COMPONENT_FAILURE":
      return {
        ...state,
        error: action.payload.error,
      };

    case "UPDATE_COMPONENTS_ORDER_OPTIMISTIC":
      if (!state.site || !state.site.components) return state;

      const orderedComponents = [...action.payload]
        .map((id) => state.site!.components!.find((c) => c.id === id))
        .filter(Boolean) as any[];

      const remainingComponents = state.site.components.filter(
        (c: any) => !action.payload.includes(c.id),
      );

      return {
        ...state,
        site: {
          ...state.site,
          components: [...orderedComponents, ...remainingComponents],
        },
      };

    case "SAVE_SITE_SETTINGS_REQUEST":
      return {
        ...state,
        saving: true,
      };

    case "SAVE_SITE_SETTINGS_SUCCESS":
      if (!state.site) return state;

      return {
        ...state,
        saving: false,
        site: {
          ...state.site,
          settings: action.payload,
        },
        lastSaved: new Date(),
      };

    case "SAVE_SITE_SETTINGS_FAILURE":
      return {
        ...state,
        saving: false,
        error: action.payload,
      };

    case "UPDATE_SITE_NAME_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "UPDATE_SITE_NAME_SUCCESS":
      if (!state.site) return state;
      return {
        ...state,
        loading: false,
        site: {
          ...state.site,
          name: action.payload,
        },
      };

    case "UPDATE_SITE_NAME_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CREATE_PREVIEW_SUCCESS":
      if (!state.site) return state;

      return {
        ...state,
        site: {
          ...state.site,
          preview: action.payload,
        },
      };

    case "CREATE_PREVIEW_FAILURE":
      return {
        ...state,
        error: action.payload,
      };

    case "SELECT_COMPONENT":
      return {
        ...state,
        selectedComponentId: action.payload,
      };

    case "TOGGLE_PREVIEW_MODE":
      return {
        ...state,
        isPreviewMode: !state.isPreviewMode,
        selectedComponentId: null,
      };

    case "SET_LAST_SAVED":
      return {
        ...state,
        lastSaved: action.payload,
      };

    default:
      return state;
  }
};

export default constructorReducer;
