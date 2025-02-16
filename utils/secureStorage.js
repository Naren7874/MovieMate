import * as SecureStore from 'expo-secure-store';

// Function to save a token securely
export async function saveToken(key, value) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving token:", error);
  }
}

// Function to retrieve a stored token
export async function getToken(key) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
}

// Function to delete a stored token
export async function deleteToken(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error deleting token:", error);
  }
}
