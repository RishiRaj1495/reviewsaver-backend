import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import './RecommendationSection.css';

function RecommendationSection({ userId }) {
  const [recommendations, setRecommendations] = useState({
    becauseYouReviewed: [],
    trending: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadRecommendations();
    }
  }, [userId]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewService.getRecommendations(userId);
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (reviewId) => {
    if (userId && reviewId) {
      reviewService.trackInteraction(userId, reviewId, 'click');
    }
  };

  if (loading) {
    return (
      <div className="recommendation-loading">
        <div className="rec-spinner"></div>
        <p>Finding recommendations for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-error">
        <p>⚠️ {error}</p>
        <button onClick={loadRecommendations} className="rec-retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  const hasRecommendations = 
    (recommendations.becauseYouReviewed?.length > 0) ||
    (recommendations.trending?.length > 0);

  if (!hasRecommendations) {
    return (
      <div className="recommendation-empty">
        <p>📭 No recommendations yet. Start reviewing to get personalized suggestions!</p>
      </div>
    );
  }

  return (
    <div className="recommendation-section">
      <div className="rec-header">
        <h2>🎯 Recommended for You</h2>
        <button onClick={loadRecommendations} className="rec-refresh" title="Refresh recommendations">
          🔄
        </button>
      </div>

      {/* Trending Recommendations */}
      {recommendations.trending?.length > 0 && (
        <div className="recommendation-row">
          <div className="row-header">
            <h3>🔥 Trending Now</h3>
            <span className="row-badge trending-badge">Hot</span>
          </div>
          <div className="recommendation-cards">
            {recommendations.trending.slice(0, 5).map(review => (
              <a 
                key={review.id} 
                href={`/review/${review.id}`}
                className="rec-card trending-card"
                onClick={() => handleReviewClick(review.id)}
              >
                <h4>{review.productName}</h4>
                <span className="rec-category">{review.category}</span>
                <div className="rec-rating">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                </div>
                <div className="rec-footer">
                  <span className="rec-upvotes">👍 {review.upvotes} upvotes</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Because You Reviewed */}
      {recommendations.becauseYouReviewed?.length > 0 && (
        <div className="recommendation-row">
          <div className="row-header">
            <h3>📝 Because You Reviewed...</h3>
            <span className="row-badge personal-badge">Similar Taste</span>
          </div>
          <div className="recommendation-cards">
            {recommendations.becauseYouReviewed.slice(0, 3).map(review => (
              <a 
                key={review.id} 
                href={`/review/${review.id}`}
                className="rec-card personal-card"
                onClick={() => handleReviewClick(review.id)}
              >
                <h4>{review.productName}</h4>
                <span className="rec-category">{review.category}</span>
                <div className="rec-rating">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                </div>
                <p className="rec-text">"{review.reviewText?.substring(0, 60)}..."</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationSection;
