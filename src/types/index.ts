import { ChangeEventHandler } from "react";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role?: "admin" | "user" | "organizer";
  profileImage?: string | null;
  createdAt: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  type: string;
  available: number;
  total: number;
  description?: string;
  benefits?: string[];
}

export interface Ticket {
  id: string;
  ticketTypeId: string;
  eventId: string;
  userId: string;
  purchaseDate: string;
  status: TicketStatus;
  price: number;
  ticketCode: string;
  isTransferred: boolean;
  transferredTo?: string;
  specialRequests?: string;
}

export enum TicketStatus {
  RESERVED = "RESERVED",
  PURCHASED = "PURCHASED",
  USED = "USED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
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
  ticketData: Ticket;
  setTicketData: React.Dispatch<React.SetStateAction<Ticket>>;
  onBack: () => void;
  onSubmit: () => void;
}

export interface GeneratedTicketProps {
  ticketData: Ticket;
  onBookAnother?: () => void;
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  image: string;
  ticketTypes: TicketType[];
  soldOut: boolean;
  organizerId: string;
  createdAt: string;
  maxTicketsPerUser: number;
  category: string;
  status: EventStatus;
  totalCapacity: number;
  ticketsSold: number;
}

export interface AuthArgs {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
}

export interface TicketPurchaseData {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  specialRequests?: string;
  userId: string;
}
