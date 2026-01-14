export const ErrorTag: React.FC<{ title?: string; message: string }> = ({
  title,
  message,
}) => {
  return (
    <div className="border border-green-400 rounded-md bg-green-200 p-2">
      {title && (
        <p className="text-md mb-2 text-green-600 font-medium">{title}</p>
      )}
      <span className="text-xs text-green-500">{message}</span>
    </div>
  );
};
