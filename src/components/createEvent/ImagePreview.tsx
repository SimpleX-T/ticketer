import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaX } from "react-icons/fa6";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../../utils/constants";

interface ImagePreviewProps {
  imageFile: File | undefined;
  imageUrl: string | undefined;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  setImageFile: (file: File | undefined) => void;
  setImageUrl: (url: string) => void;
}

export default function ImagePreview({
  imageFile,
  imageUrl,
  previewUrl,
  setPreviewUrl,
  setImageFile,
  setImageUrl,
}: ImagePreviewProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG, PNG, or GIF");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert("File too large. Maximum size is 5MB");
        return;
      }

      // Cleanup old preview URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      setImageFile(file);
      setImageUrl("");
    },
    [previewUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex-1 border-2 border-dashed min-h-32 flex items-center outline-none justify-center rounded p- text-center cursor-pointer
                ${
                  isDragActive
                    ? "border-secondary-200 bg-secondary-100"
                    : "border-secondary-200"
                }`}
    >
      <input {...getInputProps()} />
      {imageFile || imageUrl ? (
        <div className="w-full h-32 relative">
          <img
            src={previewUrl || imageUrl}
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

              setImageFile(undefined);
              setImageUrl("");
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <FaX size={12} />
          </button>
        </div>
      ) : (
        <p className="text-gray-500">
          Drag & drop an image here, or click to select
        </p>
      )}
    </div>
  );
}
