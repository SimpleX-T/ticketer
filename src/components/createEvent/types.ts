import { EventStatus, TicketType } from "../../types";

export interface EventFormState {
  name: string;
  date: string;
  location: string;
  description: string;
  category: string;
  maxTicketsPerUser: number;
  imageFile: File | null;
  imageUrl: string;
  status: EventStatus;
}

export interface EventCreationProps {
  isModal?: boolean;
  onClose?: () => void;
  userId: string; // Organizer ID
}

export interface TicketFormState {
  ticketTypes: TicketType[];
  setTicketTypes: React.Dispatch<React.SetStateAction<TicketType[]>>;
}
