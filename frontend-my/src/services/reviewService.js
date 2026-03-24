import API_BASE_URL from '../config';

const reviewService = {
  login: async (email, deviceHash) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, deviceHash })
      });
      const data = await response.json();
      console.log('Login response:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getReviews: async (page = 0, size = 10, category = null) => {
    try {
      let url = `${API_BASE_URL}/reviews/paged?page=${page}&size=${size}`;
      
      if (category && category !== 'all') {
        url = `${API_BASE_URL}/reviews/category/${category}/paged?page=${page}&size=${size}`;
      }
      
      console.log('Fetching reviews from:', url);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Reviews response:', data);
      return data;
    } catch (error) {
      console.error('Get reviews error:', error);
      throw error;
    }
  },

  searchReviews: async (query, page = 0, size = 10) => {
    try {
      const url = `${API_BASE_URL}/reviews/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`;
      console.log('Searching reviews from:', url);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Search response:', data);
      return data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  createReview: async (reviewData) => {
    try {
      console.log('Creating review with data:', reviewData);
      console.log('API URL:', `${API_BASE_URL}/reviews`);
      
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });
      
      console.log('Create review response status:', response.status);
      const data = await response.json();
      console.log('Create review response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create review');
      }
      
      return data;
    } catch (error) {
      console.error('Create review error:', error);
      throw error;
    }
  },

  upvote: async (reviewId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/upvote`, {
        method: 'PUT'
      });
      return response.json();
    } catch (error) {
      console.error('Upvote error:', error);
      throw error;
    }
  },

  downvote: async (reviewId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/downvote`, {
        method: 'PUT'
      });
      return response.json();
    } catch (error) {
      console.error('Downvote error:', error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      const data = await response.json();
      console.log('User profile:', data);
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  // Get user stats
  getUserStats: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`);
      const data = await response.json();
      console.log('User stats:', data);
      return data;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },

  // Get user's own reviews (for dashboard)
  getMyReviews: async (userId, page = 0, size = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}/all?page=${page}&size=${size}`);
      const data = await response.json();
      console.log('My reviews:', data);
      return data;
    } catch (error) {
      console.error('Get my reviews error:', error);
      throw error;
    }
  }
};

export default reviewService;
