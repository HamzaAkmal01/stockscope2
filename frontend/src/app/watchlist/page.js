'use client';
import { useEffect, useState } from 'react';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 1; // TODO: Replace with real user ID from auth

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:5000/api/watchlist?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch watchlist');
        const data = await res.json();
        setWatchlist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent mb-8">My Watchlist</h1>
      {loading ? (
        <div className="text-gray-400">Loading watchlist...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : watchlist.length === 0 ? (
        <div className="text-gray-400">Your watchlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {watchlist.map((item) => (
            <div key={item.Wishlist_ID} className="glass-effect bg-black/60 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:shadow-2xl overflow-hidden">
              <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 via-blue-400 to-pink-400 shadow-lg mb-4">
                <span className="text-2xl font-bold text-white select-none">
                  {item.Stock?.TickerSymbol ? item.Stock.TickerSymbol[0] : '?'}
                </span>
              </div>
              <div className="relative z-10 text-lg font-semibold text-white mb-1 text-center truncate w-full">
                {item.Stock?.StockName}
              </div>
              <span className="relative z-10 inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white shadow mb-2">
                {item.Stock?.TickerSymbol}
              </span>
              <div className="relative z-10 text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent mb-1">
                ${item.Stock?.CurrentPrice}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 