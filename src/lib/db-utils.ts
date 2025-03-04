/**
 * Utility function to format database error messages
 * @param error The error object from the database operation
 * @param defaultMessage Default message to show if error is not an instance of Error
 * @returns Formatted error message
 */
export function formatDatabaseError(error: unknown, defaultMessage = 'An unknown database error occurred'): string {
  if (error instanceof Error) {
    // Check for specific database connection errors
    if (
      error.message.includes('endpoint could not be found') || 
      error.message.includes('connection') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED')
    ) {
      return 'Database connection error: Unable to connect to the database. Please check your database configuration.';
    }
    
    // Check for authentication errors
    if (
      error.message.includes('authentication') ||
      error.message.includes('unauthorized') ||
      error.message.includes('permission')
    ) {
      return 'Database authentication error: Invalid credentials or insufficient permissions.';
    }
    
    // Return the actual error message for other cases
    return `Database error: ${error.message}`;
  }
  
  return defaultMessage;
}

/**
 * Safely executes a database operation and handles errors
 * @param dbOperation Function that performs the database operation
 * @param defaultErrorMessage Default error message if operation fails
 * @returns Result of the operation or null if it fails
 */
export async function safeDbOperation<T>(
  dbOperation: () => Promise<T>,
  defaultErrorMessage = 'Failed to perform database operation'
): Promise<{ data: T | null; error: string | null }> {
  try {
    const result = await dbOperation();
    return { data: result, error: null };
  } catch (error) {
    console.error('Database operation failed:', error);
    const errorMessage = formatDatabaseError(error, defaultErrorMessage);
    return { data: null, error: errorMessage };
  }
} 