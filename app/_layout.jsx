import React from 'react';
import "../global.css";
import { Stack } from 'expo-router';
import { MovieProvider } from '../context/MovieContext';
import { RentedProvider } from '../context/RentedContext';
import { WatchedProvider } from '../context/WatchedContext';

const Layout = () => {
  return (<>
    <MovieProvider>
      <RentedProvider>
        <WatchedProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        </WatchedProvider>
      </RentedProvider>
    </MovieProvider>
  </>
  );
};

export default Layout;