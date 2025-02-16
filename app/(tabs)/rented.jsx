import { useContext } from "react";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";  // ✅ Use useRouter from expo-router
import { RentedContext } from "../../context/RentedContext";
import MovieCard from "../components/MovieCard";

export default function RentedScreen() {
  const { rentedMovies } = useContext(RentedContext);
  const router = useRouter(); // ✅ Get router instance

  return (
    <FlatList
    data={rentedMovies}
    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // ✅ Always unique
    renderItem={({ item }) => (
      <MovieCard movie={item} onWatch={() => router.push(`/watch?movieId=${item.id}`)} isRented={true} />
    )}
  />  
  );
}
