import { ChangeEvent, InputHTMLAttributes, forwardRef } from "react";

// Extend native input props, overriding value and onChange for custom typing
interface FormInputProps<T>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: T; // Generic value (string, number, etc.)
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string; // Made required for consistency
  list?: string;
  hasLabel?: boolean; // Renamed from withLabel for clarity
  label?: string;
}

// Use forwardRef for ref forwarding
const FormInput = forwardRef<HTMLInputElement, FormInputProps<unknown>>(
  (
    {
      value,
      onChange,
      className = "",
      placeholder,
      type = "text",
      required = false,
      disabled = false,
      name,
      list,
      hasLabel = false,
      label = "",
      ...rest
    },
    ref
  ) => {
    // Handle value for different input types
    const inputValue =
      type === "checkbox" || type === "radio"
        ? undefined
        : value === null || value === undefined
        ? ""
        : String(value);
    const isChecked =
      type === "checkbox" || type === "radio" ? Boolean(value) : undefined;

    return (
      <div className="space-y-1">
        {hasLabel && label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-300"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          value={inputValue}
          checked={isChecked}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          list={list}
          className={`w-full p-3 bg-primary-200 border border-secondary/30 rounded-lg text-white placeholder:text-secondary-100 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-secondary-200 focus:border-secondary-100 ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
