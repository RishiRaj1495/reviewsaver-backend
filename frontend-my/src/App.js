import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    setUser(null);
  };

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
          <div className="app-container">
            {/* Dashboard Section - Shows User Profile and Stats */}
            <Dashboard user={user} onLogout={handleLogout} />
            
            {/* Combined Content - Review Form and All Reviews */}
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
    </div>
  );
}

export default App;
