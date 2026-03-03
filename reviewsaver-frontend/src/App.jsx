import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FollowersPage from './pages/FollowersPage';



function App() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="p-4">Loading app...</div>;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow p-4">
          <div className="container mx-auto flex justify-between">
            <a href="/" className="font-bold text-xl">ReviewSaver</a>
            <div>
              {user ? (
                <>
                  <a href={`/profile/${user.id}`} className="mr-4">Profile</a>
                  <button onClick={logout} className="text-red-500">Logout</button>
                </>
              ) : (
                <>
                  <a href="/login" className="mr-4">Login</a>
                  <a href="/register">Register</a>
                </>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile/:id/followers" element={<FollowersPage />} />
          <Route path="/profile/:id/following" element={<FollowingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;