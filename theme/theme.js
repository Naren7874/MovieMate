import { createTheme } from "@rneui/themed";

export const lightTheme = createTheme({
  mode: "light",
  colors: {
    primary: "#007bff",
    background: "#ffffff",
    text: "#000000",
    cardBackground: "#f8f9fa",
  },
  components: {
    Button: { raised: true },
    Card: {
      containerStyle: {
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowOpacity: 0.1,
      },
    },
  },
});

export const darkTheme = createTheme({
  mode: "dark",
  colors: {
    primary: "#00c6ff",
    background: "#121212",
    text: "#ffffff",
    cardBackground: "#1e1e1e",
  },
  components: {
    Button: { raised: true },
    Card: {
      containerStyle: {
        backgroundColor: "#1e1e1e",
        borderRadius: 10,
        shadowOpacity: 0.2,
      },
    },
  },
});
