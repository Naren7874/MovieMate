import React, { useContext, useState, useEffect } from "react";
import { View, TextInput, Button, FlatList, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MovieContext } from "../../context/MovieContext";
import MovieCard from "../components/MovieCard";
import { router } from "expo-router";

const TMDB_API_KEY = "ab536ec46fded144ba00b87ce07bd5f8"; // Replace with your TMDB API Key

export default function HomeScreen() {
  const { movies, searchMovies } = useContext(MovieContext);
  const [query, setQuery] = useState("");
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await response.json();
        setLatestMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching latest movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMovies();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      {/* 🔍 Search Input */}
      <TextInput
        placeholder="Search Movies"
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      <Button
        title="Search"
        onPress={() => {
          searchMovies(query);
          setIsSearching(true); // Hide latest movies
        }}
      />

      {/* ⬅️ Back Button (Only Show when Searching) */}
      {isSearching && (
        <Button
          title="Back to Latest Movies"
          onPress={() => setIsSearching(false)}
          color="red"
        />
      )}

      {/* 🎥 Display Either Search Results or Latest Movies */}
      {isSearching ? (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard movie={item} onWatch={() => router.push(`/watch?movieId=${item.id}`)} />
          )}
        />
      ) : (
        <>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>Latest Movies</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={latestMovies}
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
