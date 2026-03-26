import React, { useState, useEffect, useCallback } from 'react';
import reviewService from '../services/reviewService';
import './ReviewList.css';

function ReviewList({ user }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [votingId, setVotingId] = useState(null);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading reviews - page:', page, 'category:', category, 'sort:', sortBy, sortDir);
      const data = await reviewService.getReviews(page, 10, category, sortBy, sortDir);
      console.log('API Response:', data);
      
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      
      if ((data.content || []).length === 0 && page === 0) {
        console.log('No reviews found');
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Failed to load reviews. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [page, category, sortBy, sortDir]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadReviews();
      return;
    }
    
    setSearching(true);
    setError(null);
    try {
      console.log('Searching for:', searchTerm);
      const data = await reviewService.searchReviews(searchTerm, page, 10);
      console.log('Search results:', data);
      
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      
      if ((data.content || []).length === 0) {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search reviews');
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
    loadReviews();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortDir('desc');
    }
    setPage(0);
  };

  useEffect(() => {
    if (!searchTerm) {
      loadReviews();
    }
  }, [page, category, sortBy, sortDir, loadReviews]);

  const handleVote = async (id, type) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }
    
    setVotingId(id);
    try {
      if (type === 'upvote') {
        await reviewService.upvote(id);
      } else {
        await reviewService.downvote(id);
      }
      if (searchTerm) {
        await handleSearch();
      } else {
        await loadReviews();
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setVotingId(null);
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

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortDir === 'desc' ? '↓' : '↑';
  };

  if (loading && reviews.length === 0 && !searching) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (searching) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Searching for "{searchTerm}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={loadReviews} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <div className="header-left">
          <h1>📋 Reviews</h1>
          <div className="stats-badge">
            {totalElements.toLocaleString()} reviews
          </div>
        </div>
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
          <button onClick={loadReviews} className="refresh-btn" title="Refresh">
            🔄
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="sort-section">
        <span className="sort-label">Sort by:</span>
        <button 
          onClick={() => handleSortChange('createdAt')}
          className={`sort-btn ${sortBy === 'createdAt' ? 'active' : ''}`}
        >
          Date {getSortIcon('createdAt')}
        </button>
        <button 
          onClick={() => handleSortChange('rating')}
          className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
        >
          Rating {getSortIcon('rating')}
        </button>
        <button 
          onClick={() => handleSortChange('upvotes')}
          className={`sort-btn ${sortBy === 'upvotes' ? 'active' : ''}`}
        >
          Upvotes {getSortIcon('upvotes')}
        </button>
      </div>

      {/* Search Bar Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search reviews by product name... (e.g., Avengers, iPhone, Pizza)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          🔍 Search
        </button>
        {searchTerm && (
          <button onClick={handleClearSearch} className="clear-btn">
            ✖ Clear
          </button>
        )}
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="search-info">
          <span>🔍 Showing results for: <strong>"{searchTerm}"</strong></span>
          {reviews.length === 0 && <span> - No results found</span>}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <div className="no-reviews-icon">📭</div>
          <p>No reviews found.</p>
          <p className="no-reviews-hint">Try changing category, search term, or refresh.</p>
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
                      disabled={votingId === review.id}
                      className={`vote-btn upvote ${votingId === review.id ? 'voting' : ''}`}
                    >
                      👍 {review.upvotes || 0}
                    </button>
                    <button 
                      onClick={() => handleVote(review.id, 'downvote')}
                      disabled={votingId === review.id}
                      className={`vote-btn downvote ${votingId === review.id ? 'voting' : ''}`}
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
                className="page-btn"
              >
                ← Previous
              </button>
              <div className="page-info">
                <span className="current-page">{page + 1}</span>
                <span className="total-pages"> / {totalPages}</span>
              </div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages-1, p+1))}
                disabled={page === totalPages-1}
                className="page-btn"
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
