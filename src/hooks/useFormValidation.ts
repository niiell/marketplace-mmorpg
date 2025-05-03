import { useState, useEffect } from 'react';

type ValidationRule = (value: string) => string | null;

interface UseFormValidationProps {
  initialValues: { [key: string]: string };
  validationRules: { [key: string]: ValidationRule[] };
}

interface ValidationErrors {
  [key: string]: string | null;
}

export function useFormValidation({ initialValues, validationRules }: UseFormValidationProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    validateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const validateField = (name: string, value: string): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };

  const validateAll = () => {
    const newErrors: ValidationErrors = {};
    for (const key in validationRules) {
      newErrors[key] = validateField(key, values[key]);
    }
    setErrors(newErrors);
  };

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return {
    values,
    errors,
    handleChange,
    validateField,
    validateAll,
  };
}
