export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Wishfull</h1>
        <p className="text-lg mt-2">Give great gifts</p>
      </header>

      <main className="space-y-6 max-w-2xl text-center">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">See what friends really want</h2>
          <p className="text-gray-600">Discover your friends' wishlists and make their dreams come true.</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Avoid buying the same gift as your friends</h2>
          <p className="text-gray-600">Coordinate with others to ensure your gift is unique and special.</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Keep track of what you've purchased</h2>
          <p className="text-gray-600">Stay organized and never forget what you've already bought.</p>
        </div>
      </main>
    </div>
  );
};