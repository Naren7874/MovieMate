import React, { useContext, useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MovieContext } from "../../context/MovieContext";
import { RentedContext } from "../../context/RentedContext";
import { WatchedContext } from "../../context/WatchedContext";
import MovieCard from "../components/Card";
import { router } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const numColumns = width >= 768 ? 3 : 2;

const TMDB_API_KEY = "ab536ec46fded144ba00b87ce07bd5f8";
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

export default function HomeScreen() {
  const { movies, searchMovies } = useContext(MovieContext);
  const { rentedMovies } = useContext(RentedContext);
  const { watchedMovies } = useContext(WatchedContext);
  const [query, setQuery] = useState("");
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { isDarkMode, toggleTheme, theme } = useTheme();

  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok)
          throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        setLatestMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching latest movies:", error);
        Alert.alert(
          "Connection Error",
          "Unable to fetch movies. Please check your internet connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMovies();
  }, []);

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

  const handleSearch = () => {
    if (query.length > 2) {
      searchMovies(query);
      setIsSearching(true);
    } else {
      Alert.alert(
        "Search Too Short",
        "Please enter at least 3 characters to search for movies.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const renderMovieList = (data) => (
    <Animated.FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      key={numColumns}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeIn.delay(index * 100)}
          layout={Layout.springify()}
        >
          <MovieCard
            movie={item}
            onWatch={() => router.push(`/watch?movieId=${item.id}`)}
          />
        </Animated.View>
      )}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? theme.colors.background : "#ffffff" },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="movie-open"
            size={32}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? "#ffffff" : "#000000" },
            ]}
          >
            Movie
            <Text style={{ color: theme.colors.primary }}>Mate</Text>
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: theme.colors.cardBackground },
            ]}
            onPress={() => router.push("/rented")}
          >
            <Feather name="film" size={22} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: theme.colors.cardBackground },
            ]}
            onPress={toggleTheme}
          >
            <Feather
              name={isDarkMode ? "sun" : "moon"}
              size={22}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: theme.colors.cardBackground,
              borderColor: isDarkMode ? "#333" : "#e0e0e0",
            },
          ]}
        >
          <Feather
            name="search"
            size={20}
            color={theme.colors.primary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDarkMode ? theme.colors.text : "#000000" },
            ]}
            placeholder="Search for movies..."
            placeholderTextColor={isDarkMode ? "#888" : "#666"}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setIsSearching(text.length > 2);
              if (text.length > 2) handleSearch();
            }}
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setIsSearching(false);
              }}
              style={styles.clearButton}
            >
              <Feather name="x-circle" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching && (
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            setQuery("");
            setIsSearching(false);
          }}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Latest Movies</Text>
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        {!isSearching && (
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkMode ? theme.colors.text : "#000000" },
            ]}
          >
            Now Playing
          </Text>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          renderMovieList(isSearching ? filteredSearchMovies : availableMovies)
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  listContainer: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
