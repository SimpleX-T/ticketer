import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../services/firebase";
import { AuthArgs, User } from "../types";
import { getCurrentUser, onAuthStateChanged } from "../hooks/useFirebaseAuth";
import { login, logout, signup } from "../services/userServices";

type AuthErrorType = string | null;

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

  // Listen for Firebase auth state changes
  useEffect(() => {
    clearError();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      try {
        if (firebaseUser) {
          const userData = await getCurrentUser(firebaseUser);

          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // User exists in Firebase Auth but not in Firestore
            await logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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
      // setUser(newUser as User);
      // setIsAuthenticated(true);
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
