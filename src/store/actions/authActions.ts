import { AppThunk } from '../index';

const mockUsers = [
  {
    id: 1,
    email: "test@test.com",
    password: "password123",
    firstName: "Иван",
    lastName: "Иванов",
  },
];

type AppDispatch = any;

export const login = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch({ type: "LOGIN_REQUEST" });

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: userWithoutPassword },
      });
    } else {
      throw new Error("Неверный email или пароль");
    }
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILURE",
      payload: error instanceof Error ? error.message : "Неизвестная ошибка",
    });
  }
};

export const register = (userData: any) => async (dispatch: AppDispatch) => {
  dispatch({ type: "REGISTER_REQUEST" });

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
    };

    mockUsers.push(newUser);
    const { password, ...userWithoutPassword } = newUser;

    localStorage.setItem("token", "mock-jwt-token");
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));

    dispatch({
      type: "REGISTER_SUCCESS",
      payload: { user: userWithoutPassword },
    });
  } catch (error) {
    dispatch({
      type: "REGISTER_FAILURE",
      payload: error instanceof Error ? error.message : "Неизвестная ошибка",
    });
  }
};

export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({ type: "LOGOUT" });
};

export const loadUser = () => (dispatch: AppDispatch) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (token && user) {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { user },
    });
  }
};

export const clearError = (): AppThunk => (dispatch) => {
  dispatch({
    type: "CLEAR_ERROR",
  });
};
