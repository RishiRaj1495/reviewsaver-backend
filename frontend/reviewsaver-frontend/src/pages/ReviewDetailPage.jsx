import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import RepliesSection from '../components/RepliesSection';
import { mockTrending } from '../services/mockData'; // reuse mock reviews

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch for a single review
    setTimeout(() => {
      const found = mockTrending.find(r => r.id === parseInt(id));
      setReview(found || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading review...</div>;
  if (!review) return <div className="p-4 text-center">Review not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <ReviewCard review={review} />
      <RepliesSection reviewId={review.id} />
    </div>
  );
}