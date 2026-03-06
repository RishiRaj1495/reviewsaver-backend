import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FollowButton from '../components/FollowButton';

const mockFollowers = [
  { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/150', isFollowing: false },
  { id: 3, name: 'Bob Johnson', avatar: 'https://via.placeholder.com/150', isFollowing: true },
];

export default function FollowersPage() {
  const { id } = useParams();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setFollowers(mockFollowers), 500);
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Followers</h2>
      <ul>
        {followers.map(user => (
          <li key={user.id} className="flex items-center gap-4 mb-2 p-2 border rounded">
            <img src={user.avatar} className="w-10 h-10 rounded-full" />
            <Link to={`/profile/${user.id}`} className="flex-1 text-blue-600 hover:underline">
              {user.name}
            </Link>
            <FollowButton userId={user.id} initialIsFollowing={user.isFollowing} />
          </li>
        ))}
      </ul>
    </div>
  );
}