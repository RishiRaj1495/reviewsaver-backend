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
  const [activeFilters, setActiveFilters] = useState({
    minRating: null,
    maxRating: null,
    dateRange: null
  });

  const sortOptions = [
    { value: 'createdAt', label: 'Date', icon: '🕐' },
    { value: 'rating', label: 'Rating', icon: '⭐' },
    { value: 'upvotes', label: 'Upvotes', icon: '👍' },
    { value: 'downvotes', label: 'Downvotes', icon: '👎' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📋' },
    { value: 'Movies', label: 'Movies', icon: '🎬' },
    { value: 'Electronics', label: 'Electronics', icon: '📱' },
    { value: 'Restaurants', label: 'Restaurants', icon: '🍽️' },
    { value: 'Cafes', label: 'Cafes', icon: '☕' },
    { value: 'Food', label: 'Food', icon: '🍕' }
  ];

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewService.getReviews(page, 12, category, sortBy, sortDir);
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Failed to load reviews');
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
      const data = await reviewService.searchReviews(searchTerm, page, 12);
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search reviews');
    } finally {
      setSearching(false);
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

  const handleClearFilters = () => {
    setCategory('all');
    setSortBy('createdAt');
    setSortDir('desc');
    setSearchTerm('');
    setPage(0);
    setActiveFilters({ minRating: null, maxRating: null, dateRange: null });
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

  const getActiveFilterCount = () => {
    let count = 0;
    if (category !== 'all') count++;
    if (activeFilters.minRating) count++;
    if (activeFilters.maxRating) count++;
    if (activeFilters.dateRange) count++;
    return count;
  };

  const formatReviewCount = (count) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K+`;
    }
    return count.toString();
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
      {/* Header with Stats */}
      <div className="reviews-header">
        <div className="header-left">
          <h1>📋 Reviews</h1>
          <div className="stats-badge">
            {formatReviewCount(totalElements)} reviews
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search reviews by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => { setSearchTerm(''); loadReviews(); }} className="clear-search">
              ✖
            </button>
          )}
        </div>
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>

      {/* Sort Section */}
      <div className="sort-section">
        <span className="sort-label">Sort by:</span>
        <div className="sort-buttons">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`sort-btn ${sortBy === option.value ? 'active' : ''}`}
            >
              {option.icon} {option.label} {getSortIcon(option.value)}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter with Clear Button */}
      <div className="category-filter-wrapper">
        <div className="filter-header">
          <span className="filter-label">Filter by category:</span>
          {getActiveFilterCount() > 0 && (
            <button onClick={handleClearFilters} className="clear-filters-btn">
              ✖ Clear Filters ({getActiveFilterCount()})
            </button>
          )}
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(0);
          }}
          className="category-select"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="search-info">
          <span>🔍 Showing results for: <strong>"{searchTerm}"</strong></span>
          {reviews.length === 0 && <span> - No results found</span>}
        </div>
      )}

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <div className="no-reviews-icon">📭</div>
          <p>No reviews found.</p>
          <p className="no-reviews-hint">Try changing category, search term, or clear filters.</p>
        </div>
      ) : (
        <>
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-card-top">
                  <div className="review-header">
                    <h3>{review.productName}</h3>
                    <span className="category-badge">{review.category}</span>
                  </div>
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    <span className="rating-value">{review.rating}/5</span>
                  </div>
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

          {/* Pagination */}
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
