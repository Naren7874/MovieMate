import { useContext } from "react"
import { View, Text, Image, StyleSheet, Alert, Dimensions } from "react-native"
import { Button, Card, useTheme } from "@rneui/themed"
import { RentedContext } from "../../context/RentedContext"

const { width } = Dimensions.get("window")
const numColumns = width >= 768 ? 3 : 2
const cardWidth = (width - (32 + (numColumns + 1) * 8)) / numColumns

export default function MovieCard({ movie, onWatch }) {
  const { rentedMovies, rentMovie } = useContext(RentedContext)
  const { theme } = useTheme()

  const isRented = rentedMovies.some((rentedMovie) => rentedMovie.id === movie.id)

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image"

  const handleRentMovie = () => {
    const randomPrice = (Math.random() * (9.99 - 2.99) + 2.99).toFixed(2)

    Alert.alert("Confirm Rental", `Do you want to rent "${movie.title}" for $${randomPrice}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: () => rentMovie(movie) },
    ])
  }

  return (
    <Card
      containerStyle={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.primary,
          width: cardWidth,
        },
      ]}
    >
      <View style={styles.cardContent}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
            {movie.title}
          </Text>

          <Text style={[styles.details, { color: theme.colors.text }]}>
            ⭐ {movie.vote_average || "N/A"} | 📅 {movie.release_date || "Unknown"}
          </Text>

          <Text style={[styles.overview, { color: theme.colors.text }]} numberOfLines={3}>
            {movie.overview || "No description available."}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {isRented ? (
            <Button
              title="Watch Now"
              buttonStyle={[styles.watchButton, { backgroundColor: theme.colors.primary }]}
              titleStyle={styles.buttonText}
              onPress={() => onWatch(movie.id)}
            />
          ) : (
            <Button
              title="Rent"
              buttonStyle={[styles.rentButton, { backgroundColor: theme.colors.primary }]}
              titleStyle={styles.buttonText}
              onPress={handleRentMovie}
            />
          )}
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 8,
    margin: 4,
    marginBottom:10,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    minHeight: 360, // Set a minimum height for consistent card sizes
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    resizeMode: "cover",
  },
  textContainer: {
    marginTop: 8,
    flex: 1, // This will make the text container take up remaining space
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    marginBottom: 4,
  },
  overview: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 'auto', // This pushes the button container to the bottom
    paddingTop: 8,
  },
  watchButton: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  rentButton: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
})