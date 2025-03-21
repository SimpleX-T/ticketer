export interface User {
  id: string;
  firstname: string;
  lastname: string;
  displayName?: string;
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
  ticketCode: string;
  isTransferred: boolean;
  transferredTo?: string;
  specialRequests?: string;
}

export interface TicketSelectionProps {
  event: Event | null;
  selectedTicket?: string | null;
  onSelectTicket: (id: string) => void;
  onNext: () => void;
}

export interface AttendeeFormProps {
  event: Event | null;
  ticketData: Omit<Ticket, "id">;
  setTicketData: React.Dispatch<React.SetStateAction<Omit<Ticket, "id">>>;
  onBack: () => void;
  onSubmit: () => void;
}

export interface GeneratedTicketProps {
  ticketData: Omit<Ticket, "id">;
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
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image: string;
  ticketTypes: TicketType[];
  soldOut: boolean;
  organizerId: string;
  createdAt: string;
  maxTicketsPerUser: number;
  category: string;
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
