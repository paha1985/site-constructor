
import { UpdateUserData } from "../../types";
import { AppDispatch, RootState } from "../index";

export const updateUser = (userData: UpdateUserData) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch({ type: "UPDATE_USER_REQUEST" });

  try {
    // Имитация запроса к серверу - как у вас
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Обновляем данные в localStorage
    const currentUser = getState().auth.user;
    if (!currentUser) {
      throw new Error("Пользователь не найден");
    }

    const updatedUser = {
      ...currentUser,
      ...userData,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    dispatch({
      type: "UPDATE_USER_SUCCESS",
      payload: updatedUser,
    });

    // Также обновляем в auth reducer
    dispatch({
      type: "UPDATE_AUTH_USER",
      payload: updatedUser,
    });
  } catch (error) {
    dispatch({
      type: "UPDATE_USER_FAILURE",
      payload: error instanceof Error ? error.message : "Ошибка обновления профиля",
    });
    throw error;
  }
};

export const loadUserProfile = () => async (dispatch: AppDispatch) => {
  dispatch({ type: "LOAD_USER_PROFILE_REQUEST" });

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Получаем данные пользователя из localStorage или API
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user) {
      // Добавляем доп. данные как у вас
      const userWithStats = {
        ...user,
        siteCount: user.siteCount || 0,
        createdAt: user.createdAt || new Date().toISOString(),
      };

      dispatch({
        type: "LOAD_USER_PROFILE_SUCCESS",
        payload: userWithStats,
      });
    } else {
      throw new Error("Пользователь не найден");
    }
  } catch (error) {
    dispatch({
      type: "LOAD_USER_PROFILE_FAILURE",
      payload: error instanceof Error ? error.message : "Ошибка загрузки профиля",
    });
  }
};

export const clearUserError = () => (dispatch: AppDispatch) => {
  dispatch({ type: "CLEAR_USER_ERROR" });
};