import { FormEvent, useState } from "react";
import { Ticket, Event, TicketType } from "../../types";
import { sonnerStyle } from "../../utils/constants";
import { bookTicket } from "../../services/ticketServices";
import { Input } from "../ui/input";
import { TicketDetails } from "./TicketDetails";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { TicketIcon, User, Mail, CheckCircle } from "lucide-react";

interface BookingFormProps {
  event: Event | null;
  onSubmit: (ticket: Ticket) => Promise<void>;
}

export function BookingForm({ event, onSubmit }: BookingFormProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketType | null>(null);
  const [specialRequests, setSpecialRequests] = useState("");

  // Guest form fields (only for non-logged-in users)
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const handleTicketSelect = (ticketType: TicketType) => {
    setSelectedTicketType(ticketType);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!event?.id) {
      toast("Event not found", { style: sonnerStyle });
      return;
    }

    if (!selectedTicketType) {
      toast("Please select a ticket type", { style: sonnerStyle });
      return;
    }

    // Check if user is logged in
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/events/${event.id}`);
      return;
    }

    if (selectedTicketType.available <= 0) {
      toast("This ticket type is sold out", { style: sonnerStyle });
      return;
    }

    setIsLoading(true);
    try {
      const ticket = await bookTicket(
        {
          eventId: event.id,
          ticketTypeId: selectedTicketType.id,
          userId: user!.id,
          purchaseDate: new Date().toISOString(),
          ticketCode: "",
          isTransferred: false,
          transferredTo: "",
          specialRequests,
        },
        user!.id
      );
      toast("Ticket booked successfully!", { style: sonnerStyle });
      await onSubmit(ticket);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(`Error: ${error.message}`, { style: sonnerStyle });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="w-full md:w-1/2 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-primary-100/40">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-primary-100 rounded w-3/4" />
          <div className="h-24 bg-primary-100 rounded" />
          <div className="h-10 bg-primary-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-primary-100/40">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* User Info Section - Only show for logged-in users */}
        {isAuthenticated && user && (
          <div className="bg-primary-100/50 rounded-lg p-4 border border-secondary/20">
            <div className="flex items-center gap-3">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.firstname}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary" />
                </div>
              )}
              <div>
                <p className="text-white font-medium">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-secondary-100 text-sm">{user.email}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
            </div>
          </div>
        )}

        {/* Login Prompt for guests */}
        {!isAuthenticated && (
          <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/30">
            <p className="text-secondary text-sm mb-2">
              <strong>Already have an account?</strong>
            </p>
            <Link
              to={`/login?redirect=/events/${event.id}`}
              className="text-secondary underline hover:text-secondary-100 text-sm"
            >
              Log in for faster checkout
            </Link>
          </div>
        )}

        {/* Guest Details - Only for non-logged-in users */}
        {!isAuthenticated && (
          <div className="space-y-4">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              label="Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              hasLabel
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              label="Email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              hasLabel
            />
          </div>
        )}

        {/* Ticket Type Selection */}
        <div className="space-y-3">
          <label className="text-secondary font-medium block">
            Select Ticket Type
          </label>
          <div className="grid gap-3">
            {event.ticketTypes.map((ticketType) => (
              <motion.button
                key={ticketType.id}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleTicketSelect(ticketType)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedTicketType?.id === ticketType.id
                    ? "border-secondary bg-secondary/10"
                    : "border-primary-100 bg-primary-300 hover:border-secondary/50"
                } ${
                  ticketType.available <= 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={ticketType.available <= 0}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTicketType?.id === ticketType.id
                          ? "border-secondary bg-secondary"
                          : "border-secondary-100"
                      }`}
                    >
                      {selectedTicketType?.id === ticketType.id && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        {ticketType.name}
                      </h4>
                      <p className="text-secondary-100 text-sm">
                        {ticketType.type}
                      </p>
                      {ticketType.description && (
                        <p className="text-secondary-100 text-xs mt-1">
                          {ticketType.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary font-bold">
                      {ticketType.price === 0
                        ? "Free"
                        : `₦${ticketType.price.toLocaleString()}`}
                    </p>
                    <p className="text-secondary-100 text-xs">
                      {ticketType.available > 0
                        ? `${ticketType.available} left`
                        : "Sold out"}
                    </p>
                  </div>
                </div>
                {ticketType.benefits && ticketType.benefits.length > 0 && (
                  <div className="mt-2 pl-8">
                    <ul className="text-xs text-secondary-100 space-y-1">
                      {ticketType.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-secondary">•</span> {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected Ticket Summary */}
        {selectedTicketType && <TicketDetails ticket={selectedTicketType} />}

        {/* Special Requests - Optional */}
        <div>
          <label className="text-secondary text-sm" htmlFor="special-request">
            Special Requests (Optional)
          </label>
          <textarea
            name="special-request"
            id="special-request"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special requirements or notes..."
            className="mt-1 block w-full rounded-lg bg-primary-300 border outline-none p-3 text-white border-secondary-200/50 text-sm focus:border-secondary transition-colors"
            rows={2}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-secondary to-secondary-100 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading || !selectedTicketType}
        >
          {isLoading ? (
            <>
              <TicketIcon className="w-4 h-4 animate-bounce" />
              Processing...
            </>
          ) : isAuthenticated ? (
            <>
              <TicketIcon className="w-4 h-4" />
              {selectedTicketType?.price === 0 ? "Register Now" : "Book Ticket"}
            </>
          ) : (
            "Login to Book"
          )}
        </motion.button>

        {!isAuthenticated && (
          <p className="text-center text-secondary-100 text-xs">
            You'll be redirected to login before completing your booking
          </p>
        )}
      </form>
    </div>
  );
}
