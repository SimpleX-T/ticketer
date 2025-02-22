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
};

const AuthContext = createContext<AuthContextType>(initialState);

interface AppProviderProps {
  children: ReactNode;
}

const USER_KEY = "currUser";
const AUTHENTICATED_KEY = "userIsAuthenticated";

const AuthProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User>(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem(AUTHENTICATED_KEY) === "true"
  );
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [error, setError] = useState<AuthError>(initialState.error);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "");
    if (!user) return setIsAuthenticated(false);
    setUser(JSON.parse(user));
  }, []);

  const handleLogin = async (email: string, password: string) => {
    console.log(email, password);
    setError({ login: { message: "" } });
    if (!password)
      return setError({ login: { message: "Please input your password" } });

    setIsLoading(true);
    const user = mockUsers.find((user) => user.email === email);

    if (!user)
      return setError({
        login: {
          message:
            "User with email not found, make sure the email is registered on our system.",
        },
      });

    setTimeout(() => {
      // simulating a promise
      setUser(user);
      setIsLoading(false);
    }, 1000);
  };

  const value = {
    user,
    isAuthenticated,
    handleLogin,
    isLoading,
    error,
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
