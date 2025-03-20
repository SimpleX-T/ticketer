import { AuthArgs, User } from "../types";
import { supabase } from "./supabaseClient";

export const login = async (email: string, password: string) => {
  if (!email || !password) throw new Error("Email and password are required");

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw new Error(error.message);

  const userData = await getUserData(data.user?.id || "");

  return userData;
};

export const signup = async (userData: AuthArgs) => {
  if (!userData.email || !userData.password)
    throw new Error("Email and password are required");

  const { data: newUser, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (error) throw new Error(error.message);

  await createNewUser(userData, newUser.user?.id || "");
  const data = await getUserData(newUser.user?.id || "");

  return data;
};

const createNewUser = async (userData: AuthArgs, userId: string) => {
  if (!userId) throw new Error("User ID is required");
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      id: userId,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      profileImage: "",
      role: "user",
      createdAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return newUser;
};

export const getUserData = async (userId: string): Promise<User> => {
  if (!userId) throw new Error("User ID is required");
  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw console.warn(error);

  return userData;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const updateUser = async (
  userId: string,
  data: { field: string; value: unknown }[]
) => {
  try {
    const updates = data.map(async (item) => {
      const { error } = await supabase
        .from("users")
        .update({ [item.field]: item.value })
        .eq("id", userId);

      if (error) throw error;
    });

    await Promise.all(updates);
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error };
  }
};
