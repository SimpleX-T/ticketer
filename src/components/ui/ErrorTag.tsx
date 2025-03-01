export const ErrorTag: React.FC<{ title?: string; message: string }> = ({
  title,
  message,
}) => {
  return (
    <div className="border border-red-400 rounded-md bg-red-200 p-2">
      {title && (
        <p className="text-md mb-2 text-red-600 font-medium">{title}</p>
      )}
      <span className="text-xs text-red-500">{message}</span>
    </div>
  );
};
