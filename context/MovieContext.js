import React, { createContext, useState } from "react";
import axios from "axios";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const API_URL = "https://api.themoviedb.org/3/search/movie";
  const API_KEY = "ab536ec46fded144ba00b87ce07bd5f8";

  const searchMovies = async (query) => {
    if (!query.trim()) return;
    
    try {
      const response = await axios.get(`${API_URL}?query=${query}&api_key=${API_KEY}`);
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return <MovieContext.Provider value={{ movies, searchMovies }}>{children}</MovieContext.Provider>;
};
