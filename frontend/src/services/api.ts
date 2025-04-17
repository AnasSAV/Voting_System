import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050'; // Update this to match your backend URL

export interface Vote {
  team_name: string;
}

export interface VoteResult {
  team_name: string;
  count: number;
}

export const api = {
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

  // Get voting results
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