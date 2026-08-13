import { getDashboardData } from '../services/analyticsService.js';

// @desc    Get dashboard analytics data
// @route   GET /api/analytics/dashboard
// @access  Private (Admin Only)
export const getDashboard = async (req, res) => {
  try {
    const { adminEmail, from, to, location } = req.query;

    // Reusing the existing admin authorization convention
    if (!adminEmail || adminEmail.trim().toLowerCase() !== 'hency.shah@somaiya.edu') {
      return res.status(403).json({ message: 'Access Denied: Authorized Admin Only' });
    }

    const data = await getDashboardData(null, from, to, location);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    res.status(500).json({ message: error.message });
  }
};
