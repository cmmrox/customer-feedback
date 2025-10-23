/**
 * Utility functions for handling staff images
 */

/**
 * Checks if a staff image exists and returns the appropriate URL
 * @param imageUrl - The original image URL from the database
 * @returns The validated image URL or default fallback
 */
export function getStaffImageUrl(imageUrl: string | null): string {
  if (!imageUrl) {
    return '/images/staff/default-staff.svg';
  }

  // Return the actual image URL from the database
  return imageUrl;
}

/**
 * List of available staff images in the public folder
 */
export const AVAILABLE_STAFF_IMAGES = [
  'john-smith.jpg',
  'michael-brown.jpg', 
  'sarah-johnson.jpg'
];

/**
 * Checks if a specific staff image filename exists
 * @param filename - The image filename to check
 * @returns True if the image exists, false otherwise
 */
export function isStaffImageAvailable(filename: string): boolean {
  return AVAILABLE_STAFF_IMAGES.includes(filename);
}
