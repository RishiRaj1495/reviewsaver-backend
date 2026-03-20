import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import './ReviewList.css';

function ReviewList({ user }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [error, setError] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading reviews - page:', page, 'category:', category);
      const data = await reviewService.getReviews(page, 10, category);
      console.log('API Response:', data);
      
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      
      if ((data.content || []).length === 0 && page === 0) {
        console.log('No reviews found');
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [page, category]);

  const handleVote = async (id, type) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }
    
    try {
      if (type === 'upvote') {
        await reviewService.upvote(id);
      } else {
        await reviewService.downvote(id);
      }
      await loadReviews();
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  if (loading && reviews.length === 0) {
    return <div className="loading">Loading reviews...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h1>📋 Reviews</h1>
        <div className="filter-section">
          <select 
            value={category} 
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            <option value="Movies">🎬 Movies</option>
            <option value="Electronics">📱 Electronics</option>
            <option value="Restaurants">🍽️ Restaurants</option>
            <option value="Cafes">☕ Cafes</option>
            <option value="Food">🍕 Food</option>
          </select>
          <button onClick={loadReviews} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews found. Try changing category or refresh.</p>
          <p className="debug-info">Debug: Total reviews in database: {totalPages * 10} (approx)</p>
        </div>
      ) : (
        <>
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <h3>{review.productName}</h3>
                  <span className="category-badge">{review.category}</span>
                </div>
                
                <div className="review-rating">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                </div>
                
                <p className="review-text">"{review.reviewText}"</p>
                
                <div className="review-footer">
                  <div className="reviewer-info">
                    <span className="reviewer-email">
                      👤 {review.user?.email || 'Anonymous'}
                    </span>
                    <span className="review-date">
                      📅 {formatDate(review.createdAt)}
                    </span>
                  </div>
                  
                  <div className="vote-buttons">
                    <button 
                      onClick={() => handleVote(review.id, 'upvote')}
                      className="vote-btn upvote"
                    >
                      👍 {review.upvotes || 0}
                    </button>
                    <button 
                      onClick={() => handleVote(review.id, 'downvote')}
                      className="vote-btn downvote"
                    >
                      👎 {review.downvotes || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 0 && (
            <div className="pagination">
              <button 
                onClick={() => setPage(p => Math.max(0, p-1))}
                disabled={page === 0}
              >
                ← Previous
              </button>
              <span>Page {page + 1} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages-1, p+1))}
                disabled={page === totalPages-1}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewList;  