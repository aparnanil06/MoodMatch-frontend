"use client"; //tells Next.js this file runs in browser not just server
import { useState } from "react"; //use useState hook from react to store and update data
import { useRouter } from "next/navigation";
import "../styles/globals.css";


//defines main component of homepage, export default makes this get loaded when someone visits the site
export default function Home() {
  //sets the user inputted mood, runtime, and movie selection
  const [moodInput, setMoodInput] = useState("");
  const [runtimeInput, setRuntimeInput] = useState("90");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState("");
  const router = useRouter();

  //defined an asynchronous function, e is the event object passed fromt he form submit
  //async lets us use await to pause for things like fetch() inside the function
  const handleSubmit = async (e) => {
    console.log("Form was submitted");
    //prevents the default behavior of form submission (reloading)
    e.preventDefault();
    //uses fetch() to send a POST request to Flask backend
    //we away result because its asynchronous
    //frontend and backend connect here
    const response = await fetch("http://localhost:5001/recommend", {
      //tells backend we are sending POST request with body in JSON format
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //creates a JavaScript object then converst it into a JSON string to send in request
      //Number(runtime) makes sure runtime is sent as number not string
      body: JSON.stringify({
        mood: moodInput,
        runtime: Number(runtimeInput)
      }),
      credentials: "include"
    }); // closes fetch() call
    //awaits response from backend and converts it into a JavaScript object from JSON now held in 'data'
    const data = await response.json();
    console.log("Received data from backend:", data);
    //updates movies state with movie results
    //is nothing is sent it falls back to an empty list
    setMovies(data.movies || []);
  };
  const handleSaveMovie = async (movie) => {
    try {
      const response = await fetch("http://localhost:5001/save_favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: movie.title,
          overview: movie.overview,
          mood: moodInput,
        }),
        credentials: "include"
      });
      const result = await response.json();
      alert(result.message || "Saved!");

    } catch(err) {
      alert("Failed to save favorite.");
      console.error(err);
    }

  };

  const handleViewFavorites = async () => {
    router.push("/favorites");
  };

  
  //this is the JSX (React's HTML like syntax that says what to show on this page)
  return (
    //semantic HTML element for the main content
    <main className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600">MoodMatch</h1>
      <button
        type="button"
        onClick={handleViewFavorites}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow"
      >
        View Favorites
      </button>


        {favorites && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Favorites:</h2>
            <pre style={{ whiteSpace: "pre-wrap" }}>{favorites}</pre>
          </div>
        )}
        <br /><br />

      <form onSubmit={handleSubmit}> 
        <label className="block front-medium">
          How are you feeling? 
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <br /><br />

        <label className="block font-medium">
          How much time do you have?
          <select 
            value={runtimeInput} 
            onChange={(e) => setRuntimeInput(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            >
            <option value="60">Less than 60 min</option>
            <option value="90">Up to 90 min</option>
            <option value="120">Up to 120 min</option>
          </select>
        </label>
        <br /><br />

        <button 
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Get Recommendations
        </button>
      </form>
      {movies.length > 0 && (
        <div className="w-full max-w-2xl space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Recommendations:</h2>
          {movies.map((movie, i) => (
            <div 
              key={i} 
              className="bg-white border border-gray-200 rounded shadow p-4"
            >
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
              <button 
                onClick={() => handleSaveMovie(movie)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >Save to Favorites
              </button>
            </div>
          ))}
        </div>
        
      )}
      
      
    </main>
  );
}