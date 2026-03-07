import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockLeaderboard } from '../services/mockData';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLeaders(mockLeaderboard);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="p-4 text-center">Loading leaderboard...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🏆 Top Reviewers</h1>
      <p className="text-gray-600 mb-6">Users with the most upvotes</p>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {leaders.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-gray-50"
          >
            <div className="w-8 text-center font-bold text-lg">
              {user.rank}
            </div>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <Link to={`/profile/${user.id}`} className="font-semibold hover:underline">
                {user.name}
              </Link>
              <p className="text-sm text-gray-500">{user.reviewsCount} reviews</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{user.upvotes}</div>
              <div className="text-sm text-gray-500">upvotes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}