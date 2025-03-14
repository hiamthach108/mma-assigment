import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArtTool } from '@/types/artTool';

const FAVORITES_KEY = '@art_tools_favorites';

// Define the context shape
interface FavoritesContextType {
  favorites: ArtTool[];
  loading: boolean;
  error: Error | null;
  addFavorite: (artTool: ArtTool) => Promise<boolean>;
  removeFavorite: (artToolId: string) => Promise<boolean>;
  isFavorite: (artToolId: string) => boolean;
  clearAllFavorites: () => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
  resetFavorites: () => Promise<void>;
}

// Create the context with default values
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  loading: true,
  error: null,
  addFavorite: async () => false,
  removeFavorite: async () => false,
  isFavorite: () => false,
  clearAllFavorites: async () => false,
  refreshFavorites: async () => {},
  resetFavorites: async () => {},
});

// Provider component
interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<ArtTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load favorites from AsyncStorage
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const favoritesJSON = await AsyncStorage.getItem(FAVORITES_KEY);
      const loadedFavorites = favoritesJSON
        ? (JSON.parse(favoritesJSON) as ArtTool[])
        : [];
      setFavorites(loadedFavorites);
      return loadedFavorites;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to load favorites');
      setError(error);
      console.error('Error loading favorites:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Save favorites to AsyncStorage
  const saveFavorites = useCallback(async (updatedFavorites: ArtTool[]) => {
    try {
      const favoritesJSON = JSON.stringify(updatedFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, favoritesJSON);
      setFavorites(updatedFavorites);
      return true;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to save favorites');
      setError(error);
      console.error('Error saving favorites:', err);
      return false;
    }
  }, []);

  // Add art tool to favorites
  const addFavorite = useCallback(
    async (artTool: ArtTool) => {
      try {
        // Get fresh data from storage
        const currentFavorites = await loadFavorites();

        // Check if already a favorite
        if (!currentFavorites.some(item => item.id === artTool.id)) {
          const updatedFavorites = [...currentFavorites, artTool];
          return await saveFavorites(updatedFavorites);
        }
        return false;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to add favorite');
        setError(error);
        console.error('Error adding favorite:', err);
        return false;
      }
    },
    [loadFavorites, saveFavorites]
  );

  // Remove art tool from favorites
  const removeFavorite = useCallback(
    async (artToolId: string) => {
      try {
        // Get fresh data from storage
        const currentFavorites = await loadFavorites();

        const updatedFavorites = currentFavorites.filter(
          item => item.id !== artToolId
        );
        return await saveFavorites(updatedFavorites);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to remove favorite');
        setError(error);
        console.error('Error removing favorite:', err);
        return false;
      }
    },
    [loadFavorites, saveFavorites]
  );

  // Check if art tool is in favorites
  const isFavorite = useCallback(
    (artToolId: string) => {
      return favorites.some(item => item.id === artToolId);
    },
    [favorites]
  );

  // Clear all favorites
  const clearAllFavorites = useCallback(async () => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
      setFavorites([]);
      return true;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to clear favorites');
      setError(error);
      console.error('Error clearing favorites:', err);
      return false;
    }
  }, []);

  // Refresh favorites from storage
  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, [loadFavorites]);

  // Reset favorites to default
  const resetFavorites = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      setFavorites([]);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to reset favorites');
      setError(error);
      console.error('Error resetting favorites:', err);
    }
  }, []);

  // Create the context value
  const value: FavoritesContextType = {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearAllFavorites,
    refreshFavorites,
    resetFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
