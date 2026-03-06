import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import RepliesSection from '../components/RepliesSection';
import RecommendationCard from '../components/RecommendationCard';
import { mockTrending, mockRecommendations } from '../services/mockData';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarItems, setSimilarItems] = useState([]);
  const [peopleAlsoLiked, setPeopleAlsoLiked] = useState([]);
  const [trending, setTrending] = useState([]);

  // Fetch main review
  useEffect(() => {
    setTimeout(() => {
      const found = mockTrending.find(r => r.id === parseInt(id));
      setReview(found || null);
      setLoading(false);
    }, 500);
  }, [id]);

  // Fetch "Because you liked this" (RU4)
  useEffect(() => {
    setTimeout(() => {
      setSimilarItems(mockRecommendations.slice(0, 3));
    }, 300);
  }, [id]);

  // Fetch "People also liked" (RU7) – different items
  useEffect(() => {
    setTimeout(() => {
      setPeopleAlsoLiked(mockRecommendations.slice(3, 6));
    }, 400);
  }, [id]);

  // Fetch "Trending Now" (RU5) – from trending reviews
  useEffect(() => {
    setTimeout(() => {
      setTrending(mockTrending.slice(0, 3));
    }, 500);
  }, []);

  if (loading) return <div className="p-4 text-center">Loading review...</div>;
  if (!review) return <div className="p-4 text-center">Review not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <ReviewCard review={review} />
      <RepliesSection reviewId={review.id} />

      {/* Because you liked this */}
      {similarItems.length > 0 && (
        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Because you liked this</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {similarItems.map(item => (
              <RecommendationCard key={item.id} item={item} showReason={true} />
            ))}
          </div>
        </section>
      )}

      {/* People also liked */}
      {peopleAlsoLiked.length > 0 && (
        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4">People also liked</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {peopleAlsoLiked.map(item => (
              <RecommendationCard key={item.id} item={item} showReason={true} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Now widget */}
      {trending.length > 0 && (
        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4">🔥 Trending Now</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {trending.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}