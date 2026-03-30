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
  const [productCharCount, setProductCharCount] = useState(0);

  const categories = [
    { value: 'Movies', label: 'Movies', icon: '🎬', emoji: '🎬', color: '#e74c3c' },
    { value: 'Electronics', label: 'Electronics', icon: '📱', emoji: '📱', color: '#3498db' },
    { value: 'Restaurants', label: 'Restaurants', icon: '🍽️', emoji: '🍽️', color: '#e67e22' },
    { value: 'Cafes', label: 'Cafes', icon: '☕', emoji: '☕', color: '#9b59b6' },
    { value: 'Food', label: 'Food', icon: '🍕', emoji: '🍕', color: '#27ae60' }
  ];

  const handleProductNameChange = (e) => {
    const text = e.target.value;
    setProductName(text);
    setProductCharCount(text.length);
  };

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

      await reviewService.createReview(reviewData);
      
      // Update user preferences for recommendations
      try {
        await reviewService.updatePreferences(user.id);
      } catch (prefError) {
        console.error('Failed to update preferences:', prefError);
      }
      
      setSuccess('✅ Review posted successfully!');
      setProductName('');
      setProductCharCount(0);
      setReviewText('');
      setCharCount(0);
      setRating(5);
      
      // This calls handleReviewAdded in App.js which triggers loadUserStats()
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
      setProductCharCount(0);
      setReviewText('');
      setCharCount(0);
      setRating(5);
      setCategory('Movies');
      setError('');
    }
  };

  const getCategoryIcon = (catValue) => {
    const cat = categories.find(c => c.value === catValue);
    return cat ? cat.icon : '📋';
  };

  const getRatingText = () => {
    switch(rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Average';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Excellent';
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
          <span className="reset-icon">🗑️</span>
          <span className="reset-text">Clear</span>
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Product Name Field */}
        <div className="form-group">
          <label className="form-label">
            Product Name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={handleProductNameChange}
            placeholder="e.g., Avengers: Endgame, iPhone 15, Biryani..."
            required
            disabled={loading}
            maxLength={100}
            className="form-input"
          />
          <div className="char-counter">
            <span className={`char-count ${productCharCount > 90 ? 'warning' : ''}`}>
              {productCharCount}/100 characters
            </span>
          </div>
        </div>

        {/* Category and Rating Row */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Category <span className="required">*</span>
            </label>
            <div className="category-select-wrapper">
              <span className="category-icon">{getCategoryIcon(category)}</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={loading}
                className="category-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Rating <span className="required">*</span>
            </label>
            <div className="rating-container">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`star-btn ${rating >= num ? 'active' : ''}`}
                    onClick={() => setRating(num)}
                    disabled={loading}
                    title={`${num} star${num !== 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="rating-text">{getRatingText()}</span>
            </div>
          </div>
        </div>

        {/* Review Text Field */}
        <div className="form-group">
          <label className="form-label">
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
            className="form-textarea"
          />
          <div className="char-counter">
            <span className={`char-count ${charCount > 450 ? 'warning' : ''}`}>
              {charCount}/500 characters
            </span>
            {charCount > 450 && charCount <= 500 && (
              <span className="char-warning">⚠️ Getting close to limit</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
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
          <span className="tip">✨ Be honest</span>
          <span className="tip-dot">•</span>
          <span className="tip">✨ Be helpful</span>
          <span className="tip-dot">•</span>
          <span className="tip">✨ Keep it clean</span>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
