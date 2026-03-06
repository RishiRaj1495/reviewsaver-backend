export default function RecommendationCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 animate-pulse bg-white">
      <div className="bg-gray-300 h-40 w-full rounded-t-lg mb-2"></div>
      <div className="bg-gray-300 h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-300 h-4 w-1/2 mb-2"></div>
      <div className="bg-gray-300 h-4 w-1/3"></div>
    </div>
  );
}