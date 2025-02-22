import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { RentedContext } from "../../context/RentedContext";
import MovieCard from "../components/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const numColumns = width >= 768 ? 3 : 2;

export default function RentedScreen() {
  const { rentedMovies } = React.useContext(RentedContext);
  const router = useRouter();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather
        name="film"
        size={64}
        color={theme.colors.primary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Rented Movies
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: isDarkMode ? "#888" : "#666" }]}
      >
        Your rented movies will appear here
      </Text>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push("/")}
      >
        <Text style={styles.browseButtonText}>Browse Movies</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.iconButton,
            { backgroundColor: theme.colors.cardBackground },
          ]}
        >
          <Feather name="arrow-left" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          My Library
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.iconButton,
            { backgroundColor: theme.colors.cardBackground },
          ]}
        >
          <Feather
            name={isDarkMode ? "sun" : "moon"}
            size={22}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {rentedMovies.length === 0 ? (
        renderEmptyState()
      ) : (
        <Animated.FlatList
          data={rentedMovies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeIn.delay(index * 100)}
              layout={Layout.springify()}
            >
              <MovieCard
                movie={item}
                onWatch={() => router.push(`/watchScreen?movieId=${item.id}`)}
                isRented={true}
              />
            </Animated.View>
          )}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  listContainer: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
