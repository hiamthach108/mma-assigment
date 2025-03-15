import { useState, useEffect } from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using expo icons
import { ArtTool } from '@/types/artTool';
import { Link } from 'expo-router'; // Assuming you're using expo-router
import { useFavorites } from '@/hooks/useFavorites';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/Colors';

const ArtToolCard = ({ item }: { item: ArtTool }) => {
  const [isFav, setIsFav] = useState(false);
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Update favorite status whenever favorites or item.id changes
  useEffect(() => {
    const status = isFavorite(item.id);
    setIsFav(status);
  }, [favorites, item.id, isFavorite]);

  const toggleFavorite = async () => {
    try {
      if (isFav) {
        await removeFavorite(item.id);
      } else {
        await addFavorite(item);
      }
      // No need to manually setIsFav here; useEffect will handle it
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Pressable style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <View style={styles.priceContainer}>
          {item.limitedTimeDeal ? (
            <>
              <Text style={styles.discountedPrice}>
                ${(item.price * (1 - Number(item.limitedTimeDeal))).toFixed(2)}
              </Text>
              <Text style={styles.originalPrice}>${item.price}</Text>
            </>
          ) : (
            <Text style={styles.price}>${item.price}</Text>
          )}
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {item.artName}
        </Text>

        <Link href={`/art-tools/${item.id}`} asChild>
          <Pressable style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </Pressable>
        </Link>
      </View>
      <Pressable
        style={styles.favoriteButton}
        onPress={toggleFavorite}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={24}
          color={isFav ? '#FF3B30' : '#8E8E93'}
        />
      </Pressable>

      {item.limitedTimeDeal ? (
        <View style={styles.dealBadge}>
          <Text style={styles.dealText}>
            {'-'}
            {Number(item.limitedTimeDeal) * 100}% Off
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
    // For iOS - approximating your box-shadow
    shadowColor: '#171a1f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    // For Android
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    padding: 12,
    position: 'relative',
  },
  brand: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  dealBadge: {
    backgroundColor: SECONDARY_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 12,
    left: 12,
  },
  dealText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  // Add these to your existing StyleSheet
  viewDetailsButton: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  viewDetailsText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default ArtToolCard;
