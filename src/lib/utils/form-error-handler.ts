import { normalizeApiError } from "@/types";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

interface ValidationErrors {
  [key: string]: string | ValidationErrors;
}

export function processValidationErrors<T extends FieldValues>(
  errors: ValidationErrors,
  setError: UseFormSetError<T>,
  formControlFields: object,
  options: {
    showNonFieldErrors?: boolean;
    showToast?: boolean;
  } = {}
) {
  const { showNonFieldErrors = true, showToast = true } = options;

  const processError = (fieldPath: string, message: string) => {
    // Convert API paths to React Hook Form paths
    // cars.0.car_id → cars[0].car_id
    const formattedPath = fieldPath.replace(/\.(\d+)\./g, "[$1].");

    if (formattedPath in formControlFields) {
      setError(formattedPath as Path<T>, {
        type: "server",
        message,
      });
      // hasFieldErrors = true;
    } else {
      if (showNonFieldErrors && showToast) {
        toast.error(`${fieldPath}: ${message}`);
      }
    }
  };

  const handleNestedErrors = (
    prefix: string,
    nestedErrors: ValidationErrors
  ) => {
    Object.entries(nestedErrors).forEach(([key, value]) => {
      const fullPath = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        handleNestedErrors(fullPath, value);
      } else if (typeof value === "string") {
        processError(fullPath, value);
      }
    });
  };

  handleNestedErrors("", errors);

  // if (showToast && !hasFieldErrors && Object.keys(errors).length > 0) {
  //   toast.error('Please fix the errors in the form');
  //   console.log('Showed general error toast');
  // }
}

export function handleApiError<T extends FieldValues = FieldValues>(
  error: unknown,
  options: {
    setError?: UseFormSetError<T>;
    formFields?: object;
    skipUnauthorized?: boolean;
  } = { skipUnauthorized: true }
) {
  const normalizedError = normalizeApiError(error);

  if (normalizedError.status === 401 && options.skipUnauthorized) {
    throw error;
  }

  if (normalizedError.errors && options.setError && options.formFields) {
    processValidationErrors(
      normalizedError.errors,
      options.setError,
      options.formFields
    );
  }

  toast.error(normalizedError.message);
  console.error("API Error:", normalizedError);

  return normalizedError;
}

export function handleDeleteApiError(error: unknown) {
  const normalized = normalizeApiError(error);

  if (normalized.status === 401) {
    throw error;
  }

  toast.error(normalized.message);
  console.error("API Error:", normalized);

  return normalized;
}

