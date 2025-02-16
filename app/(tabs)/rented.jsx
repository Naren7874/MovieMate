import { useContext } from "react";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import { RentedContext } from "../../context/RentedContext";
import MovieCard from "../components/MovieCard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RentedScreen() {
  const { rentedMovies } = useContext(RentedContext);
  const router = useRouter(); 

  return (
    <SafeAreaView>
      <FlatList
        data={rentedMovies}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        } 
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
