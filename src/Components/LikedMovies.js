import React, { useEffect, useState } from "react";
import MovieDetails from "./MovieDetails.js";
import { Link } from "react-router-dom";
import Movie from "./Movie.js";

const LikedMovies = () => {
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    // Retrieve liked movies from localStorage during initial render
    const likedMoviesStorage = JSON.parse(
      localStorage.getItem("likedMoviesStorage") || "{}"
    );
    const likedMoviesArray = Object.values(likedMoviesStorage);
    setLikedMovies(likedMoviesArray);
  }, []);
  const onLikeToggle = (imdbID) => {
    const likedMovie = likedMovies.find((movie) => movie.imdbID === imdbID);
    if (likedMovie) {
      setLikedMovies(
        (prevLikedMovies) =>
          prevLikedMovies.some((movie) => movie.imdbID === imdbID)
            ? prevLikedMovies.filter((movie) => movie.imdbID !== imdbID) // Unlike the movie
            : [...prevLikedMovies, likedMovie] // Like the movie
      );
      // Save the liked movie details in localStorage
      const likedMoviesStorage = JSON.parse(
        localStorage.getItem("likedMoviesStorage") || "{}"
      );

      if (likedMoviesStorage[imdbID]) {
        delete likedMoviesStorage[imdbID]; // Remove the movie from the storage
      } else {
        likedMoviesStorage[imdbID] = likedMovie; // Add the movie to the storage
      }

      localStorage.setItem(
        "likedMoviesStorage",
        JSON.stringify(likedMoviesStorage)
      );
    }
  };
  return (
    <div className="likedMovie-container">
      <h2>Liked Movies</h2>
      <ul>
        {likedMovies.map((likedMovie) => (
          <li key={likedMovie.imdbID}>
            <Movie
              movie={likedMovie}
              isLiked={true}
              onLikeToggle={() => onLikeToggle(likedMovie.imdbID)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikedMovies;
