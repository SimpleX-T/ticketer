import { useState, useEffect } from "react";
import { Event } from "../../../types";
import { FaX } from "react-icons/fa6";
import { uploadToCloudinary } from "../../../utils/helpers";

export default function EditEventModal({
  handleEditSubmit,
  editEvent,
  setEditEvent,
}: {
  handleEditSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  editEvent: Event | null;
  setEditEvent: React.Dispatch<React.SetStateAction<Event | null>>;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [imageFile]);

  if (!editEvent) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      if (imageFile) {
        const imageUrl = await uploadToCloudinary(imageFile);
        if (imageUrl) {
          setEditEvent({ ...editEvent, image: imageUrl });
          // Call handleEditSubmit after image upload
          handleEditSubmit(e);
        }
      } else {
        handleEditSubmit(e);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0 cursor-pointer"
        onClick={() => setEditEvent(null)}
      />

      <div className="bg-primary-300 p-6 rounded-xl shadow-xl max-w-2xl w-full border border-secondary/20 z-50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Edit Event</h3>
          <button
            onClick={() => setEditEvent(null)}
            className="text-secondary hover:text-white p-2 rounded-full transition-colors duration-200 cursor-pointer"
          >
            <FaX size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Event Details Section */}
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={editEvent.name}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, name: e.target.value })
                }
                className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={editEvent.startDate.slice(0, 16)}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, startDate: e.target.value })
                  }
                  className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={editEvent.endDate?.slice(0, 16) || ""}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, endDate: e.target.value })
                  }
                  className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={editEvent.location}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, location: e.target.value })
                }
                className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={editEvent.description}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, description: e.target.value })
                }
                className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white focus:ring-2 focus:ring-secondary-200 h-24 resize-y transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={editEvent.category || ""}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, category: e.target.value })
                }
                list="event-categories"
                className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
              />
              <datalist id="event-categories">
                <option value="Music" />
                <option value="Tech" />
                <option value="Sports" />
                <option value="Conference" />
                <option value="Art" />
              </datalist>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={editEvent.status || "draft"}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, status: e.target.value })
                }
                className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="canceled">Canceled</option>
              </select>
            </div> */}

            {/* <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={editEvent.isPublic || false}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, isPublic: e.target.checked })
                }
                className="w-4 h-4 bg-primary-200 border-secondary/30 rounded focus:ring-2 focus:ring-secondary-200 text-secondary"
              />
              <label className="text-sm font-medium text-gray-300">
                Public Event
              </label>
            </div> */}
          </section>

          {/* Image Section */}
          <section className="space-y-4">
            <h4 className="text-lg font-medium text-white">Event Image</h4>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-secondary/30 bg-primary-200 flex-shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : editEvent.image ? (
                  <img
                    src={editEvent.image}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary-100 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="flex-1 p-2 bg-primary-200 border border-secondary/30 rounded-lg text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-secondary file:text-white file:hover:bg-secondary-200 transition-all duration-200"
                disabled={isUploading}
              />
            </div>
          </section>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className={`flex-1 py-2 rounded-md text-white transition-colors duration-200 ${
                isUploading
                  ? "bg-secondary-400/80 cursor-not-allowed"
                  : "bg-secondary hover:bg-secondary-200"
              }`}
              disabled={isUploading}
            >
              {isUploading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditEvent(null)}
              className="flex-1 py-2 bg-primary-100 text-white rounded-md hover:bg-primary transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
