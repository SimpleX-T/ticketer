import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { updateUser } from "../../../services/userServices";
import { uploadToCloudinary } from "../../../utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUserCircle } from "react-icons/fa";

const Settings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    displayName: user?.displayName || "",
    profileImage: user?.profileImage || "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate preview URL when a new image is selected
  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup on unmount or change
    }
    setPreviewUrl(null); // Reset if no image selected
  }, [selectedImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (formData: { field: string; value: unknown }[]) =>
      updateUser(user!.id, formData),
    onMutate: async (updatedFields) => {
      queryClient.setQueryData(["user"], updatedFields);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const updatedFields: { field: string; value: unknown }[] = [];

      // Compare formData with user data, add only changed fields
      Object.keys(formData).forEach((key) => {
        if (
          formData[key as keyof typeof formData] !==
          user?.[key as keyof typeof user]
        ) {
          updatedFields.push({
            field: key,
            value: formData[key as keyof typeof formData],
          });
        }
      });

      // Upload image if selected
      if (selectedImage) {
        const imageUrl = await uploadToCloudinary(selectedImage);
        if (imageUrl) {
          updatedFields.push({ field: "profileImage", value: imageUrl });
          setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
          setSelectedImage(null); // Clear selected image after upload
        }
      }

      if (updatedFields.length > 0) {
        await updateMutation.mutateAsync(updatedFields);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto bg-primary-300 rounded-xl shadow-lg border border-secondary/20 p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
          Profile Settings
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white placeholder:text-secondary-100 focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white placeholder:text-secondary-100 focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white placeholder:text-secondary-100 focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleSave}
              className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                loading
                  ? "bg-secondary-400/80 cursor-not-allowed"
                  : "bg-secondary hover:bg-secondary-200 focus:ring-2 focus:ring-secondary-500"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Right Column: Image Upload & Preview */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Profile Image
              </label>
              <div className="flex flex-col items-center gap-4">
                {/* Image Preview */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-secondary/30 bg-primary-200 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Current profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-secondary-100 text-5xl" />
                  )}
                </div>

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 bg-primary-200 border border-secondary/30 rounded-lg text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-secondary file:text-white file:hover:bg-secondary-200 transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
