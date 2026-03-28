import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import RecommendationSection from './RecommendationSection';
import './Dashboard.css';

function Dashboard({ user, onStatsClick, onRefresh }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await reviewService.getUserStats(user.id);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Failed to load stats. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
    if (onRefresh) {
      onRefresh();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatClick = (type) => {
    if (onStatsClick) {
      onStatsClick(type);
    }
  };

  if (loading && !stats) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={handleRefresh} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-emoji">👤</span>
        </div>
        <div className="profile-info">
          <h1>{stats?.email || user.email}</h1>
          <p className="member-since">
            🗓️ Member since: {stats?.memberSince ? formatDate(stats.memberSince) : formatDate(user.createdAt)}
          </p>
        </div>
        <button 
          className="refresh-stats-btn" 
          onClick={handleRefresh} 
          title="Refresh stats"
          disabled={loading}
        >
          🔄
        </button>
      </div>

      {/* Stats Cards - CLICKABLE */}
      <div className="stats-grid">
        <div 
          className="stat-card clickable" 
          onClick={() => handleStatClick('all')}
          title="Click to see all your reviews"
        >
          <div className="stat-value">{stats?.totalReviews || 0}</div>
          <div className="stat-label">Total Reviews</div>
          <div className="stat-hint">📝 Click to view</div>
        </div>
        
        <div 
          className="stat-card clickable upvote-stat" 
          onClick={() => handleStatClick('upvotes')}
          title="Click to see your most upvoted reviews"
        >
          <div className="stat-value">👍 {stats?.totalUpvotes || 0}</div>
          <div className="stat-label">Upvotes Received</div>
          <div className="stat-hint">⭐ Click to sort</div>
        </div>
        
        <div 
          className="stat-card clickable downvote-stat" 
          onClick={() => handleStatClick('downvotes')}
          title="Click to see your most downvoted reviews"
        >
          <div className="stat-value">👎 {stats?.totalDownvotes || 0}</div>
          <div className="stat-label">Downvotes Received</div>
          <div className="stat-hint">⚠️ Click to sort</div>
        </div>
        
        <div 
          className="stat-card clickable" 
          onClick={() => handleStatClick('recent')}
          title="Click to see your most recent reviews"
        >
          <div className="stat-value">{stats?.totalReviews || 0}</div>
          <div className="stat-label">Reviews Written</div>
          <div className="stat-hint">🕐 Click for recent</div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-label">⭐ Average Rating:</span>
          <span className="summary-value">
            {stats?.totalReviews > 0 
              ? ((stats.totalUpvotes - stats.totalDownvotes) / stats.totalReviews).toFixed(1) 
              : '0.0'}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">📈 Engagement Score:</span>
          <span className="summary-value">
            {stats?.totalReviews > 0 
              ? Math.round(((stats.totalUpvotes + stats.totalDownvotes) / stats.totalReviews) * 10) / 10
              : '0'}
          </span>
        </div>
      </div>

      {/* Recommendation Section - ADDED */}
      <RecommendationSection userId={user.id} />
    </div>
  );
}

export default Dashboard;
