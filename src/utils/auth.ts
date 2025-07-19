/**
 * Simple authentication utilities for protecting the AI chat feature
 * Uses a single access code stored in environment variables
 */

const AUTH_STORAGE_KEY = "walletfy_auth_session";
const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE || "WALLETFY2025";

const generateChecksum = (data: string): string => {
  let hash = 0;
  const secret = "walletfy-2025-prof";
  const combined = data + secret;

  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(36);
};

/**
 * Check if the user is currently authenticated
 * Authentication persists for the browser session
 */
export const checkAuth = (): boolean => {
  try {
    const authSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!authSession) return false;

    const session = JSON.parse(authSession);

    if (!session.authenticated || !session.timestamp || !session.checksum) {
      return false;
    }

    const dataToCheck = `${session.authenticated}-${session.timestamp}`;
    const expectedChecksum = generateChecksum(dataToCheck);

    if (session.checksum !== expectedChecksum) {
      console.warn("Session integrity check failed");
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return false;
    }

    const sessionAge = Date.now() - new Date(session.timestamp).getTime();
    const maxAge = 24 * 60 * 60 * 1000;

    if (sessionAge > maxAge) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return false;
  }
};

/**
 * Authenticate with an access code
 * @param code - The access code to validate
 * @returns true if authentication successful, false otherwise
 */
export const authenticate = (code: string): boolean => {
  try {
    if (code.trim() === ACCESS_CODE) {
      const timestamp = new Date().toISOString();
      const dataToSign = `true-${timestamp}`;
      const checksum = generateChecksum(dataToSign);

      const session = {
        authenticated: true,
        timestamp,
        checksum,
      };

      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error during authentication:", error);
    return false;
  }
};

/**
 * Clear the authentication session
 */
export const logout = (): void => {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

/**
 * Get the current authentication session info
 */
export const getAuthSession = (): {
  authenticated: boolean;
  timestamp?: string;
} | null => {
  try {
    if (!checkAuth()) return null;

    const authSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!authSession) return null;

    const session = JSON.parse(authSession);
    return {
      authenticated: session.authenticated,
      timestamp: session.timestamp,
    };
  } catch (error) {
    console.error("Error getting auth session:", error);
    return null;
  }
};
