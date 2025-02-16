import React, { useContext } from "react";
import { View, Button, Text } from "react-native";
import { RentedContext } from "../../context/RentedContext";

export default function WatchScreen({ route, navigation }) {
  const { removeMovie } = useContext(RentedContext);

  if (!route?.params || !route.params.movieId) {
    return <Text>Error: No Movie Selected</Text>;
  }

  const { movieId } = route.params;

  return (
    <View>
      <Text>Watching Movie ID: {movieId}</Text>
      <Button
        title="Mark as Watched"
        onPress={() => {
          removeMovie(movieId);
          navigation.navigate("rented"); 
        }}
      />
    </View>
  );
}
