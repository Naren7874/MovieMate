import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { RentedContext } from "../../context/RentedContext";
import { SafeAreaView } from "react-native-safe-area-context";

const TMDB_API_KEY = "ab536ec46fded144ba00b87ce07bd5f8"; 

export default function WatchScreen() {
  const { removeMovie, rentedMovies } = useContext(RentedContext);
  const router = useRouter();
  const { movieId } = useLocalSearchParams();
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const movie = rentedMovies.find((m) => m.id == movieId);

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
          trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
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
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get("window");
      setIsLandscape(width > height);
    };

    Dimensions.addEventListener("change", handleOrientationChange);
    return () => {
      Dimensions.removeEventListener("change", handleOrientationChange);
    };
  }, []);

  const markAsWatched = async () => {
    await removeMovie(movieId);
    router.push("/rented");
  };

  if (!movieId) return <Text>Error: No Movie Selected</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : trailerUrl ? (
        <WebView
          source={{ uri: trailerUrl }}
          style={{ flex: 1 }}
          allowsFullscreenVideo
        />
      ) : (
        <>
          {movie && (
            <Text
              style={{ fontSize: 22, textAlign: "center", marginVertical: 10 }}
            >
              {movie.title}
            </Text>
          )}
          <Text style={{ textAlign: "center", marginVertical: 10 }}>
            No Trailer Available
          </Text>
        </>
      )}

      {/* {!isLandscape && !trailerUrl && ( */}
      <Button title="Mark as Watched" onPress={markAsWatched} />
      {/* )} */}
    </SafeAreaView>
  );
}
