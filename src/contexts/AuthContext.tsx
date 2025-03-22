import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthArgs, User } from "../types";
import { getUserData, login, logout, signup } from "../services/userServices";

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
  isLoading: true, // Start with loading true to show loading state on initial auth check
  error: null,
  clearError: () => {},
};

const AuthContext = createContext<AuthContextType>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialState.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [error, setError] = useState<AuthErrorType>(initialState.error);

  const clearError = () => setError(null);

  const setLocalstorageData = (data: { title: string; value: string }[]) => {
    data.forEach((item) => localStorage.setItem(item.title, item.value));
  };

  useEffect(() => {
    const checkAuthState = async () => {
      setIsLoading(true);
      try {
        const curUser = localStorage.getItem("curUser");
        const authState = localStorage.getItem("isAuthenticated");

        if (!curUser || !authState || authState !== "true") {
          await logout();
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        const user = await getUserData(curUser);

        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        } else {
          console.warn("User not found, logging out...");
          await logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    clearError();

    //Rechecking for stray-errors
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    try {
      setIsLoading(true);
      const user = await login(email, password);
      setUser(user);
      setIsAuthenticated(true);

      setLocalstorageData([
        { title: USER_KEY, value: user.id },
        { title: AUTHENTICATION_KEY, value: JSON.stringify(true) },
      ]);
    } catch (err) {
      let errorMessage = "Login failed";

      if (err instanceof Error) {
        // Handle common Firebase auth errors with user-friendly messages
        if (
          err.message.includes("user-not-found") ||
          err.message.includes("wrong-password")
        ) {
          errorMessage = "Invalid email or password";
        } else if (err.message.includes("too-many-requests")) {
          errorMessage =
            "Too many failed login attempts. Please try again later";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (userData: AuthArgs) => {
    clearError();

    // Revalidate user data
    if (!userData.email) {
      setError("Please enter your email");
      return;
    }
    if (!userData.password) {
      setError("Please enter a password");
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!userData.firstname || !userData.lastname) {
      setError("Please provide your full name");
      return;
    }

    try {
      setIsLoading(true);

      const newUser = await signup(userData);
      console.log(newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      setLocalstorageData([
        { title: USER_KEY, value: newUser.id },
        { title: AUTHENTICATION_KEY, value: JSON.stringify(true) },
      ]);
    } catch (err) {
      let errorMessage = "Signup failed";

      if (err instanceof Error) {
        // Handle common Firebase auth errors with user-friendly messages
        if (err.message.includes("email-already-in-use")) {
          errorMessage = "This email is already registered";
        } else if (err.message.includes("weak-password")) {
          errorMessage = "Password is too weak. Use at least 6 characters";
        } else if (err.message.includes("invalid-email")) {
          errorMessage = "Please provide a valid email address";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
      setIsAuthenticated(false);

      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(AUTHENTICATION_KEY);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
