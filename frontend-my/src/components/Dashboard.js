import React from 'react';
import RecommendationSection from './RecommendationSection';
import './Dashboard.css';

function Dashboard({ user, onRefresh }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const username = user?.email?.split('@')[0] || 'User';
  const greeting = getGreeting();

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div className="welcome-avatar">
          <span className="avatar-initial">{username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="welcome-info">
          <div className="greeting-badge">{greeting}</div>
          <h1>
            Welcome back, <span className="username-highlight">{username}</span>
          </h1>
        </div>
        <button 
          className="refresh-dashboard-btn" 
          onClick={onRefresh} 
          title="Refresh dashboard"
        >
          <span className="refresh-icon">🔄</span>
          <span className="refresh-text">Refresh</span>
        </button>
      </div>

      {/* Recommendations Section */}
      <RecommendationSection userId={user.id} />
    </div>
  );
}

export default Dashboard;
