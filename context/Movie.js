import React, { createContext, useState } from "react";
import axios from "axios";

// Create the MovieContext
export const MovieContext = createContext();

// Define the MovieProvider component
export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);

  // API Configuration
  const API_ENDPOINT = "https://api.themoviedb.org/3/search/movie";
  const API_KEY = "ab536ec46fded144ba00b87ce07bd5f8";

  // Function to fetch movies based on search query
  const fetchMovies = async (query) => {
    if (!query.trim()) return;

    try {
      const { data } = await axios.get(API_ENDPOINT, {
        params: { query, api_key: API_KEY },
      });

      setMovies(data.results);
    } catch (error) {
      console.error("Movie fetch failed:", error);
    }
  };

  return (
    <MovieContext.Provider value={{ movies, searchMovies: fetchMovies }}>
      {children}
    </MovieContext.Provider>
  );
};
