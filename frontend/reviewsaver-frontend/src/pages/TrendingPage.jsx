import { useState, useEffect } from 'react';
import ReviewCard from '../components/ReviewCard';
import { mockTrending } from '../services/mockData';

export default function TrendingPage() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setTrending(mockTrending);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="p-4 text-center">Loading trending reviews...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🔥 Trending Reviews</h1>
      <p className="text-gray-600 mb-6">Most upvoted reviews in the last 24 hours</p>
      <div className="space-y-4">
        {trending.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}