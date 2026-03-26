import React, { useState, useEffect, useCallback } from 'react';
import reviewService from '../services/reviewService';
import './UserReviewsModal.css';

function UserReviewsModal({ isOpen, onClose, userId, title, sortType }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);

  const loadReviews = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      let data;
      switch (sortType) {
        case 'upvotes':
          data = await reviewService.getUserReviewsByUpvotes(userId, page, 10);
          break;
        case 'downvotes':
          data = await reviewService.getUserReviewsByDownvotes(userId, page, 10);
          break;
        case 'recent':
          data = await reviewService.getUserReviewsRecent(userId, page, 10);
          break;
        default:
          data = await reviewService.getMyReviews(userId, page, 10);
      }
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, page, sortType]);

  useEffect(() => {
    if (isOpen && userId) {
      loadReviews();
    }
  }, [isOpen, userId, page, sortType, loadReviews]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getSortTypeIcon = () => {
    switch (sortType) {
      case 'upvotes':
        return '⭐';
      case 'downvotes':
        return '⚠️';
      case 'recent':
        return '🕐';
      default:
        return '📝';
    }
  };

  const handleRetry = () => {
    setPage(0);
    loadReviews();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <span className="modal-icon">{getSortTypeIcon()}</span>
            <h2>{title}</h2>
          </div>
          <div className="modal-stats">
            {totalElements > 0 && (
              <span className="modal-stats-badge">
                {totalElements} review{totalElements !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✖
          </button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="modal-spinner"></div>
              <p>Loading your reviews...</p>
            </div>
          ) : error ? (
            <div className="modal-error">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button onClick={handleRetry} className="modal-retry-btn">
                Try Again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="modal-empty">
              <div className="empty-icon">📭</div>
              <h3>No reviews found</h3>
              <p>You haven't posted any reviews in this category yet.</p>
              <button onClick={onClose} className="empty-close-btn">
                Start Writing
              </button>
            </div>
          ) : (
            <>
              <div className="modal-reviews-list">
                {reviews.map((review, index) => (
                  <div 
                    key={review.id} 
                    className="modal-review-card"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="review-card-header">
                      <div className="review-product-info">
                        <h3>{review.productName}</h3>
                        <span className="modal-category-badge">{review.category}</span>
                      </div>
                      <div className="review-rating-stars">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    
                    <p className="modal-review-text">"{review.reviewText}"</p>
                    
                    <div className="review-card-footer">
                      <div className="modal-vote-stats">
                        <div className="vote-stat upvote-stat">
                          <span className="vote-icon">👍</span>
                          <span className="vote-count">{review.upvotes}</span>
                        </div>
                        <div className="vote-stat downvote-stat">
                          <span className="vote-icon">👎</span>
                          <span className="vote-count">{review.downvotes}</span>
                        </div>
                      </div>
                      <div className="modal-review-date">
                        <span className="date-icon">📅</span>
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="modal-pagination">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="modal-page-btn"
                  >
                    ← Previous
                  </button>
                  <div className="modal-page-info">
                    <span className="modal-current-page">{page + 1}</span>
                    <span className="modal-total-pages"> / {totalPages}</span>
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="modal-page-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserReviewsModal;
