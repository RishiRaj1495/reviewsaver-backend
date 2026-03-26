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
  const [charCount, setCharCount] = useState(0);

  const categories = [
    { value: 'Movies', label: '🎬 Movies', emoji: '🎬' },
    { value: 'Electronics', label: '📱 Electronics', emoji: '📱' },
    { value: 'Restaurants', label: '🍽️ Restaurants', emoji: '🍽️' },
    { value: 'Cafes', label: '☕ Cafes', emoji: '☕' },
    { value: 'Food', label: '🍕 Food', emoji: '🍕' }
  ];

  const handleReviewTextChange = (e) => {
    const text = e.target.value;
    setReviewText(text);
    setCharCount(text.length);
  };

  const validateForm = () => {
    if (productName.trim().length < 3) {
      setError('Product name must be at least 3 characters');
      return false;
    }
    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return false;
    }
    if (reviewText.trim().length > 500) {
      setError('Review cannot exceed 500 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const reviewData = {
        userId: user.id,
        productName: productName.trim(),
        category,
        rating,
        reviewText: reviewText.trim()
      };

      console.log('Submitting review:', reviewData);
      await reviewService.createReview(reviewData);
      
      setSuccess('✅ Review posted successfully!');
      setProductName('');
      setReviewText('');
      setCharCount(0);
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

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear the form?')) {
      setProductName('');
      setReviewText('');
      setCharCount(0);
      setRating(5);
      setCategory('Movies');
      setError('');
    }
  };

  return (
    <div className="review-form-container">
      <div className="form-header">
        <h3>✍️ Write a Review</h3>
        <button 
          type="button" 
          className="reset-btn" 
          onClick={handleReset}
          disabled={loading}
          title="Clear form"
        >
          🗑️
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Product Name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Avengers: Endgame, iPhone 15, Biryani..."
            required
            disabled={loading}
            maxLength={100}
          />
          <small className="input-hint">
            {productName.length}/100 characters
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Category <span className="required">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Rating <span className="required">*</span>
            </label>
            <div className="rating-select">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  type="button"
                  className={`rating-btn ${rating >= num ? 'active' : ''}`}
                  onClick={() => setRating(num)}
                  disabled={loading}
                  title={`${num} star${num !== 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
            <small className="input-hint">
              {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Average' : rating === 4 ? 'Good' : 'Excellent'}
            </small>
          </div>
        </div>

        <div className="form-group">
          <label>
            Your Review <span className="required">*</span>
          </label>
          <textarea
            value={reviewText}
            onChange={handleReviewTextChange}
            placeholder="Share your experience... What did you like? What could be better?"
            rows="5"
            required
            disabled={loading}
            maxLength={500}
          />
          <div className="char-counter">
            <span className={charCount > 450 ? 'warning' : ''}>
              {charCount}/500 characters
            </span>
            {charCount > 450 && charCount <= 500 && (
              <span className="char-warning">⚠️ Getting close to limit</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || productName.trim().length < 3 || reviewText.trim().length < 10}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Posting...
              </>
            ) : (
              '📝 Post Review'
            )}
          </button>
          
          <div className="form-tips">
            <small>✨ Be honest • ✨ Be helpful • ✨ Keep it clean</small>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
