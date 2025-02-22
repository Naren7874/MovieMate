import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { RentedContext } from "../../context/RentedContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../theme/ThemeContext";
import Animated, { FadeIn } from 'react-native-reanimated';

const API_KEY = "ab536ec46fded144ba00b87ce07bd5f8";

export default function MoviePlayer() {
  const { removeMovie, rentedMovies } = useContext(RentedContext);
  const router = useRouter();
  const { movieId } = useLocalSearchParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const selectedMovie = rentedMovies.find((m) => m.id == movieId);
  const { theme, toggleTheme, isDarkMode } = useTheme();

  useEffect(() => {
    if (!movieId) return;

    const getMovieTrailer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();

        const trailer = data.results.find(
          (clip) => clip.type === "Trailer" && clip.site === "YouTube"
        );

        setVideoUrl(
          trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&fs=1` : null
        );
      } catch (err) {
        console.error("Failed to fetch trailer:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getMovieTrailer();
  }, [movieId]);

  useEffect(() => {
    const adjustScreenOrientation = async () => {
      const { width, height } = Dimensions.get("window");

      if (isFullScreen) {
        if (width > height) {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    };

    const orientationListener = Dimensions.addEventListener("change", adjustScreenOrientation);

    return () => orientationListener.remove();
  }, [isFullScreen]);

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

  const enableFullScreen = async () => {
    setIsFullScreen(true);
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const disableFullScreen = async () => {
    setIsFullScreen(false);
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  };

  const finishWatching = async () => {
    await removeMovie(movieId);
    router.push("/rented");
  };

  const confirmFinishWatching = () => {
    Alert.alert(
      "Mark as Watched",
      "Are you sure you want to mark this movie as watched? It will be removed from your library.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Mark as Watched",
          style: "default",
          onPress: finishWatching
        }
      ]
    );
  };

  if (!movieId) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Feather name="alert-circle" size={64} color={theme.colors.primary} />
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          No movie selected
        </Text>
        <TouchableOpacity
          style={[styles.errorButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeIn} style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.iconButton, { backgroundColor: theme.colors.cardBackground }]}
          >
            <Feather name="arrow-left" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: theme.colors.cardBackground }]}
          >
            <Feather 
              name={isDarkMode ? "sun" : "moon"} 
              size={22}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.movieTitle, { color: theme.colors.text }]}>
          {selectedMovie?.title || "Movie"}
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Loading trailer...
            </Text>
          </View>
        ) : videoUrl ? (
          <View style={isFullScreen ? styles.fullScreenContainer : styles.videoWrapper}>
            <WebView
              source={{ uri: videoUrl }}
              style={styles.webView}
              allowsFullscreenVideo
            />
            <TouchableOpacity 
              onPress={isFullScreen ? disableFullScreen : enableFullScreen} 
              style={styles.fullscreenToggle}
            >
              <Feather 
                name={isFullScreen ? "minimize-2" : "maximize-2"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noTrailerContainer}>
            <Feather name="video-off" size={64} color={theme.colors.primary} />
            <Text style={[styles.noTrailerText, { color: theme.colors.text }]}>
              No trailer available
            </Text>
          </View>
        )}
        
        {!isFullScreen && (
          <TouchableOpacity 
            onPress={confirmFinishWatching} 
            style={[styles.watchedButton, { backgroundColor: theme.colors.primary }]}
          >
            <Feather name="check-circle" size={24} color="white" />
            <Text style={styles.watchedButtonText}>Mark as Watched</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  movieTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  videoWrapper: {
    height: '40%',
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  fullScreenContainer: {
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
  fullscreenToggle: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 24,
  },
  noTrailerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTrailerText: {
    fontSize: 18,
    marginTop: 16,
  },
  watchedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 24,
    borderRadius: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  watchedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});