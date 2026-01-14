import apiClient from "./apiClient";
import { AuthArgs, User } from "../types";

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
};

export const signup = async (userData: AuthArgs): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", {
    email: userData.email,
    password: userData.password,
    firstname: userData.firstname,
    lastname: userData.lastname,
  });
  return data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const { data } = await apiClient.post<{ accessToken: string }>(
    "/auth/refresh"
  );
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>("/auth/me");
  return data;
};

export const getUserData = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get<User>(`/users/${userId}`);
  return data;
};

export const updateUser = async (
  userId: string,
  updates: { field: string; value: unknown }[]
): Promise<{ success: boolean; updatedUser: User }> => {
  const updateFields = updates.reduce((acc, item) => {
    acc[item.field] = item.value;
    return acc;
  }, {} as Record<string, unknown>);

  const { data } = await apiClient.patch<User>(
    `/users/${userId}`,
    updateFields
  );
  return { success: true, updatedUser: data };
};

export const updateUserRole = async (
  userId: string,
  role: "USER" | "ORGANIZER" | "ADMIN"
): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/users/${userId}/role`, {
    role,
  });
  return data;
};

export const verifyEmail = async (token: string): Promise<void> => {
  await apiClient.post("/auth/verify-email", { token });
};

export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post("/auth/forgot-password", { email });
};

export const resetPassword = async (
  token: string,
  password: string
): Promise<void> => {
  await apiClient.post("/auth/reset-password", { token, password });
};

// OAuth URLs
export const getGoogleAuthUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${apiUrl}/auth/google`;
};

export const getGithubAuthUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${apiUrl}/auth/github`;
};
