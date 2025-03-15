import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArtTool } from '@/types/artTool';
import { Link } from 'expo-router';
import { useFavorites } from '@/hooks/useFavorites';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/Colors';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const FavoriteItemCard = ({ item }: { item: ArtTool }) => {
  const [isFav, setIsFav] = useState(false);
  const { favorites, isFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    setIsFav(isFavorite(item.id));
  }, [favorites, item.id, isFavorite]);

  const handleRemoveFavorite = async () => {
    try {
      await removeFavorite(item.id);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.deleteContainer}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash" size={32} color="white" />
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleRemoveFavorite}
      >
        <View style={styles.card}>
          <View style={styles.contentContainer}>
            <Text style={styles.name} numberOfLines={2}>
              {item.artName}
            </Text>
            <View style={styles.priceContainer}>
              {item.limitedTimeDeal ? (
                <>
                  <Text style={styles.discountedPrice}>
                    $
                    {(item.price * (1 - Number(item.limitedTimeDeal))).toFixed(
                      2
                    )}
                  </Text>
                  <Text style={styles.originalPrice}>${item.price}</Text>
                </>
              ) : (
                <Text style={styles.price}>${item.price}</Text>
              )}
            </View>

            <Link href={`/art-tools/${item.id}`} asChild>
              <View style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details</Text>
              </View>
            </Link>
          </View>

          <View style={styles.favoriteButton}>
            <Ionicons name="heart" size={26} color="#FF3B30" />
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  contentContainer: {
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E63946',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 25,
  },
  viewDetailsButton: {
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  viewDetailsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteContainer: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
  },
});

export default FavoriteItemCard;
