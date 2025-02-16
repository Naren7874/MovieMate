import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const WatchedContext = createContext();

export const WatchedProvider = ({ children }) => {
  const [watchedMovies, setWatchedMovies] = useState([]);

  // Load watched movies on startup
  useEffect(() => {
    loadWatchedMovies();
  }, []);

  const loadWatchedMovies = async () => {
    try {
      const storedMovies = await AsyncStorage.getItem("watchedMovies");
      if (storedMovies) {
        setWatchedMovies(JSON.parse(storedMovies));
      }
    } catch (error) {
      console.error("Error loading watched movies:", error);
    }
  };

  const addWatchedMovie = async (movie) => {
    try {
      const updatedMovies = [...watchedMovies, movie];
      setWatchedMovies(updatedMovies);
      await AsyncStorage.setItem("watchedMovies", JSON.stringify(updatedMovies));
    } catch (error) {
      console.error("Error adding watched movie:", error);
    }
  };

  const removeWatchedMovie = async (movieId) => {
    try {
      const updatedMovies = watchedMovies.filter((movie) => movie.id !== movieId);
      setWatchedMovies(updatedMovies);
      await AsyncStorage.setItem("watchedMovies", JSON.stringify(updatedMovies));
    } catch (error) {
      console.error("Error removing watched movie:", error);
    }
  };

  return (
    <WatchedContext.Provider value={{ watchedMovies, addWatchedMovie, removeWatchedMovie }}>
      {children}
    </WatchedContext.Provider>
  );
};
