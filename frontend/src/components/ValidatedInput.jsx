import { useState, useEffect } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

/**
 * Enhanced Input Component with Real-time Validation
 * 
 * Features:
 * - Real-time validation as user types
 * - Debounced validation for better UX
 * - Visual feedback (success/error states)
 * - Accessibility support
 * - Auto-formatting for phone and currency
 */

export const ValidatedInput = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  validate,
  format,
  helperText,
  className = '',
  ...props
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate on change (debounced)
  useEffect(() => {
    if (!touched || !validate) return;

    const timer = setTimeout(() => {
      const validationError = validate(value);
      setError(validationError || '');
      setIsValid(!validationError && value.length > 0);
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [value, validate, touched]);

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setError(validationError || '');
      setIsValid(!validationError && value.length > 0);
    }
  };

  const handleChange = (e) => {
    let newValue = e.target.value;

    // Apply formatting if provided
    if (format) {
      newValue = format(newValue);
    }

    onChange({
      ...e,
      target: {
        ...e.target,
        name,
        value: newValue
      }
    });
  };

  const showError = touched && error;
  const showSuccess = touched && isValid && !error;

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            block w-full px-3 py-2 pr-10 border rounded-lg text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${showError 
              ? 'border-red-300 focus:ring-red-500 bg-red-50' 
              : showSuccess 
                ? 'border-green-300 focus:ring-green-500 bg-green-50'
                : 'border-gray-300 focus:ring-primary-500'
            }
          `}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={
            showError ? `${name}-error` : 
            helperText ? `${name}-helper` : 
            undefined
          }
          {...props}
        />

        {/* Status Icon */}
        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {showError && (
              <X className="h-5 w-5 text-red-500" aria-hidden="true" />
            )}
            {showSuccess && (
              <Check className="h-5 w-5 text-green-500" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {showError ? (
        <p 
          id={`${name}-error`}
          className="mt-2 text-sm text-red-600 flex items-start gap-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p 
          id={`${name}-helper`}
          className="mt-2 text-sm text-gray-500"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

/**
 * Validation Functions
 */

export const validators = {
  required: (fieldName) => (value) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return '';
  },

  email: (value) => {
    if (!value) return '';
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  },

  phone: (value) => {
    if (!value) return '';
    const phoneRegex = /^[0-9]{10}$/;
    const digitsOnly = value.replace(/\D/g, '');
    if (!phoneRegex.test(digitsOnly)) {
      return 'Phone number must be 10 digits';
    }
    return '';
  },

  minLength: (min) => (value) => {
    if (!value) return '';
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return '';
  },

  maxLength: (max) => (value) => {
    if (!value) return '';
    if (value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return '';
  },

  number: (value) => {
    if (!value) return '';
    if (isNaN(value)) {
      return 'Must be a valid number';
    }
    return '';
  },

  positiveNumber: (value) => {
    if (!value) return '';
    if (isNaN(value) || parseFloat(value) <= 0) {
      return 'Must be a positive number';
    }
    return '';
  },

  combine: (...validators) => (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return '';
  }
};

/**
 * Formatters
 */

export const formatters = {
  phone: (value) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 6) {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    }
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
  },

  currency: (value) => {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  alphanumeric: (value) => {
    return value.replace(/[^a-zA-Z0-9]/g, '');
  },

  alphabetic: (value) => {
    return value.replace(/[^a-zA-Z\s]/g, '');
  }
};

/**
 * USAGE EXAMPLE:
 * 
 * import { ValidatedInput, validators, formatters } from './ValidatedInput';
 * 
 * <ValidatedInput
 *   label="Email Address"
 *   name="email"
 *   value={formData.email}
 *   onChange={handleChange}
 *   validate={validators.email}
 *   required
 *   helperText="We'll never share your email"
 * />
 * 
 * <ValidatedInput
 *   label="Phone Number"
 *   name="phone"
 *   value={formData.phone}
 *   onChange={handleChange}
 *   validate={validators.phone}
 *   format={formatters.phone}
 *   required
 * />
 * 
 * <ValidatedInput
 *   label="Salary"
 *   name="salary"
 *   value={formData.salary}
 *   onChange={handleChange}
 *   validate={validators.combine(
 *     validators.required('Salary'),
 *     validators.positiveNumber
 *   )}
 *   format={formatters.currency}
 *   required
 *   helperText="Annual salary in your local currency"
 * />
 */

export default ValidatedInput;
