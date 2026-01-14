import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaChevronLeft, FaPlus, FaX } from "react-icons/fa6";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import { useEventForm } from "../../hooks/useCreateEventForm";
import { createEvent } from "../../services/eventServices";
import FormInput from "./FormInput";
import { TicketTypeForm } from "./TicketTypeForm";
import ImagePreview from "./ImagePreview";
import { DatePickerWithRange } from "../ui/date-picker-with-range";
import { Button } from "../ui/button";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export default function EventCreationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formDateRange, setFormDateRange] = useState<DateRange | undefined>(
    undefined
  );

  const {
    imageUrl,
    imageFile,
    setImageUrl,
    setImageFile,
    formData,
    ticketTypes,
    handleImageUrlChange,
    handleTicketTypeChange,
    addTicketType,
    removeTicketType,
    handleSubmit,
    isLoading,
    error,
    setError,
    setFormData,
  } = useEventForm(createEvent);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!user) {
    return <div className="text-center py-10 text-white">Loading...</div>;
  }

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    // Update the date range state
    setFormDateRange(dateRange);

    // Format dates for form data and update form state
    if (dateRange?.from) {
      const formattedStartDate = format(
        dateRange.from,
        "yyyy-MM-dd'T'HH:mm:ss"
      );

      if (dateRange.to) {
        const formattedEndDate = format(dateRange.to, "yyyy-MM-dd'T'HH:mm:ss");

        // Update both dates in form data
        setFormData((prev) => ({
          ...prev,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }));
      } else {
        // Update only start date if end date is not selected
        setFormData((prev) => ({
          ...prev,
          startDate: formattedStartDate,
        }));
      }
    }
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-primary via-primary-200 to-primary-100 py-24 px-6 grid place-items-center">
      <ScrollRestoration />
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-primary-300 rounded-xl shadow-lg border border-secondary/20 p-8 space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary/20 pb-4">
          <h2 className="text-2xl font-semibold text-white">
            Create New Event
          </h2>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-secondary hover:text-white transition-colors duration-200 flex items-center gap-1"
          >
            <FaChevronLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center justify-between">
            <p className="text-sm max-w-[55ch]">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-200 hover:text-red-100 p-1 rounded-full focus:ring-2 focus:ring-red-400"
            >
              <FaX size={12} />
            </button>
          </div>
        )}

        {/* Event Details Section */}
        <section className="space-y-6">
          <h3 className="text-lg font-medium text-white">Event Details</h3>
          <FormInput
            type="text"
            placeholder="Event Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            name="event-name"
            label="Event Name"
            hasLabel
            className="w-full p-3 bg-primary-200 border-secondary/70 text-white rounded-lg focus:ring-2 focus:ring-secondary-200"
          />

          <DatePickerWithRange
            className="w-full bg-primary-200 border-secondary/70 text-white rounded-lg focus:ring-2 focus:ring-secondary-200"
            value={formDateRange}
            onChange={handleDateRangeChange}
          />

          <FormInput
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            label="Location"
            hasLabel
            className="w-full p-3 bg-primary-200 border-secondary/30 text-white rounded-lg focus:ring-2 focus:ring-secondary-200"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white placeholder:text-secondary-100 focus:ring-2 focus:ring-secondary-200 h-32 resize-y"
              required
            />
          </div>

          <FormInput
            type="text"
            placeholder="Category"
            list="categories"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            label="Category"
            hasLabel
            className="w-full p-3 bg-primary-200 border-secondary/30 text-white rounded-lg focus:ring-2 focus:ring-secondary-200"
            required
          />
        </section>

        {/* Image Upload Section */}
        <section className="space-y-6">
          <h3 className="text-lg font-medium text-white">Event Image</h3>
          <div className="flex flex-col gap-4">
            <FormInput
              type="text"
              placeholder="Image URL"
              value={imageUrl || ""}
              onChange={handleImageUrlChange}
              label="Image URL"
              hasLabel
              className="w-full p-3 bg-primary-200 border-secondary/30 text-white rounded-lg focus:ring-2 focus:ring-secondary-200"
              disabled={!!imageFile}
            />
            <p className="text-center text-secondary-100 text-sm">OR</p>
            <ImagePreview
              imageFile={imageFile}
              imageUrl={imageUrl}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              setImageFile={setImageFile}
              setImageUrl={setImageUrl}
            />
          </div>
        </section>

        {/* Ticket Types Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Ticket Types</h3>
            <Button
              type="button"
              onClick={addTicketType}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-200 transition-all duration-200"
            >
              <FaPlus size={14} />
              <span className="hidden sm:inline">Add Ticket Type</span>
            </Button>
          </div>
          {ticketTypes.length === 0 && (
            <p className="text-secondary-100 text-sm">
              No ticket types added yet.
            </p>
          )}
          <div className="space-y-4">
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
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${
            isLoading
              ? "bg-secondary-400/80 cursor-not-allowed"
              : "bg-secondary hover:bg-secondary-200 focus:ring-2 focus:ring-secondary-500"
          }`}
        >
          {isLoading ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </main>
  );
}
