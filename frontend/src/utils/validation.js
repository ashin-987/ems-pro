// Validation utility for forms - Industry standard validation rules

export const validators = {
  // Required field validator
  required: (value, fieldName = 'This field') => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`;
    }
    if (typeof value === 'string' && !value.trim()) {
      return `${fieldName} cannot be empty`;
    }
    return null;
  },

  // Email validator
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },

  // Phone number validator (supports various formats)
  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(value) ? null : 'Please enter a valid phone number';
  },

  // Minimum length validator
  minLength: (min) => (value, fieldName = 'This field') => {
    if (!value) return null;
    return value.length >= min ? null : `${fieldName} must be at least ${min} characters`;
  },

  // Maximum length validator
  maxLength: (max) => (value, fieldName = 'This field') => {
    if (!value) return null;
    return value.length <= max ? null : `${fieldName} must not exceed ${max} characters`;
  },

  // Password strength validator
  password: (value) => {
    if (!value) return null;
    
    const errors = [];
    if (value.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(value)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(value)) errors.push('one lowercase letter');
    if (!/[0-9]/.test(value)) errors.push('one number');
    if (!/[!@#$%^&*]/.test(value)) errors.push('one special character (!@#$%^&*)');
    
    return errors.length === 0 
      ? null 
      : `Password must contain ${errors.join(', ')}`;
  },

  // Aadhar number validator (Indian ID)
  aadhar: (value) => {
    if (!value) return null;
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(value.replace(/\s/g, '')) 
      ? null 
      : 'Aadhar number must be 12 digits';
  },

  // PAN number validator (Indian Tax ID)
  pan: (value) => {
    if (!value) return null;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(value.toUpperCase()) 
      ? null 
      : 'Invalid PAN format (e.g., ABCDE1234F)';
  },

  // Date validator (not in future)
  pastDate: (value, fieldName = 'Date') => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today ? null : `${fieldName} cannot be in the future`;
  },

  // Date range validator
  dateInRange: (min, max) => (value, fieldName = 'Date') => {
    if (!value) return null;
    const date = new Date(value);
    const minDate = min ? new Date(min) : null;
    const maxDate = max ? new Date(max) : null;
    
    if (minDate && date < minDate) {
      return `${fieldName} must be after ${minDate.toLocaleDateString()}`;
    }
    if (maxDate && date > maxDate) {
      return `${fieldName} must be before ${maxDate.toLocaleDateString()}`;
    }
    return null;
  },

  // Numeric validator
  numeric: (value, fieldName = 'This field') => {
    if (!value) return null;
    return !isNaN(value) ? null : `${fieldName} must be a number`;
  },

  // Range validator
  range: (min, max) => (value, fieldName = 'Value') => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (num < min || num > max) {
      return `${fieldName} must be between ${min} and ${max}`;
    }
    return null;
  },

  // Alphanumeric validator
  alphanumeric: (value, fieldName = 'This field') => {
    if (!value) return null;
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(value) ? null : `${fieldName} must contain only letters and numbers`;
  },

  // URL validator
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  // Custom regex validator
  pattern: (regex, message) => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  }
};

// Combine multiple validators
export const combineValidators = (...validatorFuncs) => (value, fieldName) => {
  for (const validator of validatorFuncs) {
    const error = validator(value, fieldName);
    if (error) return error;
  }
  return null;
};

// Validate entire form
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];
    const fieldName = rules.fieldName || field;
    
    // If rules is an array of validators
    if (Array.isArray(rules.validators)) {
      for (const validator of rules.validators) {
        const error = validator(value, fieldName);
        if (error) {
          errors[field] = error;
          break; // Stop at first error for this field
        }
      }
    }
    // If rules is a single validator function
    else if (typeof rules === 'function') {
      const error = rules(value, fieldName);
      if (error) {
        errors[field] = error;
      }
    }
  }
  
  return errors;
};

// Employee form specific validations
export const employeeValidationRules = {
  firstName: {
    fieldName: 'First name',
    validators: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50)
    ]
  },
  lastName: {
    fieldName: 'Last name',
    validators: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50)
    ]
  },
  email: {
    fieldName: 'Email',
    validators: [
      validators.required,
      validators.email
    ]
  },
  phoneNumber: {
    fieldName: 'Phone number',
    validators: [
      validators.required,
      validators.phone
    ]
  },
  dateOfBirth: {
    fieldName: 'Date of birth',
    validators: [
      validators.required,
      validators.pastDate
    ]
  },
  aadharNumber: {
    fieldName: 'Aadhar number',
    validators: [
      validators.aadhar
    ]
  },
  department: {
    fieldName: 'Department',
    validators: [
      validators.required
    ]
  },
  designation: {
    fieldName: 'Designation',
    validators: [
      validators.required,
      validators.minLength(2)
    ]
  },
  salary: {
    fieldName: 'Salary',
    validators: [
      validators.required,
      validators.numeric,
      validators.range(0, 10000000)
    ]
  }
};

// Real-time field validator hook
export const useFieldValidation = (value, validationRules, touchedFields = {}) => {
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    if (touchedFields[field] || value) {
      const validationError = validationRules(value);
      setError(validationError);
    }
  }, [value, touchedFields]);
  
  return error;
};

export default {
  validators,
  combineValidators,
  validateForm,
  employeeValidationRules
};