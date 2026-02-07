import {
  RegistrationCredentials,
  DecodedToken,
  AuthResponse,
  LoginCredentials,
  User,
  UpdateUserData,
  UpdateProfileData,
} from "../types/user.types";
import { $authHost, $host } from "../http";
import { jwtDecode } from "jwt-decode";

export const registration = async (
  credentials: RegistrationCredentials,
): Promise<DecodedToken> => {
  const { data } = await $host.post<AuthResponse>(
    "api/user/registration",
    credentials,
  );
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return jwtDecode<DecodedToken>(data.token);
};

export const signIn = async (
  credentials: LoginCredentials,
): Promise<DecodedToken> => {
  const { data } = await $host.post<AuthResponse>(
    "api/user/login",
    credentials,
  );
  console.log("Ответ на логин:", data);

  if (!data.token) {
    throw new Error("Токен не получен от сервера");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return jwtDecode<DecodedToken>(data.token);
};

export const check = async (): Promise<DecodedToken> => {
  const { data } = await $authHost.get<AuthResponse>("api/user/auth");
  localStorage.setItem("token", data.token);
  return jwtDecode<DecodedToken>(data.token);
};

export const getUsers = async (): Promise<User[]> => {
  const { data } = await $host.get<User[]>("api/user");
  return data;
};

export const updateUser = async (
  role_id: number,
  user_id: number,
): Promise<User> => {
  const updateData: UpdateUserData = { role_id };
  const { data } = await $authHost.patch<User>(
    `api/user/${user_id}`,
    updateData,
  );
  return data;
};

export const removeUser = async (
  id: number,
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await $host.delete<{ success: boolean; message?: string }>(
    `api/user/${id}`,
  );
  return data;
};

export const updateProfile = async (
  profileData: UpdateProfileData,
): Promise<User> => {
  const { data } = await $authHost.patch<User>(`api/user/profile`, profileData);

  const currentUserStr = localStorage.getItem("user");
  if (currentUserStr) {
    const currentUser = JSON.parse(currentUserStr);
    const updatedUser = {
      ...currentUser,
      ...data,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  return data;
};
