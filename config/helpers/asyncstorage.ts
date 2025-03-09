import { ArtTool } from '@/types/artTool';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@art_tools_favorites';

// Get all favorite art tools
export const getFavorites = async () => {
  try {
    const favoritesJSON = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJSON ? (JSON.parse(favoritesJSON) as ArtTool[]) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Add art tool to favorites
export const addFavorite = async (artTool: ArtTool) => {
  try {
    const favorites = await getFavorites();

    // Check if art tool is already in favorites
    if (!favorites.some((item: ArtTool) => item.id === artTool.id)) {
      const updatedFavorites = [...favorites, artTool];
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};

// Remove art tool from favorites
export const removeFavorite = async (artToolId: string) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(item => item.id !== artToolId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

// Check if art tool is in favorites
export const isFavorite = async (artToolId: string) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(item => item.id === artToolId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Clear all favorites
export const clearAllFavorites = async () => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
};
