import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function RecommendationCard({ item, showReason = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out opacity-100">
      <Link to={`/item/${item.id}`}>
        <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
      </Link>
      <div className="p-3">
        <Link to={`/item/${item.id}`}>
          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        </Link>
        <div className="flex justify-between items-center text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
          <span>⭐ {item.rating}/5</span>
        </div>
        {showReason && (
          <div className="relative mt-2">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-xs text-gray-500 underline"
            >
              Why this?
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg w-40">
                {item.reason}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}