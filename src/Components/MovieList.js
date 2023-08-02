import React, { useState, useEffect, useRef } from "react";
import Movie from "./Movie";
import LikedMovies from "./LikedMovies";
import { Link } from "react-router-dom";
import "./MovieList.css";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cachedPages, setCachedPages] = useState([]);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  const ITEMS_PER_PAGE = 10;
  const apiKey = "7d639657";

  const handleLikeToggle = (imdbID) => {
    const likedMovie = movies.find((movie) => movie.imdbID === imdbID);
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

  useEffect(() => {
    // Load cached pages from localStorage during initial render
    const cachedPagesString = localStorage.getItem("cachedPages");
    if (cachedPagesString) {
      setCachedPages(JSON.parse(cachedPagesString));
    }
    console.log(cachedPages);
  }, []);

  useEffect(() => {
    if (!cachedPages.includes(currentPage)) {
      fetchMovies(currentPage);
    }
    const nextPage = currentPage + 1;
    const nextPagePlusOne = currentPage + 2;
    if (!cachedPages.includes(nextPage)) {
      fetchMovies(nextPage);
    }
    if (!cachedPages.includes(nextPagePlusOne)) {
      fetchMovies(nextPagePlusOne);
    }
  }, [currentPage, cachedPages]);

  useEffect(() => {
    // Update localStorage whenever cachedPages state changes
    localStorage.setItem("cachedPages", JSON.stringify(cachedPages));
  }, [cachedPages]);

  const fetchMovies = async (page) => {
    try {
      // Replace 'YOUR_OMDB_API_KEY' with your actual OMDB API key

      setIsLoading(true);
      const response = await fetch(
        `http://www.omdbapi.com/?s=${searchTerm}&y=${yearFilter}&apikey=${apiKey}&page=${page}`
      );
      const data = await response.json();
      if (data?.Search) {
        if (data?.Search.length < ITEMS_PER_PAGE) {
          setHasMorePages(false); // No more pages to fetch
        } else {
          setHasMorePages(true); // There are more pages to fetch
        }
        let editedMoviesString = localStorage.getItem("editedMovies");
        let editedMovies = editedMoviesString
          ? JSON.parse(editedMoviesString)
          : [];

        editedMovies = Array.isArray(editedMovies) ? editedMovies : [];

        let updatedMovies = data.Search.map((movie) => {
          let editedMovie = editedMovies.find(
            (editedMovie) => editedMovie.imdbID === movie.imdbID
          );
          return editedMovie || movie;
        });
        setMovies((prevMovies) => [...prevMovies, ...updatedMovies]);
        setCachedPages((prevCachedPages) => [...prevCachedPages, page]);
      } else {
        console.error("No movies found.");
        setHasMorePages(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movie data:", error);
      setHasMorePages(false);
    }
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleYearFilterChange = (event) => {
    setYearFilter(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to the first page when performing a new search
    setMovies([]); // Clear the current movie list when performing a new search
    setCachedPages([]); // Clear the cached pages when performing a new search
    setHasMorePages(true);
  };
  const paginateMovies = (movies, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return movies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMorePages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const currentMovies = paginateMovies(movies, currentPage);
  return (
    <div className="container">
      <h2 className="header">Movie List</h2>
      <form className="form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search movies..."
        />
        <input
          type="number"
          value={yearFilter}
          onChange={handleYearFilterChange}
          placeholder="Filter by year..."
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {currentMovies?.map((movie) => (
          <li key={movie.imdbID}>
            <Movie
              movie={movie}
              isLiked={likedMovies.some(
                (likedMovie) => likedMovie.imdbID === movie.imdbID
              )}
              onLikeToggle={() => handleLikeToggle(movie.imdbID)}
            />
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={handlePrevPage}>
          Previous
        </button>
        <span>{currentPage}</span>
        <button disabled={isLoading || !hasMorePages} onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieList;
