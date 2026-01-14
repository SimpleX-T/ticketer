import { createContext, ReactNode, useContext, useState } from "react";
import { AuthArgs, User } from "../types";
import {
  login,
  logout,
  signup,
  getCurrentUser,
  getGoogleAuthUrl,
  getGithubAuthUrl,
  AuthResponse,
} from "../services/userServices";
import { setAccessToken, getAccessToken } from "../services/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type AuthErrorType = string | null;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignup: (user: AuthArgs) => Promise<void>;
  handleLogout: () => Promise<void>;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  handleOAuthCallback: (accessToken: string) => Promise<void>;
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
  loginWithGoogle: () => {},
  loginWithGithub: () => {},
  handleOAuthCallback: async () => {},
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

  // Check for existing session on mount
  const { data: user = null, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Check if we have an access token
      const token = getAccessToken();
      if (!token) {
        // Try to refresh the token (the cookie will be sent automatically)
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
            }/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
            }
          );
          if (response.ok) {
            const data = await response.json();
            setAccessToken(data.accessToken);
          } else {
            throw new Error("No session");
          }
        } catch {
          throw new Error("No authenticated user");
        }
      }
      const userData = await getCurrentUser();
      return userData;
    },
    retry: false,
    staleTime: Infinity,
  });

  const isAuthenticated = !!user;

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data: AuthResponse) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (err: Error) => {
      let errorMessage = "Login failed";
      if (err.message.includes("Invalid") || err.message.includes("401")) {
        errorMessage = "Invalid email or password";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: (userData: AuthArgs) => signup(userData),
    onSuccess: (data: AuthResponse) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (err: Error) => {
      let errorMessage = "Signup failed";
      if (err.message.includes("already") || err.message.includes("409")) {
        errorMessage = "This email is already registered";
      } else if (
        err.message.includes("weak") ||
        err.message.includes("password")
      ) {
        errorMessage = "Password is too weak. Use at least 8 characters";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setAccessToken(null);
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

  // OAuth methods
  const loginWithGoogle = () => {
    window.location.href = getGoogleAuthUrl();
  };

  const loginWithGithub = () => {
    window.location.href = getGithubAuthUrl();
  };

  // Handle OAuth callback
  const handleOAuthCallback = async (accessToken: string) => {
    setAccessToken(accessToken);
    try {
      const userData = await getCurrentUser();
      queryClient.setQueryData(["user"], userData);
    } catch (err) {
      setError("Failed to get user data after OAuth login");
    }
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
    loginWithGoogle,
    loginWithGithub,
    handleOAuthCallback,
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
