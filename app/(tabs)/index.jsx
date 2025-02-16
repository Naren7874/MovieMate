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

const TMDB_API_KEY = "ab536ec46fded144ba00b87ce07bd5f8"; // Replace with your TMDB API Key
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

export default function HomeScreen() {
  const { movies, searchMovies } = useContext(MovieContext);
  const { rentedMovies } = useContext(RentedContext);
  const { watchedMovies } = useContext(WatchedContext); // ✅ Get watched movies
  const [query, setQuery] = useState("");
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

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

  // ✅ Filter out rented movies (Already in `RentedContext`)
  // ✅ Filter out watched movies (Now using `WatchedContext`)
  const availableMovies = latestMovies.filter(
    (movie) =>
      !rentedMovies.some((rentedMovie) => rentedMovie.id === movie.id) &&
      !watchedMovies.some((watchedMovie) => watchedMovie.id === movie.id) // ✅ Exclude watched movies
  );

  // ✅ When searching, show only movies that are NOT rented & NOT watched
  const filteredSearchMovies = movies.filter(
    (movie) =>
      !rentedMovies.some((rentedMovie) => rentedMovie.id === movie.id) &&
      !watchedMovies.some((watchedMovie) => watchedMovie.id === movie.id)
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <Text className="mb-5 text-5xl font-bold pt-10 pl-2 ">
        <Text className="text-blue-600">Movie</Text>Rental
      </Text>

      {/* 🔍 Search Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          gap: 7,
          paddingHorizontal: 5,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Search Movies"
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
            <Entypo
              name="circle-with-cross"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
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
          className="mb-10"
        />
      )}

      {/* 🎥 Display Either Search Results or Available Movies */}
      {isSearching ? (
        <FlatList
          data={filteredSearchMovies} // ✅ Ensure search results exclude rented & watched
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onWatch={() => router.push(`/watch?movieId=${item.id}`)}
            />
          )}
        />
      ) : (
        <>
          <Text style={{ fontSize: 25, fontWeight: "bold", marginVertical: 10, paddingLeft: 5 }}>
            Latest Movies
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={availableMovies} // ✅ Display only available movies (not rented, not watched)
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <MovieCard
                  movie={item}
                  onWatch={() => router.push(`/watch?movieId=${item.id}`)}
                />
              )}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
