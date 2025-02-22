import { createTheme } from "@rneui/themed";

export const lightTheme = createTheme({
  mode: "light",
  colors: {
    primary: "#FF8C00", // Dark Orange
    background: "#ffffff", // White background
    text: "#000000", // Black text
    cardBackground: "#FFE5B4", // Light Orange shade for cards
  },
  components: {
    Button: {
      raised: true,
      buttonStyle: {
        backgroundColor: "#FF8C00", // Orange buttons
      },
      titleStyle: {
        color: "#000000", // Black text for contrast
      },
    },
    Card: {
      containerStyle: {
        backgroundColor: "#FFE5B4", // Light Orange card
        borderRadius: 10,
        shadowOpacity: 0.1,
      },
    },
  },
});

export const darkTheme = createTheme({
  mode: "dark",
  colors: {
    primary: "#FFA500", // Brighter Orange
    background: "#000000", // Black background
    text: "#FFA500", // Orange text for contrast
    cardBackground: "#1E1E1E", // Dark Grey/Black cards
  },
  components: {
    Button: {
      raised: true,
      buttonStyle: {
        backgroundColor: "#FFA500", // Bright Orange buttons
      },
      titleStyle: {
        color: "#000000", // Black text for contrast
      },
    },
    Card: {
      containerStyle: {
        backgroundColor: "#1E1E1E", // Darker Grey/Black
        borderRadius: 10,
        shadowOpacity: 0.2,
      },
    },
  },
});
