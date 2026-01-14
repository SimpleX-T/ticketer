import { FaX } from "react-icons/fa6";
import { TicketType } from "../../types";

interface TicketTypeFormProps {
  ticket: TicketType;
  ticketTypes: TicketType[];
  removeTicketType: (index: number) => void;
  index: number;
  handleTicketTypeChange: (
    index: number,
    field: keyof TicketType,
    value: string | number | string[]
  ) => void;
}

export const TicketTypeForm = ({
  ticket,
  ticketTypes,
  removeTicketType,
  handleTicketTypeChange,
  index,
}: TicketTypeFormProps) => {
  return (
    <div className="border p-4 rounded-lg space-y-4 border-secondary/30">
      <div className="flex justify-between">
        <h4 className="font-medium capitalize text-secondary">
          {ticket.name || `Ticket Type ${index + 1}`}
        </h4>

        {ticketTypes.length > 1 && (
          <button
            type="button"
            onClick={() => removeTicketType(index)}
            title="Remove ticket"
            className="bg-red-500 p-1 shadow-sm shadow-red-600 cursor-pointer text-red-200 font-bold rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-700 hover:shadow-none"
          >
            <FaX size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1 w-full">
          <label htmlFor="name" className="text-sm mb-1 block text-secondary">
            Ticket Name
          </label>
          <input
            type="text"
            placeholder="Ticket Name"
            value={ticket.name}
            onChange={(e) =>
              handleTicketTypeChange(index, "name", e.target.value)
            }
            className="p-2 border border-secondary/30  text-secondary rounded-md outline-none w-full focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>

        <div className="col-span-2 md:col-span-1 w-full">
          <label htmlFor="type" className="text-sm mb-1 block text-secondary">
            Ticket Type
          </label>
          <select
            value={ticket.type}
            onChange={(e) =>
              handleTicketTypeChange(index, "type", e.target.value)
            }
            className="p-2 border border-secondary/30  text-secondary rounded-md outline-none w-full focus:ring-2 focus:ring-primary-100"
            required
          >
            <option value="regular">Regular</option>
            <option value="vip">VIP</option>
            <option value="vvip">VVIP</option>
          </select>
        </div>

        <div className="col-span-2 md:col-span-1 w-full">
          <label className="text-sm mb-1 block text-secondary" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            placeholder="Price"
            value={ticket.price}
            onChange={(e) =>
              handleTicketTypeChange(index, "price", Number(e.target.value))
            }
            className="p-2 border border-secondary/30  text-secondary rounded-md outline-none w-full focus:ring-2 focus:ring-primary-100"
            min="0"
            required
          />
        </div>

        <div className="col-span-2 md:col-span-1 w-full">
          <label className="text-sm mb-1 block text-secondary" htmlFor="price">
            Total Available
          </label>
          <input
            type="number"
            placeholder="Total Available"
            value={ticket.total}
            onChange={(e) =>
              handleTicketTypeChange(index, "total", Number(e.target.value))
            }
            className="p-2 border border-secondary/30  text-secondary rounded-md outline-none w-full focus:ring-2 focus:ring-primary-100"
            min="1"
            required
          />
        </div>

        <div className="col-span-2 md:col-span-1 w-full">
          <label
            className="text-sm mb-1 block text-secondary"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            placeholder="Description"
            value={ticket.description}
            onChange={(e) =>
              handleTicketTypeChange(index, "description", e.target.value)
            }
            className="p-2 border border-secondary/30  text-secondary rounded-md col-span-2 outline-none w-full focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="col-span-2 md:col-span-1 w-full">
          <label
            className="text-sm mb-1 block text-secondary"
            htmlFor="benefits"
          >
            Benefits
          </label>
          <input
            type="text"
            placeholder="Benefits (comma-separated)"
            value={ticket.benefits?.join(", ") || ""}
            onChange={(e) =>
              handleTicketTypeChange(
                index,
                "benefits",
                e.target.value.split(",").map((b) => b.trim())
              )
            }
            className="p-2 border border-secondary/30  text-secondary rounded-md col-span-2 w-full outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>
    </div>
  );
};
