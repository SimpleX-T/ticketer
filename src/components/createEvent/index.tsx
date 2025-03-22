import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaPlus, FaX } from "react-icons/fa6";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import { createEvent } from "../../services/eventServices";
import FormInput from "./FormInput";
import { TicketTypeForm } from "./TicketTypeForm";
import ImagePreview from "./ImagePreview";
import { useEventForm } from "../../hooks/useCreateEventForm";

export default function EventCreationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput<string>
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                withLabel={true}
                label="When is the event starting:"
                className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
                required
              />

              <FormInput<string>
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                withLabel={true}
                label="When is the event ending:"
                className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
                required
              />
            </div>

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
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    handleImageUrlChange(e);
                  }}
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
