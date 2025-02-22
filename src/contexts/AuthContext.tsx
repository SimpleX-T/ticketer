import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
// import { generateRandomId } from "../utils/helpers";
import { User } from "../types";
import { mockUsers } from "../utils/constants";

interface AuthError {
  login?: { message: string };
  signup?: { message: string };
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  handleLogin: (email: string, password: string) => void;
  isLoading: boolean;
  error: AuthError;
  setError: (error: AuthError) => void;
}

const initialState: AuthContextType = {
  user: {
    id: "",
    firstname: "",
    lastname: "",
    email: "",
  },
  isAuthenticated: false,
  handleLogin: () => {},
  isLoading: false,
  error: {
    login: { message: "" },
    signup: { message: "" },
  },
  setError: () => {},
};

const AuthContext = createContext<AuthContextType>(initialState);

interface AppProviderProps {
  children: ReactNode;
}

const USER_KEY = "currUser";
const AUTHENTICATED_KEY = "userIsAuthenticated";

const AuthProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User>(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialState.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [error, setError] = useState<AuthError>(initialState.error);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem(AUTHENTICATED_KEY);
    if (!isAuthenticated) return;

    const user = localStorage.getItem(USER_KEY) || "";
    if (!user) return;
    setUser(JSON.parse(user));
    setIsAuthenticated(Boolean(localStorage.getItem(AUTHENTICATED_KEY)));
  }, []);

  const handleLogin = async (email: string, password: string) => {
    console.log(email, password);
    setError({ login: { message: "" } });
    if (!password)
      return setError({ login: { message: "Please input your password" } });

    setIsLoading(true);
    const user = mockUsers.find((user) => user.email === email);
    console.log(user);
    if (!user) {
      setError({
        login: {
          message:
            "User with email not found, make sure the email is registered on our system.",
        },
      });
      return setIsLoading(false);
    }

    setTimeout(() => {
      // simulating a promise
      setUser(user);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(AUTHENTICATED_KEY, "true");
      setIsLoading(false);
    }, 1000);
  };

  const value = {
    user,
    isAuthenticated,
    handleLogin,
    isLoading,
    error,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AppProvider");
  }
  return context;
}

export { AuthProvider, useAuthContext };
