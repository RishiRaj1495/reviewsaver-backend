import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [page]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get user stats
      const statsData = await reviewService.getUserStats(user.id);
      setStats(statsData);
      setProfile(statsData);

      // Get user's reviews
      const reviewsData = await reviewService.getMyReviews(user.id, page, 5);
      setMyReviews(reviewsData.content || []);
      setTotalPages(reviewsData.totalPages || 0);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !stats) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-emoji">👤</span>
        </div>
        <div className="profile-info">
          <h1>{stats?.email}</h1>
          <p className="member-since">
            🗓️ Member since: {stats?.memberSince ? formatDate(stats.memberSince) : 'Unknown'}
          </p>
        </div>
        <button onClick={onLogout} className="logout-dashboard-btn">
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.totalReviews || 0}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card upvote-stat">
          <div className="stat-value">👍 {stats?.totalUpvotes || 0}</div>
          <div className="stat-label">Upvotes Received</div>
        </div>
        <div className="stat-card downvote-stat">
          <div className="stat-value">👎 {stats?.totalDownvotes || 0}</div>
          <div className="stat-label">Downvotes Received</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalReviews || 0}</div>
          <div className="stat-label">Reviews Written</div>
        </div>
      </div>

      {/* My Reviews Section */}
      <div className="my-reviews-section">
        <h2>📝 My Reviews</h2>
        
        {myReviews.length === 0 ? (
          <div className="no-reviews-message">
            <p>You haven't posted any reviews yet.</p>
            <p>Write your first review using the form on the homepage!</p>
          </div>
        ) : (
          <>
            <div className="my-reviews-list">
              {myReviews.map(review => (
                <div key={review.id} className="my-review-card">
                  <div className="review-header">
                    <h3>{review.productName}</h3>
                    <span className="category-badge">{review.category}</span>
                  </div>
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                  </div>
                  <p className="review-text">"{review.reviewText}"</p>
                  <div className="review-footer">
                    <div className="review-stats">
                      <span>👍 {review.upvotes}</span>
                      <span>👎 {review.downvotes}</span>
                    </div>
                    <div className="review-date">
                      📅 {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
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
    </div>
  );
}

export default Dashboard;
