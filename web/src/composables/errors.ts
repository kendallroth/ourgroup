export type ErrorType = string | Record<string, any>;

// Default error that will be used when no error message is found
const DEFAULT_ERROR_MESSAGE = "An unknown error occurred";

/**
 * Get an error message from an error
 *
 * @param   error          - Error object/string
 * @param   defaultMessage - Default error message
 * @returns Error message
 */
const getError = (error: ErrorType, defaultMessage?: string): string => {
  if (!error) return "";

  const errorMessage = getErrorMessage(error);
  if (!errorMessage) return defaultMessage ?? DEFAULT_ERROR_MESSAGE;

  return errorMessage;
};

/**
 * Get an error code from an error (for UI error checks)
 *
 * @param   error - Error object/string
 * @returns Error code
 */
const getErrorCode = (error: ErrorType): string | null => {
  if (!error) return null;
  if (typeof error !== "object") return null;

  // API errors are returned in an interesting nested format
  if (error.response && error.response.data) {
    return error.response.data.code;
  }

  return null;
};

/**
 * Get an error message from an error
 *
 * @param   error - Error object/string
 * @returns Error message
 */
const getErrorMessage = (error: ErrorType): string | null => {
  if (!error) return null;

  // Errors are often provided as an object, but the message 'key' may vary
  if (typeof error === "object") {
    // API errors are returned in an interesting nested format
    let message = error.message;
    if (error.response && error.response.data) {
      message = error.response.data.message;
      return Array.isArray(message) ? message[0] : message;
    }

    // 'message' key should always be checked last (most common, likely not set manually)
    if (message) return message;
  }
  // A bare error code may be provided instead of an error object
  else if (typeof error === "string") {
    return error;
  }

  return null;
};

/**
 * Determine whether an error includes a specific error code
 *
 * @param   error           - Error object/string
 * @param   targetErrorCode - Target error code
 * @returns Whether error includes specific error code
 */
const hasError = (error: ErrorType, targetErrorCode: string): boolean => {
  if (!error) return false;

  const errorCode = getErrorCode(error);
  if (!errorCode) return false;

  return errorCode === targetErrorCode;
};

const useErrors = () => {
  return {
    getError,
    getErrorCode,
    getErrorMessage,
    hasError,
  };
};

export { useErrors };
