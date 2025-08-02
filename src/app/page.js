"use client"; //tells Next.js this file runs in browser not just server
import { useState } from "react"; //use useState hook from react to store and update data
import { useRouter } from "next/navigation";

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
    <main> 
      <h1>MoodMatch 🎬</h1>

      <button type="button" onClick={handleViewFavorites}>View Favorites</button>

        {favorites && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Favorites:</h2>
            <pre style={{ whiteSpace: "pre-wrap" }}>{favorites}</pre>
          </div>
        )}
        <br /><br />

      <form onSubmit={handleSubmit}> 
        <label>
          How are you feeling? 
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
          />
        </label>
        <br /><br />

        <label>
          How much time do you have?
          <select value={runtimeInput} onChange={(e) => setRuntimeInput(e.target.value)}>
            <option value="60">Less than 60 min</option>
            <option value="90">Up to 90 min</option>
            <option value="120">Up to 120 min</option>
          </select>
        </label>
        <br /><br />

        <button type="submit">Get Recommendations</button>
      </form>
      {movies.length > 0 && (
        <div>
          <h2>Recommendations:</h2>
          {movies.map((movie, i) => (
            <div key={i} style={{ marginBottom: "1rem" }}>
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
              <button onClick={() => handleSaveMovie(movie)}>Save to Favorites</button>
            </div>
          ))}
        </div>
        
      )}
    </main>
  );
}