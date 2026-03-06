import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Mock replies data
const mockReplies = [
  {
    id: 1,
    reviewId: 1,
    user: { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    content: "I completely agree! This movie was amazing.",
    createdAt: "2025-03-05T10:30:00Z"
  },
  {
    id: 2,
    reviewId: 1,
    user: { id: 3, name: "Bob Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
    content: "Thanks for the review. I'll check it out.",
    createdAt: "2025-03-05T11:15:00Z"
  }
];

export default function RepliesSection({ reviewId }) {
  const { user } = useAuth();
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch replies (mock)
  useEffect(() => {
    setTimeout(() => {
      // Filter mock replies by reviewId
      const filtered = mockReplies.filter(r => r.reviewId === reviewId);
      setReplies(filtered);
      setLoading(false);
    }, 500);
  }, [reviewId]);

  // Simulate real-time new replies (for demo only)
useEffect(() => {
  if (replies.length === 0) return; // only start after initial load

  const interval = setInterval(() => {
    // Randomly decide to add a new reply (20% chance)
    if (Math.random() < 0.2) {
      const randomUser = {
        id: Math.floor(Math.random() * 1000),
        name: `User${Math.floor(Math.random() * 100)}`,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      };
      const newReply = {
        id: Date.now(),
        reviewId,
        user: randomUser,
        content: `Live reply #${Math.floor(Math.random() * 100)}`,
        createdAt: new Date().toISOString()
      };
      setReplies(prev => [newReply, ...prev]); // add to top
    }
  }, 10000); // every 10 seconds

  return () => clearInterval(interval);
}, [replies.length, reviewId]); // dependency on replies.length to start after load

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    // Mock add reply
    const newReplyObj = {
      id: Date.now(),
      reviewId,
      user: {
        id: user?.id || 999,
        name: user?.name || "Guest",
        avatar: user?.avatar || "https://i.pravatar.cc/150?img=default"
      },
      content: newReply,
      createdAt: new Date().toISOString()
    };
    setReplies([...replies, newReplyObj]);
    setNewReply('');
  };

  if (loading) return <div className="mt-4">Loading replies...</div>;

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">Replies ({replies.length})</h3>

      {/* Replies list */}
      <div className="space-y-4 mb-6">
        {replies.map(reply => (
          <div key={reply.id} className="flex gap-3">
            <img
              src={reply.user.avatar}
              alt={reply.user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 bg-gray-100 p-3 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{reply.user.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(reply.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800">{reply.content}</p>
            </div>
          </div>
        ))}
        {replies.length === 0 && (
          <p className="text-gray-500">No replies yet. Be the first to reply!</p>
        )}
      </div>

      {/* Reply form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Reply
          </button>
        </form>
      ) : (
        <p className="text-gray-500">Please <a href="/login" className="text-blue-500">login</a> to reply.</p>
      )}
    </div>
  );
}