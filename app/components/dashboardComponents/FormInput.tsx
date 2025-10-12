import React from 'react'

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  min?: string;
  step?: string;
  rows?: number;
  className?: string;
}

const FormInputComponent: React.FC<FormInputProps> = React.memo(({ 
  id, 
  name, 
  label, 
  type = "text", 
  placeholder, 
  required = false, 
  min, 
  step, 
  rows,
  className = ""
}) => {
  if (type === "textarea") {
    return (
      <div className="space-y-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          id={id}
          name={name}
          rows={rows || 4}
          className={`dashboard-input ${className}`}
          placeholder={placeholder}
          required={required}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className="dashboard-input"
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
      />
    </div>
  );
});

FormInputComponent.displayName = 'FormInput';

export default FormInputComponent