import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Event, TicketType } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { INITIAL_TICKET_TYPE } from "../utils/constants";

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

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
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

  // ✅ Add Ticket Type
  const addTicketType = () => {
    setTicketTypes((prev) => [...prev, { ...INITIAL_TICKET_TYPE }]);
  };

  // ✅ Remove Ticket Type
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

  // ✅ Handle Form Submission
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

      // ✅ Handle Image Upload
      if (imageFile) {
        const _formData = new FormData();
        _formData.append("file", imageFile);
        _formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          { method: "POST", body: _formData }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Upload failed");
        _imageUrl = data.secure_url;
      }

      // ✅ Prepare Event Data
      const eventData: Omit<
        Event,
        "id" | "createdAt" | "ticketsSold" | "soldOut"
      > = {
        ...formData,
        image: _imageUrl!,
        ticketTypes,
      };

      // ✅ Create Event
      await createEvent(eventData);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Return Hook Values
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
