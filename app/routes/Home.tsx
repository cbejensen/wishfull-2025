import { Gift, Users, ShoppingBag, CheckSquare } from 'lucide-react';
import { Link } from 'react-router';

export function meta() {
  return [
    { title: "Wishfull" },
    { name: "description", content: "Give great gifts" },
  ];
}

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center justify-center text-purple-600 mb-8">
          <Gift size={64} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
          Wishfull
        </h1>
        <p className="text-2xl sm:text-3xl text-gray-600 mb-8">
          Give great gifts
        </p>
        <Link to="/auth">
          Get Started
        </Link>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-6">
              <Users size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              See what friends really want
            </h2>
            <p className="text-gray-600">
              Discover your friends' wishlists and make their dreams come true.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-6">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Avoid buying the same gift as your friends
            </h2>
            <p className="text-gray-600">
              Coordinate with others to ensure your gift is unique and special.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-6">
              <CheckSquare size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Keep track of what you've purchased
            </h2>
            <p className="text-gray-600">
              Stay organized and never forget what you've already bought.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};