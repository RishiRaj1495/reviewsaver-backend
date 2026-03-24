import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
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
          <Dashboard user={user} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;