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
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>{favorites}</pre>
      )}
      
    </main>
  );
}
