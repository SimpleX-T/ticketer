import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Event, EventStatus, TicketType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createEvent } from '../../hooks/useFirebaseEvents';
import { FaPlus, FaX } from 'react-icons/fa6';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SeedDatabase from '../admin/SeedDatabase';

interface EventForm extends Omit<Event, 'id' | 'createdAt' | 'ticketsSold' | 'soldOut'> {
  imageFile?: File;
  imageUrl?: string;
}

const INITIAL_TICKET_TYPE: TicketType = {
  id: '',
  name: '',
  price: 0,
  type: 'regular',
  available: 0,
  total: 0,
  description: '',
  benefits: []
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export default function EventCreationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([{ ...INITIAL_TICKET_TYPE }]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<EventForm>({
    name: '',
    date: '',
    location: '',
    description: '',
    image: '',
    imageFile: undefined,
    ticketTypes: [],
    organizerId: user?.id || '',
    maxTicketsPerUser: 4,
    category: '',
    status: EventStatus.DRAFT,
    totalCapacity: 0
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
    if (types.length === 0) return 'At least one ticket type is required';

    for (const ticket of types) {
      if (!ticket.name.trim()) return 'Ticket name is required';
      if (ticket.price < 0) return 'Price cannot be negative';
      if (ticket.total < 1) return 'Total tickets must be at least 1';
      if (!ticket.type) return 'Ticket type is required';
    }

    return null;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG, PNG, or GIF');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File too large. Maximum size is 5MB');
        return;
      }

      // Cleanup old preview URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: undefined
      }));
    },
    [previewUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE
  });

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    // Cleanup old preview URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);

    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
      imageFile: undefined
    }));
  };

  const handleTicketTypeChange = (
    index: number,
    field: keyof TicketType,
    value: number | string | string[]
  ) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes[index] = {
      ...newTicketTypes[index],
      [field]: value
    };
    setTicketTypes(newTicketTypes);

    // Update total capacity
    if (field === 'total') {
      const totalCapacity = newTicketTypes.reduce((sum, ticket) => sum + Number(ticket.total), 0);
      setFormData((prev) => ({ ...prev, totalCapacity }));
    }
  };

  const addTicketType = () => {
    setTicketTypes((prev) => [...prev, { ...INITIAL_TICKET_TYPE }]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes((prev) => {
      const newTypes = prev.filter((_, i) => i !== index);
      const totalCapacity = newTypes.reduce((sum, ticket) => sum + ticket.total, 0);
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
      if (!formData.name.trim()) throw new Error('Event name is required');
      if (!formData.date) throw new Error('Event date is required');
      if (!formData.location.trim()) throw new Error('Location is required');
      if (!formData.description.trim()) throw new Error('Description is required');
      if (!formData.category.trim()) throw new Error('Category is required');

      const ticketError = validateTicketTypes(ticketTypes);
      if (ticketError) throw new Error(ticketError);

      if (!formData.imageFile && !formData.imageUrl) {
        throw new Error('Please provide an image URL or upload an image');
      }

      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        const _formData = new FormData();
        _formData.append('file', formData.imageFile);
        _formData.append('upload_preset', process.env.VITE_CLOUDINARY_UPLOAD_PRESET!);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: _formData
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Upload failed');

        imageUrl = data.secure_url;
      }

      const eventData: EventForm = {
        ...formData,
        image: imageUrl!,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ticketTypes: ticketTypes.map(({ id, ...rest }) => ({
          ...rest,
          id: ''
        }))
      };

      await createEvent(eventData, user!);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
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
            <h2 className="text-xl font-medium text-secondary">Create New Event</h2>
            {/* <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-secondary hover:text-secondary-200"
            >
              Back
            </button> */}
            <SeedDatabase />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded flex items-center gap-2">
              <FaX className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Basic Event Details */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Event Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
              required
            />

            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
              required
            />

            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
              required
            />

            <textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded h-32 placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
              required
            />

            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.imageUrl || ''}
                  onChange={handleImageUrlChange}
                  className="w-full p-2 border rounded placeholder:text-secondary-100 outline-none focus:ring-2 focus:ring-secondary-200"
                  disabled={!!formData.imageFile}
                />
              </div>

              <div className="text-center">OR</div>

              <div
                {...getRootProps()}
                className={`flex-1 border-2 border-dashed min-h-32 flex items-center outline-none justify-center rounded p-4 text-center cursor-pointer
                ${isDragActive ? 'border-secondary-200 bg-secondary-100' : 'border-secondary-200'}`}
              >
                <input {...getInputProps()} />
                {formData.imageFile || formData.imageUrl ? (
                  <div className="w-full h-32 relative">
                    <img
                      src={previewUrl || formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (previewUrl) {
                          URL.revokeObjectURL(previewUrl);
                        }
                        setPreviewUrl(null);
                        setFormData((prev) => ({
                          ...prev,
                          imageFile: undefined,
                          imageUrl: undefined
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaX size={12} />
                    </button>
                  </div>
                ) : (
                  <p>Drag & drop an image here, or click to select</p>
                )}
              </div>
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
              <div key={index} className="border p-4 rounded space-y-4">
                <div className="flex justify-between">
                  <h4 className="font-medium">{ticket.name || `Ticket Type #${index + 1}`}</h4>

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
                      onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                      className="p-2 border rounded outline-none w-full focus:ring-2 focus:ring-primary-100"
                      required
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1 w-full">
                    <label htmlFor="type" className="text-sm mb-1 block text-secondary">
                      Ticket Type
                    </label>
                    <select
                      value={ticket.type}
                      onChange={(e) => handleTicketTypeChange(index, 'type', e.target.value)}
                      className="p-2 border rounded outline-none w-full focus:ring-2 focus:ring-primary-100"
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
                        handleTicketTypeChange(index, 'price', Number(e.target.value))
                      }
                      className="p-2 border rounded outline-none w-full focus:ring-2 focus:ring-primary-100"
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
                        handleTicketTypeChange(index, 'total', Number(e.target.value))
                      }
                      className="p-2 border rounded outline-none w-full focus:ring-2 focus:ring-primary-100"
                      min="1"
                      required
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1 w-full">
                    <label className="text-sm mb-1 block text-secondary" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      placeholder="Description"
                      value={ticket.description}
                      onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
                      className="p-2 border rounded col-span-2 outline-none w-full focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1 w-full">
                    <label className="text-sm mb-1 block text-secondary" htmlFor="benefits">
                      Benefits
                    </label>
                    <input
                      type="text"
                      placeholder="Benefits (comma-separated)"
                      value={ticket.benefits?.join(', ') || ''}
                      onChange={(e) =>
                        handleTicketTypeChange(
                          index,
                          'benefits',
                          e.target.value.split(',').map((b) => b.trim())
                        )
                      }
                      className="p-2 border rounded col-span-2 w-full outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded text-white font-medium
            ${
              isLoading ? 'bg-secondary-400/80' : 'bg-secondary hover:bg-secondary-200'
            } transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </main>
  );
}
