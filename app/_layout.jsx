import React from 'react';
import "../global.css";
import { Stack } from 'expo-router';
import { MovieProvider } from '../context/MovieContext';
import { RentedProvider } from '../context/RentedContext';
import { WatchedProvider } from '../context/WatchedContext';
import { ThemeProvider as RNEThemeProvider } from '@rneui/themed';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';

const Layout = () => {
  return (
    <ThemeProvider>
      <ThemeWrapper />
    </ThemeProvider>
  );
};

const ThemeWrapper = () => {
  const { theme } = useTheme();

  return (
    <RNEThemeProvider theme={theme}>
      <MovieProvider>
        <RentedProvider>
          <WatchedProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </WatchedProvider>
        </RentedProvider>
      </MovieProvider>
    </RNEThemeProvider>
  );
};

export default Layout;
