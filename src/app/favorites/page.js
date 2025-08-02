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

  return (
    <main>
        <button onClick={() => window.history.back()}>Back</button>
        <br /><br />
      <h1>🎬 Your Favorite Movies</h1>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>{favorites}</pre>
      )}
      
    </main>
  );
}
