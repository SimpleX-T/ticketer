import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Ticket } from "../types";

interface AppContextType {
  userTickets: Ticket[];
  addTicket: (ticket: Ticket) => SetStateAction<void>;
  deleteTicket: (id: string | number) => void;
}

const initialState: AppContextType = {
  userTickets: [],
  addTicket: () => () => {},
  deleteTicket: () => {},
};

const AppContext = createContext<AppContextType>(initialState);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [userTickets, setUserTickets] = useState<Ticket[]>(() =>
    JSON.parse(localStorage.getItem("userTickets") || "[]")
  );

  const addTicket = (ticket: Ticket) => {
    setUserTickets((prev) => [...prev, ticket]);
    localStorage.setItem(
      "userTickets",
      JSON.stringify([...userTickets, ticket])
    );
  };

  const deleteTicket = (ticketId: string | number) => {
    const newTickets = userTickets.filter((el) => el.id !== ticketId);
    setUserTickets(newTickets);
    localStorage.setItem("userTickets", JSON.stringify(newTickets));
  };

  const value: AppContextType = {
    userTickets,
    addTicket,
    deleteTicket,
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
