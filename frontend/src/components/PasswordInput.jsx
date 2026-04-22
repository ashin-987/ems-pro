import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

/**
 * Password Input with Strength Meter
 * 
 * Features:
 * - Show/hide password toggle
 * - Real-time strength calculation
 * - Visual strength indicator
 * - Requirement checklist
 * - Accessibility support
 */

const PasswordInput = ({ 
  value, 
  onChange, 
  name,
  placeholder = "Enter password",
  showStrength = true,
  showRequirements = true,
  error,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false
  });

  useEffect(() => {
    if (value) {
      calculateStrength(value);
    } else {
      setStrength(0);
      setRequirements({
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false
      });
    }
  }, [value]);

  const calculateStrength = (password) => {
    const reqs = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password)
    };

    setRequirements(reqs);

    // Calculate strength score (0-4)
    const score = Object.values(reqs).filter(Boolean).length;
    setStrength(score);
  };

  const getStrengthLabel = () => {
    if (strength === 0) return { text: '', color: '' };
    if (strength <= 2) return { text: 'Weak', color: 'text-red-600' };
    if (strength === 3) return { text: 'Fair', color: 'text-yellow-600' };
    if (strength === 4) return { text: 'Good', color: 'text-green-600' };
    if (strength === 5) return { text: 'Strong', color: 'text-green-700' };
  };

  const getStrengthBarColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strengthLabel = getStrengthLabel();

  return (
    <div className="space-y-2">
      {/* Password Input Field */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 pr-10 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
          }`}
          aria-describedby={showRequirements ? `${name}-requirements` : undefined}
          {...props}
        />
        
        {/* Show/Hide Toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Strength Meter */}
      {showStrength && value && (
        <div className="space-y-1">
          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getStrengthBarColor()} transition-all duration-300`}
              style={{ width: `${(strength / 5) * 100}%` }}
              role="progressbar"
              aria-valuenow={strength}
              aria-valuemin={0}
              aria-valuemax={5}
              aria-label="Password strength"
            />
          </div>
          
          {/* Strength Label */}
          <p className={`text-xs font-medium ${strengthLabel.color}`}>
            {strengthLabel.text && `Password strength: ${strengthLabel.text}`}
          </p>
        </div>
      )}

      {/* Requirements Checklist */}
      {showRequirements && value && (
        <div 
          id={`${name}-requirements`}
          className="bg-gray-50 rounded-lg p-3 space-y-2"
          role="region"
          aria-label="Password requirements"
        >
          <p className="text-xs font-medium text-gray-700 mb-2">
            Password must contain:
          </p>
          <ul className="space-y-1">
            <RequirementItem 
              met={requirements.minLength}
              text="At least 8 characters"
            />
            <RequirementItem 
              met={requirements.hasUpper}
              text="One uppercase letter"
            />
            <RequirementItem 
              met={requirements.hasLower}
              text="One lowercase letter"
            />
            <RequirementItem 
              met={requirements.hasNumber}
              text="One number"
            />
            <RequirementItem 
              met={requirements.hasSpecial}
              text="One special character (!@#$%^&*)"
            />
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Individual Requirement Item Component
 */
const RequirementItem = ({ met, text }) => (
  <li className="flex items-center gap-2 text-xs">
    {met ? (
      <Check className="h-4 w-4 text-green-600 flex-shrink-0" aria-label="Requirement met" />
    ) : (
      <X className="h-4 w-4 text-gray-400 flex-shrink-0" aria-label="Requirement not met" />
    )}
    <span className={met ? 'text-green-700' : 'text-gray-600'}>
      {text}
    </span>
  </li>
);

export default PasswordInput;
