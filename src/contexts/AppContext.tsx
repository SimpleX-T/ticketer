import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserTicketData } from "../types";

interface AppContextType {
  userTickets: UserTicketData[];
  addTicket: (ticket: UserTicketData) => void;
  removeTicket: (id: string) => void;
}

const initialState: AppContextType = {
  userTickets: [],
  addTicket: () => () => {},
  removeTicket: () => {},
};

const AppContext = createContext<AppContextType>(initialState);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [userTickets, setUserTickets] = useState<UserTicketData[]>([]);

  const addTicket = (ticket: UserTicketData) => () => {
    console.log("Adding ticket: ", ticket);
    setUserTickets((prev) => [...prev, ticket]);
  };

  useEffect(() => {
    console.log("User Tickets: ", userTickets);
  }, [userTickets]);

  const removeTicket = (id: string) => {
    setUserTickets(userTickets.filter((ticket) => ticket.ticketId !== id));
  };

  const value: AppContextType = {
    userTickets,
    addTicket,
    removeTicket,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export { AppProvider, useAppContext };
