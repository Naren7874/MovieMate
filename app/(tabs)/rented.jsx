import { useContext } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { RentedContext } from "../../context/RentedContext";
import MovieCard from "../components/MovieCard";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function RentedScreen() {
  const { rentedMovies } = useContext(RentedContext);
  const router = useRouter(); 

  return (
    <SafeAreaView className=" mb-24">
      <View className="flex-row font-bold items-center pt-4 pb-3 mt-5 pl-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Rented Movies</Text>
      </View>
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
