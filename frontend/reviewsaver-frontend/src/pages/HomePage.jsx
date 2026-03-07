import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import RecommendationCard from '../components/RecommendationCard';
import RecommendationCardSkeleton from '../components/RecommendationCardSkeleton'; // import skeleton
import { mockTrending, mockRecommendations } from '../services/mockData';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true); // new state for trending loading
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  // Fetch recommendations
  useEffect(() => {
    setRecommendationsLoading(true);
    setTimeout(() => {
      setRecommendations(mockRecommendations.slice(0, 4));
      setRecommendationsLoading(false);
    }, 300);
  }, []);

  // Fetch trending
  useEffect(() => {
    setTrendingLoading(true);
    setTimeout(() => {
      setTrending(mockTrending.slice(0, 3));
      setTrendingLoading(false);
    }, 400);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Welcome to ReviewSaver</h1>
      <p className="text-gray-600 mb-8">Discover and share reviews!</p>

      {/* Recommended for You */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">🎯 Recommended for You</h2>
          <Link to="/discover" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recommendationsLoading ? (
            // Show skeletons while loading
            Array(4).fill(0).map((_, i) => <RecommendationCardSkeleton key={i} />)
          ) : (
            recommendations.map(item => (
              <RecommendationCard key={item.id} item={item} showReason={true} />
            ))
          )}
        </div>
      </section>

      {/* Trending Now */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">🔥 Trending Now</h2>
          <Link to="/trending" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse bg-white h-48"></div>
            ))
          ) : (
            trending.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}