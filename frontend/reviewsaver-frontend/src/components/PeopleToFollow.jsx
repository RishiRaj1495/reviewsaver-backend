import { useEffect, useState } from 'react';
import FollowButton from './FollowButton';

const mockSuggestions = [
  { id: 4, name: 'Alice Wonder', avatar: 'https://via.placeholder.com/150', isFollowing: false },
  { id: 5, name: 'Charlie Brown', avatar: 'https://via.placeholder.com/150', isFollowing: false },
];

export default function PeopleToFollow() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setTimeout(() => setSuggestions(mockSuggestions), 500);
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="font-bold mb-2">People to follow</h3>
      <ul>
        {suggestions.map(user => (
          <li key={user.id} className="flex items-center gap-2 mb-2">
            <img src={user.avatar} className="w-8 h-8 rounded-full" />
            <span className="flex-1">{user.name}</span>
            <FollowButton userId={user.id} initialIsFollowing={user.isFollowing} />
          </li>
        ))}
      </ul>
    </div>
  );
}