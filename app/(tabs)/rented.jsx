import { useContext } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { RentedContext } from "../../context/RentedContext";
import MovieCard from "../components/MovieCard";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../theme/ThemeContext";

export default function RentedScreen() {
  const { rentedMovies } = useContext(RentedContext);
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 16, paddingBottom: 12, marginTop: 20, paddingLeft: 12 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.colors.text }}>Rented Movies</Text>
      </View>

      <FlatList
        data={rentedMovies}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onWatch={() => router.push(`/watch?movieId=${item.id}`)}
            isRented={true}
          />
        )}
      />
    </SafeAreaView>
  );
}
