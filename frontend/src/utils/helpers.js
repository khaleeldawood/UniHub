/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format date for form inputs (YYYY-MM-DDTHH:mm)
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

/**
 * Get time ago string (e.g., "2 hours ago")
 */
export const getTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get badge color based on points threshold
 */
export const getBadgeColor = (badgeName) => {
  const colors = {
    'Newcomer': 'secondary',
    'Explorer': 'info',
    'Contributor': 'primary',
    'Leader': 'success',
    'Champion': 'warning',
    'Legend': 'danger'
  };
  return colors[badgeName] || 'secondary';
};

/**
 * Get status badge variant
 */
export const getStatusVariant = (status) => {
  const variants = {
    'PENDING': 'warning',
    'APPROVED': 'success',
    'CANCELLED': 'danger',
    'REJECTED': 'danger'
  };
  return variants[status] || 'secondary';
};

/**
 * Get role badge variant
 */
export const getRoleVariant = (role) => {
  const variants = {
    'STUDENT': 'primary',
    'SUPERVISOR': 'success',
    'ADMIN': 'danger',
    'ORGANIZER': 'danger',
    'VOLUNTEER': 'success',
    'ATTENDEE': 'info'
  };
  return variants[role] || 'secondary';
};

/**
   * Calculate progress percentage for badge
   */
export const calculateBadgeProgress = (currentPoints, badgeThreshold) => {
  if (badgeThreshold === 0) return 100;
  return Math.min(Math.round((currentPoints / badgeThreshold) * 100), 100);
};

/**
 * Format points with commas
 */
export const formatPoints = (points) => {
  if (!points && points !== 0) return '0';
  return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type) => {
  const icons = {
    'BADGE_EARNED': '🏆',
    'LEVEL_UP': '⬆️',
    'EVENT_UPDATE': '📅',
    'BLOG_APPROVAL': '📝',
    'SYSTEM_ALERT': '⚠️'
  };
  return icons[type] || '🔔';
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) > new Date();
};

/**
 * Check if date is in the past
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
