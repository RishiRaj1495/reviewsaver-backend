import React, { useState } from 'react';
import Login from './components/Login';
import ReviewList from './components/ReviewList';
import ReviewForm from './components/ReviewForm';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎬 ReviewSaver</h1>
        <p className="tagline">India's #1 Review Platform</p>
      </header>
      
      <main>
        {!user ? (
          <Login onLogin={setUser} />
        ) : (
          <div className="dashboard">
            <div className="welcome-section">
              <div className="user-info">
                <span className="welcome-message">
                  👋 Welcome, {user.email}!
                </span>
                <button 
                  className="logout-btn"
                  onClick={() => setUser(null)}
                >
                  Logout
                </button>
              </div>
            </div>
            
            <div className="content-grid">
              {/* Review Form Section - THIS SHOULD APPEAR ON THE LEFT */}
              <div className="form-section">
                <ReviewForm 
                  user={user} 
                  onReviewAdded={handleReviewAdded}
                />
              </div>
              
              {/* Reviews List Section - THIS SHOULD APPEAR ON THE RIGHT */}
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
    </div>
  );
}

export default App;