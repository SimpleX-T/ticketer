import React from "react";

interface FormInputProps<T> {
  value: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  list?: string;
  withLabel?: boolean;
  label?: string;
}
export default function FormInput<T>({
  value,
  onChange,
  className,
  placeholder,
  type,
  required,
  list,
  name,
  disabled,
  withLabel = false,
  label,
}: FormInputProps<T>) {
  return (
    <div>
      {withLabel && (
        <label
          htmlFor={name}
          className="blocmediumk text-sm text-secondary mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value as string}
        onChange={onChange}
        className={className}
        required={required}
        name={name}
        list={list}
        disabled={disabled}
      />
    </div>
  );
}
