/**
 * Platform detection utilities for web and desktop environments
 */

/**
 * Check if the app is running in Tauri (desktop mode)
 */
export const isTauri = (): boolean => {
  // Check if __TAURI__ global is available
  return typeof window !== 'undefined' && '__TAURI__' in window;
};

/**
 * Check if the app is running in web mode
 */
export const isWeb = (): boolean => {
  return !isTauri();
};

/**
 * Get the current platform type
 */
export const getPlatform = (): 'web' | 'desktop' => {
  return isTauri() ? 'desktop' : 'web';
};
