import React, { useState, useEffect } from "react";
import { Event, TicketType } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { FaPlus, FaX } from "react-icons/fa6";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import { createEvent } from "../../services/eventServices";
import FormInput from "./FormInput";
import { TicketTypeForm } from "./TicketTypeForm";
import ImagePreview from "./ImagePreview";

const INITIAL_TICKET_TYPE: TicketType = {
  id: "",
  name: "",
  price: 0,
  type: "regular",
  available: 0,
  total: 0,
  description: "",
  benefits: [],
};

export default function EventCreationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { ...INITIAL_TICKET_TYPE },
  ]);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<
    Omit<Event, "id" | "createdAt" | "ticketsSold" | "soldOut">
  >({
    name: "",
    date: "",
    location: "",
    description: "",
    image: "",
    ticketTypes: [],
    organizerId: user?.id || "",
    maxTicketsPerUser: 4,
    category: "",
    totalCapacity: 0,
  });

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
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
    newTicketTypes[index] = {
      ...newTicketTypes[index],
      [field]: value,
    };
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
      // Validate form
      if (!formData.name.trim()) throw new Error("Event name is required");

      if (!formData.date) throw new Error("Event date is required");
      const eventDateTime = new Date(formData.date);
      const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
      if (eventDateTime <= tenMinutesFromNow)
        throw new Error("Event must be at least 10 minutes in the future");

      if (!formData.location.trim()) throw new Error("Location is required");
      if (!formData.description.trim())
        throw new Error("Description is required");
      if (!formData.category.trim()) throw new Error("Category is required");

      const ticketError = validateTicketTypes(ticketTypes);
      if (ticketError) throw new Error(ticketError);

      if (!imageFile && !imageUrl) {
        throw new Error("Please provide an image URL or upload an image");
      }

      let _imageUrl = imageUrl;

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
          {
            method: "POST",
            body: _formData,
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Upload failed");

        _imageUrl = data.secure_url;
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
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-primary py-24 via-primary-200 to-primary-100 p-6">
      <ScrollRestoration />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 border border-secondary rounded-md text-secondary max-w-2xl mx-auto p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-secondary">
              Create New Event
            </h2>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-secondary hover:text-secondary-200"
            >
              Back
            </button>
            {/* <SeedDatabase /> */}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded flex items-center gap-2 relative">
              <button
                onClick={() => setError(null)}
                className="text-sm cursor-pointer rounded-sm focus:ring-1 bg-red-500 text-red-200 absolute top-4 -translate-y-1/2 right-2 focus:ring-red-400 p-1"
              >
                <FaX className="shrink-0" />
              </button>
              <p className="max-w-[55ch]">{error}</p>
            </div>
          )}

          {/* Basic Event Details */}
          <div className="space-y-4">
            <FormInput<string>
              type="text"
              placeholder="Event Name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, name: e.target?.value }))
              }
              required
              name="event-name"
              className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
            />

            <FormInput<string>
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
              required
            />

            <FormInput<string>
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
              required
            />

            <textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full p-2 border rounded h-32 placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
              required
            />

            <FormInput<string>
              type="text"
              placeholder="Category"
              list="categories"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <FormInput<string>
                  type="text"
                  placeholder="Image URL"
                  value={imageUrl || ""}
                  onChange={handleImageUrlChange}
                  className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
                  disabled={!!imageFile}
                />
              </div>

              <p className="text-center">OR</p>

              <ImagePreview
                imageFile={imageFile}
                imageUrl={imageUrl}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                setImageFile={setImageFile}
                setImageUrl={setImageUrl}
              />
            </div>
          </div>

          {/* Ticket Types */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Ticket Types</h3>
              <button
                type="button"
                onClick={addTicketType}
                className="px-4 py-2 bg-secondary border-primary-100 border text-white rounded hover:bg-primary-200 transition-all duration-200 cursor-pointer"
              >
                <span className="hidden md:block">Add Ticket Type</span>
                <span className="md:hidden">
                  <FaPlus size={14} />
                </span>
              </button>
            </div>

            {ticketTypes.map((ticket, index) => (
              <TicketTypeForm
                key={index}
                index={index}
                ticket={ticket}
                ticketTypes={ticketTypes}
                removeTicketType={removeTicketType}
                handleTicketTypeChange={handleTicketTypeChange}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded text-white font-medium
            ${
              isLoading
                ? "bg-secondary-400/80"
                : "bg-secondary hover:bg-secondary-200"
            } transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed`}
          >
            {isLoading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </main>
  );
}
