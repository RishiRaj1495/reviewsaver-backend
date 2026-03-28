import API_BASE_URL from '../config';

const reviewService = {
  // ========== AUTHENTICATION ==========
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

  // ========== REVIEWS CRUD ==========
  getReviews: async (page = 0, size = 10, category = null, sortBy = 'createdAt', sortDir = 'desc') => {
    try {
      let url = `${API_BASE_URL}/reviews/paged?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
      
      if (category && category !== 'all') {
        url = `${API_BASE_URL}/reviews/category/${category}/paged?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
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

  // ========== VOTING ==========
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

  // ========== USER PROFILE ==========
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

  // ========== USER REVIEWS ==========
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
  },

  getUserReviewsByUpvotes: async (userId, page = 0, size = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}/sorted?sortBy=upvotes&sortDir=desc&page=${page}&size=${size}`);
      const data = await response.json();
      console.log('User reviews by upvotes:', data);
      return data;
    } catch (error) {
      console.error('Get user reviews by upvotes error:', error);
      throw error;
    }
  },

  getUserReviewsByDownvotes: async (userId, page = 0, size = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}/sorted?sortBy=downvotes&sortDir=desc&page=${page}&size=${size}`);
      const data = await response.json();
      console.log('User reviews by downvotes:', data);
      return data;
    } catch (error) {
      console.error('Get user reviews by downvotes error:', error);
      throw error;
    }
  },

  getUserReviewsRecent: async (userId, page = 0, size = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}/all?page=${page}&size=${size}`);
      const data = await response.json();
      console.log('User recent reviews:', data);
      return data;
    } catch (error) {
      console.error('Get user recent reviews error:', error);
      throw error;
    }
  },

  // ========== RECOMMENDATION METHODS ==========

  // Get personalized recommendations for user
  getRecommendations: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/recommendations/${userId}`);
      const data = await response.json();
      console.log('Recommendations response:', data);
      return data;
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  },

  // Get trending reviews
  getTrending: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/trending`);
      const data = await response.json();
      console.log('Trending response:', data);
      return data;
    } catch (error) {
      console.error('Get trending error:', error);
      throw error;
    }
  },

  // Track user interaction (view, click, etc.)
  trackInteraction: async (userId, reviewId, type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/track-interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reviewId, type })
      });
      return response.text();
    } catch (error) {
      console.error('Track interaction error:', error);
    }
  },

  // Update user preferences (call after posting review)
  updatePreferences: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/update-preferences/${userId}`, {
        method: 'POST'
      });
      return response.text();
    } catch (error) {
      console.error('Update preferences error:', error);
    }
  },

  // ========== UTILITY ==========
  generateDeviceHash: () => {
    let hash = localStorage.getItem('deviceHash');
    if (!hash) {
      hash = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('deviceHash', hash);
    }
    return hash;
  }
};

export default reviewService;
