import { useState, useEffect } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import { mockRecommendations } from '../services/mockData';

const categories = ['All', 'Movies', 'TV Shows', 'Food', 'Electronics', 'Cafes'];

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let filtered = mockRecommendations;
      if (selectedCategory !== 'All') {
        filtered = mockRecommendations.filter(item => item.category === selectedCategory);
      }
      setItems(filtered);
      setLoading(false);
    }, 500);
  }, [selectedCategory]);

  if (loading) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Discover New</h1>
      <div className="flex gap-2 mb-6">
        {categories.map(cat => (
          <div key={cat} className="px-4 py-2 bg-gray-200 rounded-full w-20 h-10 animate-pulse"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <RecommendationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Discover New</h1>
      
      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <RecommendationCard key={item.id} item={item} showReason={true} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No recommendations found in this category.</p>
      )}
    </div>
  );
}