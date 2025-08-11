"use client";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:5001/favorites", {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();
        setFavorites(data.favorites || "No favorites saved yet.");
      } catch (err) {
        console.error("Error loading favorites:", err);
        setFavorites("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const clearFavorites = async () => {
    try {
      const response = await fetch("http://localhost:5001/clear_favorites", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      alert(data.message);
      setFavorites(""); //clears local state
    } catch (err) {
      alert("Failed to clear favorites.");
      console.error(err);
    }
  };

  function parseFavorites(text) {
    return text
        .split(/\n\s*\n/) // split on blank lines
        .map((chunk) => {
        if (!chunk.trim()) return null; // skip empty chunks

        const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
        const firstLine = lines[0];
        const rest = lines.slice(1);

        const match = firstLine.match(
            /^(.+?) \((\d{4}-\d{2}-\d{2}), Mood:\s*(.+?)\)$/
        );
        if (!match) return null;

        const [, title, date, mood] = match;
        const overview = rest.join(" ").trim();
        return { title, date, mood, overview };
        })
        .filter(Boolean);
    }

  const items = !loading && favorites ? parseFavorites(favorites) : [];

  

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-4 py-10 space-y-8">
        <button onClick={() => window.history.back()}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded shadow"
        >
            Back
        </button>
        <br /><br />
        <button onClick={clearFavorites} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
            Clear Favorites
        </button>
        <br /><br />
      <h1 className="text-3xl font-bold text-indigo-600">Your Favorite Movies</h1>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No favorites saved yet.</p>
      ) : (
        <div className="w-full max-w-3xl grid gap-4">
            {items.map((fav, i) =>
            <div
                key={i}
                className="bg-white rounded-2xl shadow p-4 border border-gray-200"
            >
                <h2 className="text-lg font-semibold">{fav.title}</h2>
                <p className="text-sm text-gray-500">
                    {fav.date} • Mood: {fav.mood}
                </p>
                <p className="mt-2 text-gray-800 leading-relaxed">{fav.overview}</p>
            </div>
            )}
        </div>
      )}
      

      
    </main>
  );
}
