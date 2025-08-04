/**
 * Utility function to generate asset paths that work with any deployment scenario
 * Uses Next.js built-in environment variables to determine the base path
 */

// Use Next.js built-in BASE_PATH environment variable or default to empty string
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || '';

export function getAssetPath(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

export { basePath };
