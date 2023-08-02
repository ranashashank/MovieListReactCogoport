import { Link } from "react-router-dom";

import "./Movie.css";

const Movie = ({ movie, isLiked, onLikeToggle }) => {
  return (
    <div className="movie-container">
      <Link to={`/movie/${movie.imdbID}`}>
        <img src={movie.Poster} alt={movie.Title} />
      </Link>

      <div className="movie-details">
        <h3>{movie.Title}</h3>
        <p>Year: {movie.Year}</p>
        <p>Type: {movie.Type}</p>

        {isLiked ? (
          <button className="unlike-button" onClick={onLikeToggle}>
            Remove Like
          </button>
        ) : (
          <button className="like-button" onClick={onLikeToggle}>
            Like
          </button>
        )}
      </div>
    </div>
  );
};

export default Movie;
