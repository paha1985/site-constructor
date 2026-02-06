import { registration, signIn } from "../../services/userAPI";
import { LoginCredentials } from "../../types/user.types";
import { AppThunk } from "../index";

export interface User {
  id: number;
  email: string;
  login?: string;
  password?: string;
  firstName: string;
  lastName: string;
  role_id?: number;
  staff_id?: number;
}

export interface UserWithoutPassword {
  id: number;
  email: string;
  login?: string;
  firstName: string;
  lastName: string;
  role_id?: number;
  staff_id?: number;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequestAction {
  type: "LOGIN_REQUEST";
}

export interface LoginSuccessAction {
  type: "LOGIN_SUCCESS";
  payload: {
    user: UserWithoutPassword;
    token: string;
  };
}

export interface LoginFailureAction {
  type: "LOGIN_FAILURE";
  payload: string;
}

export interface RegisterRequestAction {
  type: "REGISTER_REQUEST";
}

export interface RegisterSuccessAction {
  type: "REGISTER_SUCCESS";
  payload: {
    user: UserWithoutPassword;
    token: string;
  };
}

export interface RegisterFailureAction {
  type: "REGISTER_FAILURE";
  payload: string;
}

export interface LogoutAction {
  type: "LOGOUT";
}

export interface ClearErrorAction {
  type: "CLEAR_ERROR";
}

export type AuthActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction
  | LogoutAction
  | ClearErrorAction;

type AppDispatch = any;

export const login =
  (credentials: LoginCredentials): AppThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      const decodedToken = await signIn(credentials);

      const userStr = localStorage.getItem("user");
      const user: UserWithoutPassword = userStr
        ? JSON.parse(userStr)
        : {
            id: decodedToken.id,
            email: decodedToken.email,
            firstName: "",
            lastName: "",
          };

      const token = localStorage.getItem("token") || "";

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user,
          token,
        },
      });
    } catch (error: unknown) {
      console.error("Login error:", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error instanceof Error ? error.message : "Неизвестная ошибка",
      });
    }
  };

export const register =
  (userData: RegisterData): AppThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: "REGISTER_REQUEST" });

    try {
      const decodedToken = await registration({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      const userStr = localStorage.getItem("user");
      const user: UserWithoutPassword = userStr
        ? JSON.parse(userStr)
        : {
            id: decodedToken.id,
            email: decodedToken.email,
            firstName: "",
            lastName: "",
          };

      const token = localStorage.getItem("token") || "";

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: {
          user,
          token,
        },
      });
    } catch (error: unknown) {
      dispatch({
        type: "REGISTER_FAILURE",
        payload: error instanceof Error ? error.message : "Неизвестная ошибка",
      });
    }
  };

export const logout = (): AppThunk => (dispatch: AppDispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({ type: "LOGOUT" });
};

export const loadUser = (): AppThunk => (dispatch: AppDispatch) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (token && userStr) {
    try {
      const user: UserWithoutPassword = JSON.parse(userStr);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user },
      });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
};

export const clearError = (): AppThunk => (dispatch: AppDispatch) => {
  dispatch({
    type: "CLEAR_ERROR",
  });
};
