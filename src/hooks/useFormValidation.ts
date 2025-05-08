import { useState, useEffect } from 'react';

type ValidationRule = (value: string) => string | null;

interface UseFormValidationProps {
  initialValues: { [key: string]: string };
  validationRules: { [key: string]: ValidationRule[] };
  onSubmit?: (values: { [key: string]: string }) => void;
}

interface ValidationErrors {
  [key: string]: string | null;
}

export function useFormValidation({ initialValues, validationRules, onSubmit }: UseFormValidationProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const newErrors: ValidationErrors = {};
    for (const key in validationRules) {
      newErrors[key] = validateField(key, values[key]);
    }
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === null)) {
      onSubmit?.(values);
    }
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    validateField,
    validateAll,
    isSubmitting,
  };
}