// services/teamService.js
const API_URL = '/api/team';

const teamService = {
  getPerformance: async (token) => {
    const res = await fetch(`${API_URL}/performance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }
};

export default teamService;
