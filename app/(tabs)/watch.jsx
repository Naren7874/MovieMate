import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { RentedContext } from "../../context/RentedContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../theme/ThemeContext"; // Import the useTheme hook

const TMDB_API_KEY = "ab536ec46fded144ba00b87ce07bd5f8"; 

export default function WatchScreen() {
  const { removeMovie, rentedMovies } = useContext(RentedContext);
  const router = useRouter();
  const { movieId } = useLocalSearchParams();
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const movie = rentedMovies.find((m) => m.id == movieId);
  const { theme, toggleTheme, isDarkMode } = useTheme(); // Use the theme context

  useEffect(() => {
    if (!movieId) return;

    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();

        const trailer = data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        setTrailerUrl(
          trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&fs=1` : null
        );
      } catch (error) {
        console.error("Error fetching trailer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [movieId]);

  useEffect(() => {
    const handleOrientationChange = async () => {
      const { width, height } = Dimensions.get("window");

      if (fullScreen) {
        if (width > height) {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    };

    const subscription = Dimensions.addEventListener("change", handleOrientationChange);
    
    return () => subscription.remove();
  }, [fullScreen]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const enterFullScreen = async () => {
    setFullScreen(true);
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const exitFullScreen = async () => {
    setFullScreen(false);
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  };

  const markAsWatched = async () => {
    await removeMovie(movieId);
    router.push("/rented");
  };

  const confirmMarkAsWatched = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to mark this movie as watched?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: markAsWatched }
      ]
    );
  };

  if (!movieId) return <Text style={[styles.errorText, { color: theme.colors.text }]}>Error: No Movie Selected</Text>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Watch</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.movieTitle, { color: theme.colors.text }]}>{movie?.title || "Movie"}</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : trailerUrl ? (
        <View style={fullScreen ? styles.fullScreenVideo : styles.videoContainer}>
          <WebView
            source={{ uri: trailerUrl }}
            style={styles.webView}
            allowsFullscreenVideo
          />
          <TouchableOpacity 
            onPress={fullScreen ? exitFullScreen : enterFullScreen} 
            style={styles.fullscreenButton}
          >
            <Ionicons name={fullScreen ? "contract" : "expand"} size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.noTrailerText, { color: theme.colors.text }]}>No Trailer Available</Text>
      )}

      {!fullScreen && (
        <TouchableOpacity 
          onPress={confirmMarkAsWatched} 
          style={[styles.watchedButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.watchedButtonText}>Mark as Watched</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  errorText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeToggle: {
    padding: 8,
  },
  movieTitle: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 40,
  },
  videoContainer: {
    height: '40%',
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  webView: {
    flex: 1,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  noTrailerText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 40,
  },
  watchedButton: {
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  watchedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});