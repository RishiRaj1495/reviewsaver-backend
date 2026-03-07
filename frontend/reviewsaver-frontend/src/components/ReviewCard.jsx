import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

export default function ReviewCard({ review }) {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition">
      {/* Author section */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={review.author.avatar || 'https://via.placeholder.com/40'}
          alt={review.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <Link to={`/profile/${review.author.id}`} className="font-semibold hover:underline">
            {review.author.name}
          </Link>
          <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <FollowButton userId={review.author.id} initialIsFollowing={review.author.isFollowing} />
      </div>

      {/* Review content */}
      <Link to={`/review/${review.id}`}>
        <h3 className="text-xl font-bold mb-2">{review.title}</h3>
        <p className="text-gray-700 mb-3 line-clamp-3">{review.content}</p>
      </Link>

      {/* Rating and upvotes */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Rating: {review.rating}/5</span>
          <span className="bg-gray-200 px-2 py-1 rounded">👍 {review.upvotes}</span>
        </div>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{review.category}</span>
      </div>
    </div>
  );
}