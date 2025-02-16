import React, { useContext, useState } from "react";
import { View, TextInput, Button, FlatList } from "react-native";
import MovieCard from "../components/MovieCard";
import { MovieContext } from "../../context/MovieContext";

export default function HomeScreen({ navigation }) {
  const { movies, searchMovies } = useContext(MovieContext);
  const [query, setQuery] = useState("");

  return (
    <View>
      <TextInput placeholder="Search Movies" onChangeText={setQuery} />
      <Button title="Search" onPress={() => searchMovies(query)} />
      <FlatList
        data={movies}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : `movie-${index}`)}
        renderItem={({ item }) => (
          <MovieCard movie={item} onWatch={(id) => navigation.navigate("watch", { movieId: id })} />
        )}
      />
    </View>
  );
}
