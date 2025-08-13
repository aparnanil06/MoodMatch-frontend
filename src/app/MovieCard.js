// src/app/MovieCard.js
export default function MovieCard({ movie, onSave }) {
  const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w200";

  return (
    <div className="bg-white border border-gray-200 rounded shadow p-4 flex items-start gap-4">
      {movie.poster_path ? (
        <img
          src={`${TMDB_IMG_BASE}${movie.poster_path}`}
          alt={movie.title}
          className="w-24 h-36 object-cover rounded shadow shrink-0"
        />
      ) : (
        <div className="w-24 h-36 bg-gray-200 rounded shrink-0 flex items-center justify-center">
          <span className="text-gray-500 text-xs text-center">No Image</span>
        </div>
      )}

      <div className="flex-1">
        <h3 className="text-lg font-bold">{movie.title}</h3>
        <p className="text-gray-700 text-sm mt-2 mb-3">{movie.overview}</p>

        {/* Mood and Date Tags - only show if they exist */}
        {(movie.mood || movie.date) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.mood && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                Mood: {movie.mood}
              </span>
            )}
            {movie.date && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                Saved: {movie.date}
              </span>
            )}
          </div>
        )}

        {/* Watch Providers */}
        {movie.watch_providers && (
          <div className="mb-3">
            {(movie.watch_providers.flatrate?.length > 0 || 
              movie.watch_providers.rent?.length > 0 || 
              movie.watch_providers.buy?.length > 0) && (
              <>
                <h4 className="text-sm font-semibold mb-2 text-gray-800">Where to Watch:</h4>
                <div className="space-y-2">
                  {/* Subscription Services */}
                  {movie.watch_providers.flatrate?.length > 0 && (
                    <div>
                      <span className="text-xs text-gray-600 mr-2">Stream:</span>
                      <div className="flex flex-wrap gap-1 inline-flex">
                        {movie.watch_providers.flatrate.map((provider, idx) => (
                          <img
                            key={idx}
                            src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                            className="w-8 h-8 rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Rental Services */}
                  {movie.watch_providers.rent?.length > 0 && (
                    <div>
                      <span className="text-xs text-gray-600 mr-2">Rent:</span>
                      <div className="flex flex-wrap gap-1 inline-flex">
                        {movie.watch_providers.rent.map((provider, idx) => (
                          <img
                            key={idx}
                            src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                            className="w-8 h-8 rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {onSave && (
          <button
            onClick={() => onSave(movie)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Save to Favorites
          </button>
        )}
      </div>
    </div>
  );
}