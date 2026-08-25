const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analytics`;

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

  const response = await fetch(`${API_BASE}/dashboard?${query.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve analytics dashboard data.');
  }

  return data;
}
