import { AuthActionTypes, UserWithoutPassword } from "../actions/authActions";

export interface AuthState {
  user: UserWithoutPassword | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
}

const getInitialUser = (): AuthState["user"] => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const getInitialToken = (): string | null => {
  return localStorage.getItem("token");
};

const initialState: AuthState = {
  user: getInitialUser(),
  loading: false,
  error: null,
  isAuthenticated: !!getInitialToken(),
  token: getInitialToken(),
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes,
): AuthState => {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "REGISTER_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      console.log("Setting isAuthenticated to true");
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        ...state,
        loading: false,
        user: null,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        error: null,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
