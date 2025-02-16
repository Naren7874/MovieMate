import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { RentedContext } from "../../context/RentedContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "@react-navigation/native";

const TMDB_API_KEY = "ab536ec46fded144ba00b87ce07bd5f8"; 

export default function WatchScreen() {
  const { removeMovie, rentedMovies } = useContext(RentedContext);
  const router = useRouter();
  const { movieId } = useLocalSearchParams();
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
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

  // ✅ FIX: Reset orientation when leaving the screen (even if exited unconventionally)
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }, [])
  );

  // ✅ FIX: Reset orientation on unmount (handles unconventional back)
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

  if (!movieId) return <Text className="text-center text-red-500 font-bold">Error: No Movie Selected</Text>;

  return (
    <SafeAreaView className="flex-1 bg-white px-4">

      {/* 🔙 Back Button & Title */}
      <View className="flex-row items-center py-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Watch</Text>
      </View>

      {/* 🎥 Trailer Section */}
      <Text className="text-4xl text-center mb-5 font-bold">{movie?.title || "Movie"}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
      ) : trailerUrl ? (
        <View  className={`${fullScreen ? "absolute top-0 left-0 right-0 bottom-0 z-50" : "h-2/5 w-full rounded-lg shadow-lg"}`}>
          <WebView
            source={{ uri: trailerUrl }}
            style={{ flex: 1 }}
            allowsFullscreenVideo
          />
          <TouchableOpacity 
            onPress={fullScreen ? exitFullScreen : enterFullScreen} 
            className="absolute bottom-2 right-2 bg-black bg-opacity-50 p-2 rounded-full"
          >
            <Ionicons name={fullScreen ? "contract" : "expand"} size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <Text className="text-center text-lg text-gray-500 mt-10">No Trailer Available</Text>
      )}

      {/* ✅ "Mark as Watched" Button (Only in Portrait Mode) */}
      {!fullScreen && (
        <TouchableOpacity 
          onPress={confirmMarkAsWatched} 
          className="bg-blue-500 py-3 mt-5 mb-5 rounded-lg shadow-md shadow-gray-500 items-center"
        >
          <Text className="text-white text-lg font-semibold">Mark as Watched</Text>
        </TouchableOpacity>
      )}

    </SafeAreaView>
  );
}
