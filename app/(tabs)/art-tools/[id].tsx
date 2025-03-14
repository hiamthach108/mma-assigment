import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MyScrollView from '@/components/MyScrollView';
import { ArtTool } from '@/types/artTool';
import artToolApi from '@/config/api/artToolApi';
import LoadingScreen from '@/components/LoadingScreen';
import { useFavorites } from '@/hooks/useFavorites';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DetailPage = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<ArtTool | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isFav, setIsFav] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const fetchData = async (id: string) => {
    try {
      const artTool = await artToolApi.getArtToolById(id);
      setData(artTool);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artTools:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const detailId = id as string;
    fetchData(detailId);

    return () => {
      setData(null);
    };
  }, [id]);

  useEffect(() => {
    if (data) {
      setIsFav(isFavorite(data.id));
    }
  }, [data, isFavorite]);

  const toggleFavorite = async () => {
    if (!data) return;

    try {
      if (isFav) {
        await removeFavorite(data.id);
      } else {
        await addFavorite(data);
      }
      setIsFav(!isFav);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const averageRating = useMemo(() => {
    if (!data || !data.feedbacks || data.feedbacks.length === 0) {
      return 0;
    }

    const totalRating = data.feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );
    return totalRating / data.feedbacks.length;
  }, [data]);

  if (loading && !data) {
    return <LoadingScreen />;
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <MyScrollView
      contentContainerStyle={{
        paddingBottom: insets.bottom + 20,
      }}
    >
      <View style={styles.header}>
        <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? '#FF3B30' : '#8E8E93'}
          />
        </Pressable>
      </View>

      {/* Image Section */}
      <Image
        source={{ uri: data.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Product Info */}
      <View style={styles.infoContainer}>
        {data.limitedTimeDeal ? (
          <View style={styles.dealBadge}>
            <Text style={styles.dealText}>Sale</Text>
          </View>
        ) : (
          <></>
        )}

        <Text style={styles.brand}>{data.brand}</Text>
        <Text style={styles.title}>{data.artName}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${data.price.toFixed(2)}</Text>
        </View>

        <View style={styles.specContainer}>
          <View style={styles.specItem}>
            <Ionicons
              name={data.glassSurface ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={data.glassSurface ? '#4CD964' : '#FF3B30'}
            />
            <Text style={styles.specText}>
              {data.glassSurface ? 'Glass Surface' : 'No Glass Surface'}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>

      {/* Feedback Section */}
      <View style={styles.section}>
        <View style={styles.reviewHeader}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          {data.feedbacks && data.feedbacks.length > 0 ? (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingText}>
                {averageRating.toFixed(1)} ({data.feedbacks.length})
              </Text>
            </View>
          ) : (
            <Text style={styles.noReviewsText}>No reviews yet</Text>
          )}
        </View>

        {data.feedbacks && data.feedbacks.length > 0
          ? data.feedbacks.slice(0, 3).map((feedback, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{feedback.author}</Text>
                  <View style={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < feedback.rating ? 'star' : 'star-outline'}
                        size={14}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{feedback.comment}</Text>
              </View>
            ))
          : null}

        {data.feedbacks && data.feedbacks.length > 3 ? (
          <Pressable style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Reviews</Text>
            <Ionicons name="chevron-forward" size={16} color={PRIMARY_COLOR} />
          </Pressable>
        ) : null}
      </View>
    </MyScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backIconButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  brand: {
    fontSize: 16,
    color: '#777',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
  },
  dealBadge: {
    backgroundColor: SECONDARY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  dealText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  specContainer: {
    marginTop: 12,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  specText: {
    marginLeft: 8,
    fontSize: 15,
  },
  section: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  noReviewsText: {
    color: '#777',
    fontStyle: 'italic',
  },
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  reviewerName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
  },
  reviewText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginRight: 4,
  },
  bottomButtons: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default DetailPage;
