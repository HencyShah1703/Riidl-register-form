import { API_BASE_URL, apiFetch } from '../config/api.js';

const API_BASE = `${API_BASE_URL}/api/analytics`;

/**
 * Fetches dashboard analytics data from the backend.
 * 
 * @param {string} adminEmail 
 * @param {object} params - { from, to, location }
 * @returns {Promise<object>}
 */
export async function fetchDashboardData(adminEmail, { from, to, location } = {}) {
  const query = new URLSearchParams({
    adminEmail,
    ...(from && { from }),
    ...(to && { to }),
    ...(location && { location })
  });

  const response = await apiFetch(`${API_BASE}/dashboard?${query.toString()}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve analytics dashboard data.');
  }

  return data;
}
