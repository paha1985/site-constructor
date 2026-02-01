import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: number;
  login: string;
  role_id: number;
  staff_id?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserData {
  role_id: number;
}

export interface DecodedToken {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

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
  console.log(data);
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

  // Обновляем пользователя в localStorage
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
