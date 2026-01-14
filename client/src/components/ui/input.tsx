import { ChangeEvent, InputHTMLAttributes, forwardRef } from "react";

// Extend InputHTMLAttributes to inherit all native input props
interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  id: string;
  name?: string;
  value?: string | number | boolean | null; // Flexible value types
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void; // Explicit onChange
  type?: string; // Allow any HTML input type
  placeholder?: string;
  required?: boolean;
  className?: string;
  hasLabel?: boolean;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

// Use forwardRef to allow ref passing (e.g., for focus control)
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      value,
      onChange,
      type = "text",
      placeholder,
      required = false, // Default to false for flexibility
      className = "",
      hasLabel = true,
      label = "",
      labelClassName = "",
      disabled = false,
      readOnly = false,
      ...rest // Spread remaining HTML attributes
    },
    ref
  ) => {
    // Handle value for different types (e.g., checkbox needs checked)
    const inputValue =
      type === "checkbox" || type === "radio"
        ? undefined
        : value === true || value === false
        ? String(value)
        : value ?? "";
    const isChecked =
      type === "checkbox" || type === "radio" ? Boolean(value) : undefined;

    return (
      <div className="relative">
        {hasLabel && label && (
          <label
            htmlFor={id}
            className={`block text-sm font-medium text-secondary ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={inputValue}
          checked={isChecked}
          onChange={onChange}
          className={`mt-1 block w-full rounded-md bg-primary-300 border border-secondary-200 text-white outline-none p-2 text-sm transition-colors duration-200 ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-secondary-100 focus:border-secondary focus:ring-2 focus:ring-secondary-500/50"
          } ${className}`}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          {...rest} // Spread additional props like maxLength, min, max, etc.
        />
      </div>
    );
  }
);

// Optional: Set display name for better debugging
Input.displayName = "Input";
