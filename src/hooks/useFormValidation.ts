
import { useState } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  pattern?: RegExp;
  errorMessage?: string;
}

export type ValidationResult = { isValid: boolean; errorMessage: string };

export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (
    fieldName: string,
    value: string,
    rules: ValidationRules
  ): ValidationResult => {
    if (rules.required && !value) {
      const errorMessage = rules.errorMessage || `${fieldName} is required`;
      setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
      return { isValid: false, errorMessage };
    }

    if (rules.minLength && value.length < rules.minLength) {
      const errorMessage =
        rules.errorMessage ||
        `${fieldName} must be at least ${rules.minLength} characters`;
      setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
      return { isValid: false, errorMessage };
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      const errorMessage =
        rules.errorMessage || `Please enter a valid ${fieldName.toLowerCase()}`;
      setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
      return { isValid: false, errorMessage };
    }

    // Clear error if validation passes
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    return { isValid: true, errorMessage: '' };
  };

  const validateEmail = (email: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validateField('Email', email, {
      required: true,
      pattern: emailRegex,
      errorMessage: 'Please enter a valid email address',
    });
  };

  const validatePassword = (password: string): ValidationResult => {
    return validateField('Password', password, {
      required: true,
      minLength: 6,
      errorMessage: 'Password must be at least 6 characters',
    });
  };

  return {
    errors,
    setErrors,
    validateField,
    validateEmail,
    validatePassword,
  };
}
