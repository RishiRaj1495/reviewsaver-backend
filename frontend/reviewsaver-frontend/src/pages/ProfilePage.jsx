import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import { useAuth } from '../context/AuthContext';

// Mock data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://via.placeholder.com/150',
  bio: 'Avid reviewer',
};

const mockFollowers = []; // empty for now

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfile(mockUser);
      // Check if current user is in mockFollowers (mock check)
      if (currentUser) {
        setIsFollowing(mockFollowers.some(f => f.id === currentUser.id));
      }
    }, 500);
  }, [id, currentUser]);

  if (!profile) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl">{profile.name}</h1>
          <p className="text-gray-600">{profile.bio}</p>
          <div className="mt-2">
            <FollowButton userId={profile.id} initialIsFollowing={isFollowing} />
          </div>
        </div>
      </div>
    </div>
  );
}