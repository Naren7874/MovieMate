import React, { useContext, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MovieContext } from "../../context/MovieContext";
import { RentedContext } from "../../context/RentedContext";
import { WatchedContext } from "../../context/WatchedContext"; // ✅ Import Watched Context
import MovieCard from "../components/MovieCard";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather"; // ✅ Import Feather for theme toggle
import { useTheme } from "../../theme/ThemeContext";

const TMDB_API_KEY = "ab536ec46fded144ba00b87ce07bd5f8"; // Replace with your TMDB API Key
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

export default function HomeScreen() {
  const { movies, searchMovies } = useContext(MovieContext);
  const { rentedMovies } = useContext(RentedContext);
  const { watchedMovies } = useContext(WatchedContext);
  const [query, setQuery] = useState("");
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme(); // ✅ Get theme state & toggle function

  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        const response = await fetch(API_URL, { method: "GET" });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLatestMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching latest movies:", error);
        Alert.alert(
          "Error",
          "Failed to fetch movies. Please check your internet connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMovies();
  }, []);

  // ✅ Filter out rented and watched movies
  const availableMovies = latestMovies.filter(
    (movie) =>
      !rentedMovies.some((rentedMovie) => rentedMovie.id === movie.id) &&
      !watchedMovies.some((watchedMovie) => watchedMovie.id === movie.id)
  );

  const filteredSearchMovies = movies.filter(
    (movie) =>
      !rentedMovies.some((rentedMovie) => rentedMovie.id === movie.id) &&
      !watchedMovies.some((watchedMovie) => watchedMovie.id === movie.id)
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: isDarkMode ? "#121212" : "#ffffff" }}>
      {/* Header with Theme Toggle */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", color: isDarkMode ? "white" : "black", paddingTop: 10, paddingLeft: 2 }}>
          <Text style={{ color: "#007bff" }}>Movie</Text>Rental
        </Text>
        
        {/* 🌞/🌙 Theme Toggle Icon */}
        <TouchableOpacity onPress={toggleTheme} style={{ paddingRight: 10 }}>
          <Feather name={isDarkMode ? "sun" : "moon"} size={30} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      {/* 🔍 Search Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          paddingHorizontal: 5,
          gap: 7,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: isDarkMode ? "#555" : "#ccc",
            backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
            color: isDarkMode ? "white" : "black",
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Search Movies"
          placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setIsSearching(text.length > 2);
          }}
        />

        {/* ❌ Close Button */}
        {query.length > 2 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setIsSearching(false);
            }}
          >
            <Entypo name="circle-with-cross" size={24} color={isDarkMode ? "white" : "black"} style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        )}

        {/* 🔍 Search Button */}
        <Button
          title="Search"
          onPress={() => {
            if (query.length > 2) {
              searchMovies(query);
              setIsSearching(true);
            } else {
              Alert.alert("Enter at least 2 characters to search.");
            }
          }}
        />

        {/* 📂 Rented Movies Button */}
        <Button title="Rented" color="green" onPress={() => router.push(`/rented`)} />
      </View>

      {/* ⬅️ Back Button (Only Show when Searching) */}
      {isSearching && (
        <Button
          title="Back to Latest Movies"
          onPress={() => {
            setQuery("");
            setIsSearching(false);
          }}
          color="red"
          style={{ marginBottom: 10 }}
        />
      )}

      {/* 🎥 Display Either Search Results or Available Movies */}
      {isSearching ? (
        <FlatList
          data={filteredSearchMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard movie={item} onWatch={() => router.push(`/watch?movieId=${item.id}`)} />
          )}
        />
      ) : (
        <>
          <Text style={{ fontSize: 25, fontWeight: "bold", marginVertical: 10, paddingLeft: 10, color: isDarkMode ? "white" : "black" }}>
            Latest Movies
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <FlatList
              data={availableMovies}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <MovieCard movie={item} onWatch={() => router.push(`/watch?movieId=${item.id}`)} />
              )}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
