import API_BASE_URL from '../config';

const reviewService = {
  login: async (email, deviceHash) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, deviceHash })
    });
    return response.json();
  },

  getReviews: async (page = 0, size = 10, category = null) => {
    let url = `${API_BASE_URL}/reviews/paged?page=${page}&size=${size}`;
    
    if (category && category !== 'all') {
      url = `${API_BASE_URL}/reviews/category/${category}/paged?page=${page}&size=${size}`;
    }
    
    const response = await fetch(url);
    return response.json();
  },

  createReview: async (reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return response.json();
  },

  upvote: async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/upvote`, {
      method: 'PUT'
    });
    return response.json();
  },

  downvote: async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/downvote`, {
      method: 'PUT'
    });
    return response.json();
  }
};

export default reviewService;