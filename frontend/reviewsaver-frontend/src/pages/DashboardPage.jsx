import { useAuth } from '../context/AuthContext';
import RecommendationCard from '../components/RecommendationCard';
import { mockRecommendations } from '../services/mockData';

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return <div className="p-4">Please log in to view your dashboard.</div>;

  // Mock user taste profile
  const tasteProfile = {
    topCategories: ['Movies', 'Food'],
    favoriteItems: ['Interstellar', 'Oppenheimer'],
    recentActivity: ['Reviewed Dune', 'Commented on The Bear']
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back, {user.name}!</p>

      {/* Taste Profile */}
      <section className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Your Taste Profile</h2>
        <p><strong>Top categories:</strong> {tasteProfile.topCategories.join(', ')}</p>
        <p><strong>You seem to like:</strong> {tasteProfile.favoriteItems.join(', ')}</p>
        <p><strong>Recent activity:</strong> {tasteProfile.recentActivity.join(' • ')}</p>
      </section>

      {/* Recommendations based on taste */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockRecommendations.slice(0, 4).map(item => (
            <RecommendationCard key={item.id} item={item} showReason={true} />
          ))}
        </div>
      </section>
    </div>
  );
}