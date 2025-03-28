export const Select = ({
  id,
  name,
  value,
  onChange,
  label = "",
  options = [],
  required = false,
  className = "",
  hasLabel = true,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  options: string[];
  required?: boolean;
  className?: string;
  hasLabel?: boolean;
}) => {
  return (
    <div>
      {hasLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-secondary"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        name={name}
        className={`mt-1 block w-full rounded-md bg-primary-300 border-primary-100 text-secondary p-2 ${className} capitalize text-sm`}
        required={required}
        onChange={onChange}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="capitalize text-sm">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
