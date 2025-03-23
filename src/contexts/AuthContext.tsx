import { createContext, ReactNode, useContext, useState } from "react";
import { AuthArgs, User } from "../types";
import { getUserData, login, logout, signup } from "../services/userServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type AuthErrorType = string | null;

const USER_KEY = "curUser";
const AUTHENTICATION_KEY = "isAuthenticated";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignup: (user: AuthArgs) => Promise<void>;
  handleLogout: () => Promise<void>;
  isLoading: boolean;
  error: AuthErrorType;
  clearError: () => void;
}

const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  handleLogin: async () => {},
  handleSignup: async () => {},
  handleLogout: async () => {},
  isLoading: true,
  error: null,
  clearError: () => {},
};

const AuthContext = createContext<AuthContextType>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<AuthErrorType>(initialState.error);

  const clearError = () => setError(null);

  const setLocalstorageData = (data: { title: string; value: string }[]) => {
    data.forEach((item) => localStorage.setItem(item.title, item.value));
  };

  const { data: user = null, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const curUserId = localStorage.getItem(USER_KEY);
      const authState = localStorage.getItem(AUTHENTICATION_KEY);
      if (!curUserId || authState !== "true") {
        throw new Error("No authenticated user");
      }
      const userData = await getUserData(curUserId);
      if (!userData) throw new Error("User not found");
      return userData;
    },
    retry: false,
    staleTime: Infinity,
  });

  const isAuthenticated = !!user;

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (newUser: User) => {
      setLocalstorageData([
        { title: USER_KEY, value: newUser.id },
        { title: AUTHENTICATION_KEY, value: JSON.stringify(true) },
      ]);
      queryClient.setQueryData(["user"], newUser);
    },
    onError: (err: Error) => {
      let errorMessage = "Login failed";
      if (
        err.message.includes("user-not-found") ||
        err.message.includes("wrong-password")
      ) {
        errorMessage = "Invalid email or password";
      } else if (err.message.includes("too-many-requests")) {
        errorMessage = "Too many failed attempts. Try again later";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (userData: AuthArgs) => signup(userData),
    onSuccess: (newUser) => {
      setLocalstorageData([
        { title: USER_KEY, value: newUser.id },
        { title: AUTHENTICATION_KEY, value: JSON.stringify(true) },
      ]);
      queryClient.setQueryData(["user"], newUser);
    },
    onError: (err: Error) => {
      let errorMessage = "Signup failed";
      if (err.message.includes("email-already-in-use")) {
        errorMessage = "This email is already registered";
      } else if (err.message.includes("weak-password")) {
        errorMessage = "Password is too weak. Use at least 6 characters";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(AUTHENTICATION_KEY);
      queryClient.removeQueries({ queryKey: ["user"] });
    },
    onError: (err: Error) => setError(err.message || "Logout failed"),
  });

  const handleLogin = async (email: string, password: string) => {
    clearError();
    if (!email) return setError("Please enter your email");
    if (!password) return setError("Please enter your password");
    await loginMutation.mutateAsync({ email, password });
  };

  const handleSignup = async (userData: AuthArgs) => {
    clearError();
    if (!userData.email) return setError("Please enter your email");
    if (!userData.password) return setError("Please enter a password");
    if (userData.password !== userData.confirmPassword)
      return setError("Passwords do not match");
    if (!userData.firstname || !userData.lastname)
      return setError("Please provide your full name");
    await signupMutation.mutateAsync(userData);
  };

  const handleLogout = async () => {
    clearError();
    await logoutMutation.mutateAsync();
  };

  const isLoading =
    isUserLoading ||
    loginMutation.isPending ||
    signupMutation.isPending ||
    logoutMutation.isPending;

  const value = {
    user,
    isAuthenticated,
    handleLogin,
    handleSignup,
    handleLogout,
    isLoading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
