import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050'; // Update this to match your backend URL

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export interface Vote {
  team_name: string;
}

export interface VoteResult {
  team_name: string;
  count: number;
}

export const api = {
  // Admin authentication
  adminLogin: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  adminLogout: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/logout`);
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  checkAdminStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/status`);
      return response.data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      throw error;
    }
  },

  // Submit a vote
  submitVote: async (teamName: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/submit_vote`, {
        team: teamName
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting vote:', error);
      throw error;
    }
  },

  // Get voting results (protected route)
  getResults: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/results`);
      return response.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  }
}; 