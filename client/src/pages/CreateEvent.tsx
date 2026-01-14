import { useNavigate } from "react-router-dom";
import EventCreationForm from "../components/createEvent";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { updateUser } from "../services/userServices";
import { toast } from "sonner";
import { sonnerStyle } from "@/utils/constants";

export default function CreateEvent() {
  const { user } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(user?.role === "user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const { success, error } = await updateUser(user?.id || "", [
        { field: "role", value: "organizer" },
      ]);
      if (error) throw error;

      if (success) setModalIsOpen(false);
    } catch (error) {
      if (error instanceof Error)
        toast(error.message, {
          style: sonnerStyle,
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal content */}
          <div className="relative bg-primary-100 border border-secondary rounded-md shadow-lg p-6 w-[90%] max-w-sm">
            <h2 className="font-bold text-lg text-secondary mb-2 text-center">
              Become an Event Host
            </h2>
            <p className="text-sm text-secondary text-center mb-4">
              Would you like to start hosting events on our platform?
            </p>

            {/* Action buttons */}
            <div className="flex justify-center gap-4">
              <button
                className="px-4 cursor-pointer py-2 rounded-sm bg-secondary text-white hover:bg-secondary/90 transition-all"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Updating..." : "Yes, I want to host"}
              </button>
              <button
                onClick={() => {
                  setModalIsOpen(false);
                  navigate("/");
                }}
                className="px-4 cursor-pointer py-2 rounded-sm border border-secondary text-secondary hover:bg-secondary hover:text-white transition-all"
              >
                No, maybe later
              </button>
            </div>
          </div>
        </div>
      )}
      <EventCreationForm />
    </>
  );
}
