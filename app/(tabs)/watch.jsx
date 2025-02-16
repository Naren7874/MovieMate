import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { RentedContext } from "../../context/RentedContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

const TMDB_API_KEY = "ab536ec46fded144ba00b87ce07bd5f8"; 

export default function WatchScreen() {
  const { removeMovie, rentedMovies } = useContext(RentedContext);
  const router = useRouter();
  const { movieId } = useLocalSearchParams();
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showModal, setShowModal] = useState(false); // For Web Modal
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

    const subscription = Dimensions.addEventListener("change", handleOrientationChange);
    
    return () => subscription.remove(); // ✅ Corrected event removal
  }, []);

  const markAsWatched = async () => {
    await removeMovie(movieId);
    router.push("/rented");
  };

  const confirmMarkAsWatched = () => {
    if (Platform.OS === "android" || Platform.OS === "ios" || Platform.OS === "macos") {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to mark this movie as watched?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: markAsWatched }
        ]
      );
    } else {
      setShowModal(true); // Show custom modal for web
    }
  };

  if (!movieId) return <Text className="text-center text-red-500 font-bold">Error: No Movie Selected</Text>;

  return (
    <SafeAreaView className="flex-1 bg-white px-4">

      {/* 🔙 Back Button & Title */}
      <View className="flex-row items-center py-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">{movie?.title || "Movie"}</Text>
      </View>

      {/* 🎥 Trailer Section */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
      ) : trailerUrl ? (
        <WebView
          source={{ uri: trailerUrl }}
          className={`${isLandscape ? "h-full w-full" : "h-2/5 w-full rounded-lg shadow-lg"}`} 
          allowsFullscreenVideo
        />
      ) : (
        <Text className="text-center text-lg text-gray-500 mt-10">No Trailer Available</Text>
      )}

      {/* ✅ "Mark as Watched" Button (Only in Portrait Mode) */}
      {!isLandscape && (
        <TouchableOpacity 
          onPress={confirmMarkAsWatched} 
          className="bg-blue-500 py-3 mt-5 mb-5 rounded-lg shadow-md shadow-gray-500 items-center"
        >
          <Text className="text-white text-lg font-semibold">Mark as Watched</Text>
        </TouchableOpacity>
      )}

      {/* 🌐 Custom Confirmation Modal for Web */}
      {Platform.OS === "web" && showModal && (
        <Modal
          transparent
          animationType="fade"
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-lg p-5 w-4/5 shadow-lg">
              <Text className="text-lg font-semibold mb-4 text-center">Are you sure you want to mark this movie as watched?</Text>
              <View className="flex-row justify-around">
                <TouchableOpacity 
                  onPress={() => setShowModal(false)} 
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  <Text className="text-black">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setShowModal(false);
                    markAsWatched();
                  }} 
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white">Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
}
