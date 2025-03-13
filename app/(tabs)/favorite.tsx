import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import { ArtTool } from '@/types/artTool';
import ArtToolCard from '@/components/ArtToolCard';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect } from '@react-navigation/native';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoriteScreen() {
  const { favorites, loading, refreshFavorites } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh favorites when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused, refreshing favorites');
      refreshFavorites();
    }, [refreshFavorites])
  );

  // Handle manual refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshFavorites();
    setRefreshing(false);
  }, [refreshFavorites]);

  const renderItem = ({ item }: { item: ArtTool }) => {
    return (
      <View style={styles.cardContainer}>
        <ArtToolCard item={item} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && favorites.length === 0 ? (
        <View style={styles.centered}>
          <ThemedText>Loading...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No favorite art tools yet. Add some to see them here!
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#888"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: 4,
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
