import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import UserReviewsModal from './components/UserReviewsModal';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSortType, setModalSortType] = useState('all');
  const [userStats, setUserStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://reviewsaver-backend-api.onrender.com/api';

  const loadUserStats = useCallback(async () => {
    if (!user?.id) return;
    
    setLoadingStats(true);
    setStatsError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error loading user stats:', error);
      setStatsError('Could not load stats');
    } finally {
      setLoadingStats(false);
    }
  }, [user?.id, API_BASE_URL]);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user, loadUserStats]);

  const handleLogout = () => {
    setUser(null);
    setUserStats(null);
    setStatsError(null);
    // Clear any cached data
    localStorage.removeItem('deviceHash');
  };

  const handleReviewAdded = () => {
    setRefreshKey(prev => prev + 1);
    loadUserStats(); // Refresh stats after adding review
  };

  const handleStatsClick = (type) => {
    let title = '';
    let icon = '';
    switch (type) {
      case 'all':
        icon = '📝';
        title = `${icon} All Your Reviews (${userStats?.totalReviews || 0} total)`;
        setModalSortType('all');
        break;
      case 'upvotes':
        icon = '⭐';
        title = `${icon} Most Upvoted Reviews (👍 ${userStats?.totalUpvotes || 0} total upvotes)`;
        setModalSortType('upvotes');
        break;
      case 'downvotes':
        icon = '⚠️';
        title = `${icon} Most Downvoted Reviews (👎 ${userStats?.totalDownvotes || 0} total downvotes)`;
        setModalSortType('downvotes');
        break;
      case 'recent':
        icon = '🕐';
        title = `${icon} Most Recent Reviews (Latest ${userStats?.totalReviews || 0} reviews)`;
        setModalSortType('recent');
        break;
      default:
        title = 'Your Reviews';
        setModalSortType('all');
    }
    setModalTitle(title);
    setModalOpen(true);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // Welcome message in console (optional)
    console.log(`Welcome ${userData.email}!`);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 ReviewSaver</h1>
          <p className="tagline">India's #1 Review Platform — Trusted by 50,000+ users</p>
        </div>
      </header>
      
      <main>
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="app-container">
            {/* Dashboard Section - Clickable Stats with Real Data */}
            <Dashboard 
              user={user} 
              userStats={userStats}
              loadingStats={loadingStats}
              statsError={statsError}
              onStatsClick={handleStatsClick} 
              onRefresh={loadUserStats}
            />
            
            {/* Combined Content */}
            <div className="content-section">
              <div className="form-section">
                <ReviewForm 
                  user={user} 
                  onReviewAdded={handleReviewAdded}
                />
              </div>
              
              <div className="reviews-section">
                <ReviewList 
                  key={refreshKey}
                  user={user} 
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal for viewing user's reviews */}
      <UserReviewsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={user?.id}
        title={modalTitle}
        sortType={modalSortType}
      />

      {/* Optional: Floating action button for quick review (optional) */}
      {user && (
        <button 
          className="fab" 
          onClick={() => document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' })}
          title="Write a review"
        >
          ✍️
        </button>
      )}
    </div>
  );
}

export default App;

