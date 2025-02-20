import { createContext, ReactNode, useContext, useState } from "react";

interface UserTicket {
  id: string;
  name: string;
  price: string;
  type: "REGULAR" | "VIP" | "VVIP";
  eventName: string;
  eventId: string;
  total: number;
}

interface AppContextType {
  userTickets: UserTicket[];
  addTicket: (ticket: UserTicket) => void;
  removeTicket: (id: string) => void;
}

const initialState: AppContextType = {
  userTickets: [],
  addTicket: () => {},
  removeTicket: () => {},
};

const AppContext = createContext<AppContextType>(initialState);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);

  const addTicket = (ticket: UserTicket) => {
    setUserTickets([...userTickets, ticket]);
  };

  const removeTicket = (id: string) => {
    setUserTickets(userTickets.filter((ticket) => ticket.id !== id));
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
