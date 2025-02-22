import { ChangeEventHandler } from "react";

export interface TicketType {
  id: number | string;
  name: string;
  price: string;
  type: "REGULAR" | "VIP" | "VVIP";
  available: number;
  total: number;
}

export interface UserTicketData {
  userName: string;
  userEmail: string;
  ticketType: TicketType | null;
  ticketCount: number;
  profileImage: string | null;
  specialRequest: string;
  ticketId: string | number;
  eventId: string;
  eventName: string;
}

export interface TicketSelectionProps {
  event: Event | undefined;
  selectedTicket?: TicketType | null;
  onSelectTicket: (ticket: TicketType) => void;
  onNext: () => void;
  ticketCount: number;
  onChangeTicketCount: ChangeEventHandler<HTMLSelectElement>;
}

export interface AttendeeFormProps {
  event: Event | undefined;
  ticketData: UserTicketData;
  setTicketData: React.Dispatch<React.SetStateAction<UserTicketData>>;
  onBack: () => void;
  onSubmit: () => void;
}

export interface GeneratedTicketProps {
  ticketData: UserTicketData;
  onBookAnother: () => void;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  image: string;
  ticketsType: TicketType[];
  soldOut: boolean;
}
