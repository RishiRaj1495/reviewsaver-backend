import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import './Dashboard.css';

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsData = await reviewService.getUserStats(user.id);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
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
          <h1>{stats?.email || user.email}</h1>
          <p className="member-since">
            🗓️ Member since: {stats?.memberSince ? formatDate(stats.memberSince) : formatDate(user.createdAt)}
          </p>
        </div>
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
    </div>
  );
}

export default Dashboard;