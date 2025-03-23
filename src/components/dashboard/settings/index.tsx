import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { updateUser } from "../../../services/userServices";
import { uploadToCloudinary } from "../../../utils/helpers";

const Settings = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    displayName: user?.displayName || "",
    profileImage: user?.profileImage || "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const updatedFields: { field: string; value: unknown }[] = [];

      // This function compares formData with user data, add only changed fields
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

      if (selectedImage) {
        const imageUrl = await uploadToCloudinary(selectedImage);
        if (imageUrl) {
          updatedFields.push({ field: "profileImage", value: imageUrl });
        }
      }

      // If there are changes, send the update request
      if (updatedFields.length > 0) {
        const response = await updateUser(user.id, updatedFields);
        console.log("Update response:", response);
      } else {
        console.log("No changes detected.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-primary-300 rounded shadow-md text-secondary max-w-6xl mt-14 md:mt-4 mx-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>

      <div className="mb-4">
        <label className="block text-secondary">First Name</label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-secondary">Last Name</label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-secondary">Display Name</label>
        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Profile Image Upload */}
      <div className="mb-4">
        <label className="block text-secondary">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-primary-100 text-white rounded hover:bg-secondary-200 cursor-pointer transition-colors duration-300"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default Settings;
