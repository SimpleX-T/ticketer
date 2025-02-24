import { useState } from "react";
import { TicketType } from "../../types";

interface EventFormState {
  name: string;
  date: string;
  location: string;
  description: string;
  imageFile: File | null;
  imageUrl: string;
}

const CreateEvent = () => {
  const [eventForm, setEventForm] = useState<EventFormState>({
    name: "",
    date: "",
    location: "",
    description: "",
    imageFile: null,
    imageUrl: "",
  });

  const [tickets, setTickets] = useState<TicketType[]>([]);

  // Add a new ticket with default values
  const addTicket = () => {
    const newTicket: TicketType = {
      id: Date.now().toString(), // In production, consider using a UUID generator
      name: "",
      price: 0,
      type: "REGULAR",
      available: 0,
      total: 0,
    };
    setTickets((prevTickets) => [...prevTickets, newTicket]);
  };

  // Remove a ticket by its id
  const removeTicket = (id: string | number) => {
    setTickets((prevTickets) =>
      prevTickets.filter((ticket) => ticket.id !== id)
    );
  };

  // Handle changes for a specific ticket field
  const handleTicketChange = (
    index: number,
    field: keyof TicketType,
    value: any
  ) => {
    setTickets((prevTickets) => {
      const updatedTickets = [...prevTickets];
      updatedTickets[index] = { ...updatedTickets[index], [field]: value };
      return updatedTickets;
    });
  };

  // Handle changes for event form fields (except file input)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes separately
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setEventForm((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  // On form submission, combine the event and ticket data
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Choose image from file input or URL if provided
    const finalImage = eventForm.imageFile || eventForm.imageUrl;
    const newEvent = {
      id: Date.now().toString(),
      ...eventForm,
      image: finalImage,
      tickets,
      soldOut: false,
      createdAt: new Date().toISOString(),
    };

    console.log(newEvent);
    // TODO: Add further processing or API calls here
  };

  // Inline component for ticket inputs
  const TicketItem = ({
    ticket,
    index,
  }: {
    ticket: TicketType;
    index: number;
  }) => {
    return (
      <div className="space-y-2 border p-4 rounded-md">
        <input
          type="text"
          placeholder="Ticket Name"
          required
          value={ticket.name}
          onChange={(e) => handleTicketChange(index, "name", e.target.value)}
          className="w-full px-4 py-2 border border-secondary-100 rounded-md focus:outline-none focus:ring focus:border-secondary-300 text-secondary placeholder:text-secondary-100 text-sm"
        />
        <input
          type="number"
          placeholder="Price"
          required
          value={ticket.price}
          onChange={(e) =>
            handleTicketChange(index, "price", parseFloat(e.target.value))
          }
          className="w-full px-4 py-2 border border-secondary-100 rounded-md focus:outline-none focus:ring focus:border-secondary-300 text-secondary placeholder:text-secondary-100 text-sm"
        />
        <select
          value={ticket.type}
          onChange={(e) =>
            handleTicketChange(
              index,
              "type",
              e.target.value as TicketType["type"]
            )
          }
          className="w-full px-4 py-2 border border-secondary-100 rounded-md focus:outline-none focus:ring focus:border-secondary-300 text-secondary placeholder:text-secondary-100 text-sm"
        >
          <option value="REGULAR">Regular</option>
          <option value="VIP">VIP</option>
          <option value="VVIP">VVIP</option>
        </select>
        <input
          type="number"
          placeholder="Available Tickets"
          required
          value={ticket.available}
          onChange={(e) => {
            const available = parseInt(e.target.value);
            // Update both available and total tickets to keep them in sync
            handleTicketChange(index, "available", available);
            handleTicketChange(index, "total", available);
          }}
          className="w-full px-4 py-2 border border-secondary-100 rounded-md focus:outline-none focus:ring focus:border-secondary-300 text-secondary placeholder:text-secondary-100 text-sm"
        />
        <button
          type="button"
          onClick={() => removeTicket(ticket.id)}
          className="text-red-500 hover:text-red-700 transition"
        >
          Remove
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-secondary-100 to-primary">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-secondary-300 border border-secondary rounded-lg shadow-lg space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          required
          value={eventForm.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-secondary-100 rounded-md focus:outline-none focus:ring focus:border-secondary-300 text-secondary placeholder:text-secondary-100 text-sm"
        />
        <input
          type="datetime-local"
          name="date"
          required
          value={eventForm.date}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-secondary-100 rounded-md focus:outline-none focus:ring focus:border-secondary-300 text-secondary placeholder:text-secondary-100 text-sm"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          required
          value={eventForm.location}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-secondary-100 rounded-md focus:outline-none focus:ring focus:border-secondary-300 text-secondary placeholder:text-secondary-100 text-sm"
        />
        <textarea
          name="description"
          placeholder="Event Description"
          required
          value={eventForm.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-secondary-100 rounded-md focus:outline-none focus:ring focus:border-secondary-300 text-secondary placeholder:text-secondary-100 text-sm"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-secondary"
        />
        <span className="block text-center text-secondary">OR</span>
        <input
          type="url"
          name="imageUrl"
          placeholder="Paste Image URL"
          value={eventForm.imageUrl}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-secondary-100 rounded-md focus:outline-none focus:ring focus:border-secondary-300 text-secondary placeholder:text-secondary-100 text-sm"
        />

        <h3 className="text-lg font-semibold mt-4">Tickets</h3>
        {tickets.map((ticket, index) => (
          <TicketItem key={ticket.id} ticket={ticket} index={index} />
        ))}
        <button
          type="button"
          onClick={addTicket}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Add Ticket Type
        </button>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Create Event
        </button>
      </form>
    </main>
  );
};

export default CreateEvent;
