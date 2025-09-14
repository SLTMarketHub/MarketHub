import { useState, useCallback, ChangeEvent } from 'react';

type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: T[K], values: T) => boolean | string;
    message?: string;
  };
};

type Errors<T> = Partial<Record<keyof T, string>>;

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T], allValues: T = values) => {
      const rules = validationRules[name];
      if (!rules) return '';

      if (rules.required && !value) {
        return rules.message || 'This field is required';
      }

      if (value) {
        if (rules.minLength && value.length < rules.minLength) {
          return rules.message || `Minimum length is ${rules.minLength}`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          return rules.message || `Maximum length is ${rules.maxLength}`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          return rules.message || 'Invalid format';
        }

        if (rules.custom) {
          const customValidation = rules.custom(value, allValues);
          if (customValidation !== true) {
            return typeof customValidation === 'string' 
              ? customValidation 
              : 'Invalid value';
          }
        }
      }

      return '';
    },
    [validationRules, values]
  );

  const validateForm = useCallback(
    (formValues: T = values) => {
      const newErrors: Errors<T> = {};
      let isValid = true;

      (Object.keys(formValues) as Array<keyof T>).forEach((key) => {
        const error = validateField(key, formValues[key], formValues);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return { isValid, errors: newErrors };
    },
    [validateField, values]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<InputElement>) => {
      const { name, value, type } = e.target;
      const target = e.target as HTMLInputElement;
      
      // Handle different input types
      let newValue: any = value;
      if (type === 'checkbox') {
        newValue = target.checked;
      } else if (type === 'number') {
        newValue = target.valueAsNumber;
      } else if (type === 'date') {
        newValue = target.valueAsDate;
      }
      
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Only validate if there's already an error for this field
      if (errors[name as keyof T]) {
        const updatedValues = { ...values, [name]: newValue } as T;
        const error = validateField(name as keyof T, newValue, updatedValues);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [errors, validateField, values]
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();
        const { isValid } = validateForm();
        
        if (isValid) {
          setIsSubmitting(true);
          try {
            await onSubmit(values);
          } finally {
            setIsSubmitting(false);
          }
        }
      };
    },
    [validateForm, values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
    validateField,
  };
};
