/** Max size for image uploads: 10 MB */
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_SIZE_MB = 10;

/**
 * Returns true if the file size is within the allowed limit (10 MB).
 */
export function isImageSizeValid(file: File): boolean {
  return file.size <= MAX_IMAGE_SIZE_BYTES;
}

/**
 * Default error message when image exceeds size limit.
 */
export const IMAGE_SIZE_ERROR_MESSAGE = `Each image must be ${MAX_IMAGE_SIZE_MB} MB or less.`;
