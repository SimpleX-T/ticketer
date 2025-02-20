import { useState } from "react";
import { CgMail } from "react-icons/cg";
import { FaCloudArrowUp } from "react-icons/fa6";
import { AttendeeFormProps } from "../../types";
import { useAppContext } from "../../contexts/AppContext";

export const AttendeeForm: React.FC<AttendeeFormProps> = ({
  ticketData,
  setTicketData,
  onBack,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addTicket } = useAppContext();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTicketData({
          ...ticketData,
          profileImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!ticketData.userName) newErrors.name = "Name is required";
    if (!ticketData.userEmail) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(ticketData.userEmail)) {
      newErrors.email = "Invalid email format";
    }
    if (!ticketData.profileImage) newErrors.image = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addTicket({
        id: ticketData.ticketId,
        name: ticketData.userName,
        price: ticketData.ticketType?.price || "",
        type: ticketData.ticketType?.type || "REGULAR",
        eventName: "Event Name",
        eventId: "Event ID",
        total: ticketData.ticketCount,
      });
      onSubmit();
    }
  };

  return (
    <div className="bg-primary-400 border border-secondary-200 rounded-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-white font-serif mb-4">Upload profile photo</h3>

          <div className="w-full p-4 flex items-center justify-center bg-black/20">
            <div
              onClick={() => document.getElementById("image-upload")?.click()}
              className="border-[4px] border-secondary/50 bg-primary-100 rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-teal-800/50 w-40 aspect-square"
            >
              {ticketData.profileImage ? (
                <img
                  src={ticketData.profileImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-sm px-2 text-white flex items-center justify-center gap-4 flex-col">
                  <FaCloudArrowUp size={24} />
                  Drag & drop or click to upload
                </div>
              )}
            </div>
          </div>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {errors.image && (
            <div className="text-red-500 text-xs mt-1">{errors.image}</div>
          )}
        </div>

        <hr className="border-2 border-secondary-200 my-8" />

        <div>
          <label
            htmlFor="name"
            className="font-serif text-white text-sm mb-2 block"
          >
            Enter your name
          </label>
          <input
            type="text"
            id="name"
            value={ticketData.userName}
            onChange={(e) =>
              setTicketData({ ...ticketData, userName: e.target.value })
            }
            className="w-full bg-transparent text-white border border-secondary-200 rounded-md p-2 focus:outline-none"
          />
          {errors.name && (
            <div className="text-red-500 text-xs">{errors.name}</div>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="font-serif text-white text-sm mb-2 block"
          >
            Enter your email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={ticketData.userEmail}
              onChange={(e) =>
                setTicketData({ ...ticketData, userEmail: e.target.value })
              }
              className="w-full bg-transparent text-white border border-secondary-200 rounded-md p-2 focus:outline-none pl-10"
            />
            <CgMail
              size={24}
              color="white"
              className="absolute left-2 bottom-1/2 transform translate-y-1/2"
            />
          </div>
          {errors.email && (
            <div className="text-red-500 text-xs">{errors.email}</div>
          )}
        </div>

        <div>
          <label
            htmlFor="special-request"
            className="font-serif text-white text-sm mb-2 block"
          >
            Special request?
          </label>

          <textarea
            id="special-request"
            value={ticketData.specialRequest}
            onChange={(e) =>
              setTicketData({ ...ticketData, specialRequest: e.target.value })
            }
            className="w-full bg-transparent resize-none text-white border border-secondary-200 rounded-md p-2 focus:outline-none"
            rows={3}
          />
        </div>

        <div className="flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 py-2 text-white cursor-pointer border border-secondary rounded-md"
          >
            Back
          </button>

          <button
            type="submit"
            className="w-1/2 py-2 bg-secondary cursor-pointer text-white rounded-md transition-colors duration-300 hover:bg-secondary/80"
          >
            Get My Ticket
          </button>
        </div>
      </form>
    </div>
  );
};
