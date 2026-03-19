import React, { useState } from 'react';
import './ReviewForm.css';
import reviewService from '../services/reviewService';

function ReviewForm({ user, onReviewAdded }) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Movies');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['Movies', 'Electronics', 'Restaurants', 'Cafes', 'Food'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const reviewData = {
        userId: user.id,
        productName,
        category,
        rating,
        reviewText
      };

      console.log('Submitting review:', reviewData);
      await reviewService.createReview(reviewData);
      
      setSuccess('✅ Review posted successfully!');
      setProductName('');
      setReviewText('');
      setRating(5);
      
      if (onReviewAdded) {
        onReviewAdded();
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error posting review:', err);
      setError('❌ Failed to post review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>✍️ Write a Review</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Avengers: Endgame"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Rating:</label>
            <div className="rating-select">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  type="button"
                  className={`rating-btn ${rating >= num ? 'active' : ''}`}
                  onClick={() => setRating(num)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Your Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            rows="4"
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;