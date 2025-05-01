/**
 * Generate a unique ID string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Format a price with currency symbol
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Format a date string to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Get readable text for priority levels
 */
export const getPriorityText = (level: 1 | 2 | 3): string => {
  switch (level) {
    case 1:
      return 'Low';
    case 2:
      return 'Medium';
    case 3:
      return 'High';
    default:
      return 'Unknown';
  }
};

/**
 * Get color class for priority levels
 */
export const getPriorityColorClass = (level: 1 | 2 | 3): string => {
  switch (level) {
    case 1:
      return 'bg-blue-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Truncate text with ellipsis if it exceeds a certain length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Extract domain from URL for display
 */
export const extractDomain = (url: string): string => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace('www.', '');
  } catch (error) {
    return url;
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};