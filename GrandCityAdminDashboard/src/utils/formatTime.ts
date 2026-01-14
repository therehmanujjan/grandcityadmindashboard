/**
 * Format a timestamp as a relative time string (e.g., "2 hours ago", "Just now")
 * @param timestamp - ISO timestamp string or Date object
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: string | Date | null | undefined): string {
    // Handle null/undefined
    if (!timestamp) {
        return 'Unknown time';
    }

    try {
        const now = new Date();
        const then = new Date(timestamp);

        // Check if date is valid
        if (isNaN(then.getTime())) {
            console.warn('Invalid timestamp:', timestamp);
            return 'Invalid date';
        }

        const diffMs = now.getTime() - then.getTime();

        // Handle future dates
        if (diffMs < 0) {
            return 'Just now';
        }

        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffSeconds < 10) {
            return 'Just now';
        } else if (diffSeconds < 60) {
            return `${diffSeconds} ${diffSeconds === 1 ? 'second' : 'seconds'} ago`;
        } else if (diffMinutes === 1) {
            return '1 minute ago';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`;
        } else if (diffHours === 1) {
            return '1 hour ago';
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffWeeks === 1) {
            return '1 week ago';
        } else if (diffWeeks < 4) {
            return `${diffWeeks} weeks ago`;
        } else if (diffMonths === 1) {
            return '1 month ago';
        } else if (diffMonths < 12) {
            return `${diffMonths} months ago`;
        } else if (diffYears === 1) {
            return '1 year ago';
        } else {
            return `${diffYears} years ago`;
        }
    } catch (error) {
        console.error('Error formatting time:', error, 'for timestamp:', timestamp);
        return 'Unknown time';
    }
}
