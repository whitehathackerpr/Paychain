import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { ERROR_MESSAGES } from '../constants';

interface ValidationRule {
  field: string;
  validate: (value: any) => boolean;
  message: string;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRule[];
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationRules = [],
  onSubmit,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const validate = useCallback(
    (valuesToValidate: T): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      validationRules.forEach((rule) => {
        const value = valuesToValidate[rule.field];
        if (!rule.validate(value)) {
          newErrors[rule.field] = rule.message;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value, type } = event.target;
      const newValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;
      
      setValues((prev) => ({
        ...prev,
        [field]: newValue,
      }));

      // Clear error when field is modified
      if (errors[field as string]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!validate(values)) {
        enqueueSnackbar(ERROR_MESSAGES.VALIDATION, { variant: 'error' });
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(values);
        if (onSuccess) {
          onSuccess();
        }
        if (successMessage) {
          enqueueSnackbar(successMessage, { variant: 'success' });
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
        enqueueSnackbar(errorMessage || ERROR_MESSAGES.UNKNOWN, {
          variant: 'error',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit, onSuccess, onError, successMessage, errorMessage, enqueueSnackbar]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const setFieldError = useCallback(
    (field: keyof T, error: string) => {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    },
    []
  );

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validate,
  };
}; 