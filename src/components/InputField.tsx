import React, { useState, useId } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';

interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password' | 'email';
  clearable?: boolean;
  onClear?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  value ,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  clearable = false,
  onClear,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputId = useId();
  const helperTextId = useId();
  const errorId = useId();

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const displayValue = value !== undefined ? value : internalValue;
  const hasError = invalid || !!errorMessage;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(e);
  };

  const handleClear = () => {
    const syntheticEvent = {
      target: { value: '' },
      currentTarget: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>;
    
    if (value === undefined) {
      setInternalValue('');
    }
    onChange?.(syntheticEvent);
    onClear?.();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
  };

  const helperTextSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  // Variant classes
  const getVariantClasses = () => {
    const baseClasses = 'w-full rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
    
    if (hasError) {
      switch (variant) {
        case 'filled':
          return `${baseClasses} bg-red-50 border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500`;
        case 'outlined':
          return `${baseClasses} bg-white border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500`;
        case 'ghost':
          return `${baseClasses} bg-transparent border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500`;
        default:
          return `${baseClasses} border-red-300 focus:ring-red-500 focus:border-red-500`;
      }
    }

    if (disabled) {
      switch (variant) {
        case 'filled':
          return `${baseClasses} bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed`;
        case 'outlined':
          return `${baseClasses} bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed`;
        case 'ghost':
          return `${baseClasses} bg-transparent border-gray-200 text-gray-500 cursor-not-allowed`;
        default:
          return `${baseClasses} border-gray-200 cursor-not-allowed`;
      }
    }

    switch (variant) {
      case 'filled':
        return `${baseClasses} bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 focus:ring-blue-500 focus:border-blue-500`;
      case 'outlined':
        return `${baseClasses} bg-white border-gray-300 text-gray-900 hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500`;
      case 'ghost':
        return `${baseClasses} bg-transparent border-transparent text-gray-900 hover:border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
      default:
        return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
    }
  };

  const showClearButton = clearable && displayValue && !disabled && !loading;
  const showPasswordToggle = type === 'password' && !disabled && !loading;
  const hasRightIcon = showClearButton || showPasswordToggle || loading;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={`block font-medium text-gray-700 mb-1 ${labelSizeClasses[size]} ${disabled ? 'text-gray-500' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={`${getVariantClasses()} ${sizeClasses[size]} ${hasRightIcon ? 'pr-10' : ''}`}
          aria-invalid={hasError}
          aria-describedby={
            [
              helperText ? helperTextId : undefined,
              errorMessage ? errorId : undefined,
            ].filter(Boolean).join(' ') || undefined
          }
        />
        
        {/* Right side icons */}
        {hasRightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
            {loading && (
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            )}
            
            {showClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {showPasswordToggle && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Helper text and error message */}
      <div className="mt-1 min-h-[1rem]">
        {errorMessage ? (
          <p id={errorId} className={`text-red-600 ${helperTextSizeClasses[size]}`} role="alert">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={helperTextId} className={`text-gray-500 ${helperTextSizeClasses[size]}`}>
            {helperText}
          </p>
        ) : null}
      </div>
    </div>
  );
};

// Demo Component
const InputFieldDemo = () => {
  const [values, setValues] = useState({
    basic: '',
    email: '',
    password: '',
    disabled: 'Disabled input',
    error: 'Invalid input',
    loading: 'Loading...',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">InputField Component</h1>
        <p className="text-gray-600">Flexible input component with validation states and variants</p>
      </div>
      
      {/* Variants Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Outlined</h3>
            <InputField
              label="Outlined Input"
              placeholder="Enter text..."
              variant="outlined"
              value={values.basic}
              onChange={handleChange('basic')}
              helperText="This is an outlined input"
              clearable
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Filled</h3>
            <InputField
              label="Filled Input"
              placeholder="Enter text..."
              variant="filled"
              helperText="This is a filled input"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Ghost</h3>
            <InputField
              label="Ghost Input"
              placeholder="Enter text..."
              variant="ghost"
              helperText="This is a ghost input"
            />
          </div>
        </div>
      </div>

      {/* Sizes Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Sizes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Small"
            placeholder="Small input..."
            size="sm"
            helperText="Small size input"
          />
          <InputField
            label="Medium"
            placeholder="Medium input..."
            size="md"
            helperText="Medium size input (default)"
          />
          <InputField
            label="Large"
            placeholder="Large input..."
            size="lg"
            helperText="Large size input"
          />
        </div>
      </div>

      {/* States Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email..."
            value={values.email}
            onChange={handleChange('email')}
            helperText="We'll never share your email"
            clearable
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter password..."
            value={values.password}
            onChange={handleChange('password')}
            helperText="At least 8 characters"
          />
          <InputField
            label="Disabled Input"
            placeholder="This is disabled..."
            value={values.disabled}
            disabled
            helperText="This input is disabled"
          />
          <InputField
            label="Error State"
            placeholder="Invalid input..."
            value={values.error}
            onChange={handleChange('error')}
            invalid
            errorMessage="This field is required"
          />
          <InputField
            label="Loading State"
            placeholder="Loading..."
            value={values.loading}
            loading
            helperText="Processing your input..."
          />
        </div>
      </div>

      {/* Advanced Features */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Advanced Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="With Clear Button"
            placeholder="Type something to see clear button..."
            clearable
            onClear={() => console.log('Input cleared!')}
            helperText="Clear button appears when there's content"
          />
          <InputField
            label="Password with Toggle"
            type="password"
            placeholder="Enter password..."
            helperText="Click the eye icon to toggle visibility"
          />
        </div>
      </div>
    </div>
  );
};

export default InputFieldDemo;