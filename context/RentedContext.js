import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const RentedContext = createContext();

export const RentedProvider = ({ children }) => {
  const [rentedMovies, setRentedMovies] = useState([]);

  useEffect(() => {
    loadRentedMovies();
  }, []);

  const loadRentedMovies = async () => {
    try {
      const storedMovies = await AsyncStorage.getItem("rentedMovies");
      if (storedMovies) {
        setRentedMovies(JSON.parse(storedMovies));
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    }
  };

  const rentMovie = async (movie) => {
    try {
      const updatedMovies = [...rentedMovies, movie];
      setRentedMovies(updatedMovies);
      await AsyncStorage.setItem("rentedMovies", JSON.stringify(updatedMovies));
    } catch (error) {
      console.error("Error renting movie:", error);
    }
  };

  const removeMovie = async (movieId) => {
    try {
      const updatedMovies = rentedMovies.filter((movie) => movie.id !== movieId);
      setRentedMovies(updatedMovies);
      await AsyncStorage.setItem("rentedMovies", JSON.stringify(updatedMovies));
    } catch (error) {
      console.error("Error removing movie:", error);
    }
  };

  return (
    <RentedContext.Provider value={{ rentedMovies, rentMovie, removeMovie }}>
      {children}
    </RentedContext.Provider>
  );
};
