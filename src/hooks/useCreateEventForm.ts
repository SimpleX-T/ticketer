import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Event, TicketType } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { INITIAL_TICKET_TYPE, sonnerStyle } from "../utils/constants";
import { uploadToCloudinary } from "../utils/helpers";
import { toast } from "sonner";

export const useEventForm = (
  createEvent: (
    event: Omit<Event, "id" | "createdAt" | "ticketsSold" | "soldOut">
  ) => Promise<void>
) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<
    Omit<Event, "id" | "createdAt" | "ticketsSold" | "soldOut">
  >({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    image: "",
    ticketTypes: [],
    organizerId: user?.id || "",
    maxTicketsPerUser: 4,
    category: "",
    totalCapacity: 0,
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { ...INITIAL_TICKET_TYPE },
  ]);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateTicketTypes = (types: TicketType[]): string | null => {
    if (types.length === 0) return "At least one ticket type is required";
    for (const ticket of types) {
      if (!ticket.name.trim()) return "Ticket name is required";
      if (ticket.price < 0) return "Price cannot be negative";
      if (ticket.total < 1) return "Total tickets must be at least 1";
      if (!ticket.type) return "Ticket type is required";
    }
    return null;
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageFile(undefined);
    setImageUrl(url);
  };

  const handleTicketTypeChange = (
    index: number,
    field: keyof TicketType,
    value: number | string | string[]
  ) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value };
    setTicketTypes(newTicketTypes);

    // Update total capacity
    if (field === "total") {
      const totalCapacity = newTicketTypes.reduce(
        (sum, ticket) => sum + Number(ticket.total),
        0
      );
      setFormData((prev) => ({ ...prev, totalCapacity }));
    }
  };

  const addTicketType = () => {
    setTicketTypes((prev) => [...prev, { ...INITIAL_TICKET_TYPE }]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes((prev) => {
      const newTypes = prev.filter((_, i) => i !== index);
      const totalCapacity = newTypes.reduce(
        (sum, ticket) => sum + ticket.total,
        0
      );
      setFormData((prev) => ({ ...prev, totalCapacity }));
      return newTypes;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.name.trim()) throw new Error("Event name is required");
      if (!formData.startDate || !formData.endDate)
        throw new Error("Event date is required");

      const eventEndDate = new Date(formData.endDate);
      const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
      if (eventEndDate <= tenMinutesFromNow)
        throw new Error("Event must be at least 10 minutes in the future");

      if (!formData.location.trim()) throw new Error("Location is required");
      if (!formData.description.trim())
        throw new Error("Description is required");
      if (!formData.category.trim()) throw new Error("Category is required");

      const ticketError = validateTicketTypes(ticketTypes);
      if (ticketError) throw new Error(ticketError);

      if (!imageFile && !imageUrl)
        throw new Error("Please provide an image URL or upload an image");

      let _imageUrl = imageUrl;

      if (imageFile) {
        const response = await uploadToCloudinary(imageFile);

        if (!response) throw new Error("Image upload failed");
        _imageUrl = response;
      }

      const eventData: Omit<
        Event,
        "id" | "createdAt" | "ticketsSold" | "soldOut"
      > = {
        ...formData,
        image: _imageUrl!,
        ticketTypes,
      };

      await createEvent(eventData);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast(err.message, { style: sonnerStyle });
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    ticketTypes,
    imageFile,
    imageUrl,
    previewUrl,
    isLoading,
    error,
    setError,
    setFormData,
    setImageFile,
    setImageUrl,
    setPreviewUrl,
    validateTicketTypes,
    handleImageUrlChange,
    handleTicketTypeChange,
    addTicketType,
    removeTicketType,
    handleSubmit,
  };
};
