import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FollowButton({ userId, initialIsFollowing }) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  if (!user || user.id === userId) return null;

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/users/${userId}/follow`);
      } else {
        await api.post(`/users/${userId}/follow`);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Follow action failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded text-sm font-medium transition ${
        isFollowing 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {loading ? '...' : (isFollowing ? 'Unfollow' : 'Follow')}
    </button>
  );
}