import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MovieList from "./Components/MovieList";
import LikedMovies from "./Components/LikedMovies";
import MovieDetails from "./Components/MovieDetails";

function App() {
  return (
    <Router>
      <div>
        <h1>Movie App</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/liked">Liked Movies</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/liked" element={<LikedMovies />} />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
