import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetails.css";

const MovieDetails = () => {
  const { imdbID } = useParams();
  console.log(imdbID);
  const [movieDetails, setMovieDetails] = useState(null);
  const [editedMovieDetails, setEditedMovieDetails] = useState(null);
  const apiKey = "7d639657";
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const localStorageData = localStorage.getItem(imdbID);
        if (localStorageData) {
          setMovieDetails(JSON.parse(localStorageData));
        } else {
          const response = await fetch(
            `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`
          );
          if (response.ok) {
            const data = await response.json();
            setMovieDetails(data);
          } else {
            console.error("Error fetching movie details:", response.status);
          }
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [imdbID, apiKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMovieDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSave = () => {
    if (editedMovieDetails) {
      // Retrieve the existing editedMovies array from local storage
      const existingEditedMovies =
        JSON.parse(localStorage.getItem("editedMovies")) || [];
      // Add the new edited movie details to the array
      const updatedEditedMovies = [
        ...existingEditedMovies,
        { imdbID, ...editedMovieDetails },
      ];
      // Save the updated array to local storage
      localStorage.setItem("editedMovies", JSON.stringify(updatedEditedMovies));
      // Update the movieDetails state with the edited details
      setMovieDetails(editedMovieDetails);
      setEditedMovieDetails(null);
    }
  };

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="header">Movie Details</h2>
      {/* Display the movie details */}
      <img
        className="poster"
        src={movieDetails.Poster}
        alt={movieDetails.Title}
      />
      <div className="details">
        <p>Title: {movieDetails.Title}</p>
        <p>Year: {movieDetails.Year}</p>
        <p>Genre: {movieDetails.Genre}</p>
      </div>
      {/* Show input fields for editing movie details */}
      {editedMovieDetails ? (
        <div className="editSection">
          <input
            type="text"
            name="Title"
            value={editedMovieDetails.Title}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Year"
            value={editedMovieDetails.Year}
            onChange={handleChange}
          />
          {/* Add other input fields for other movie details */}
          <button className="saveBtn" onClick={handleSave}>
            Save
          </button>
        </div>
      ) : (
        <button
          className="editBtn"
          onClick={() => setEditedMovieDetails(movieDetails)}
        >
          Edit Details
        </button>
      )}
    </div>
  );
};

export default MovieDetails;
