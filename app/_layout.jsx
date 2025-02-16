import React from 'react';
import "../global.css";
import { Stack } from 'expo-router';
import { MovieProvider } from '../context/MovieContext';
import { RentedProvider } from '../context/RentedContext';

const Layout = () => {
  return (
    <MovieProvider>
      <RentedProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </RentedProvider>
    </MovieProvider>
  );
};

export default Layout;
