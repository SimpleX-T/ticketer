export const Input = ({
  id,
  name,
  type = "text",
  placeholder,
  required = true,
  className = "",
  hasLabel = true,
  label = "",
  labelClassName = "",
}: {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  hasLabel?: boolean;
  label?: string;
  labelClassName?: string;
}) => {
  return (
    <div>
      {hasLabel && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-300 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <input
        type={type}
        id={id}
        name={name}
        className={`mt-1 block w-full rounded-md bg-primary-300 border-primary-100 text-white ${className} outline-none p-2 border border-secondary-200 text-sm`}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};
