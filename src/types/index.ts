export interface TicketType {
  id: number;
  name: string;
  price: string;
  type: "REGULAR" | "VIP" | "VVIP";
  available: number;
  total: number;
}

export interface UserTicketData {
  name: string;
  email: string;
  ticketType: TicketType | null;
  ticketCount: number;
  profileImage: string | null;
  specialRequest: string;
  ticketId: string;
}
