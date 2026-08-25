export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Safe fetch wrapper that handles network errors gracefully and provides actionable error messages.
 * 
 * @param {string} endpoint - Relative path (e.g. '/api/visitors/search') or full URL
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, options);
    return response;
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.toLowerCase().includes('fetch')) {
      throw new Error(`Unable to connect to server at ${API_BASE_URL}. Please ensure the backend server is running.`);
    }
    throw err;
  }
}
