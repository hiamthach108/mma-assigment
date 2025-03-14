import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';
import { ArtTool } from '@/types/artTool';
import ArtToolCard from '@/components/ArtToolCard';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect } from '@react-navigation/native';
import { useFavorites } from '@/hooks/useFavorites';
import MyScrollView from '@/components/MyScrollView';
import LoadingScreen from '@/components/LoadingScreen';
import { BACKGROUND_COLOR } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function FavoriteScreen() {
  const { favorites, loading, refreshFavorites, resetFavorites } =
    useFavorites();
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

  // Handle reset favorites - direct action without alert
  const handleReset = async () => {
    try {
      await resetFavorites();
      refreshFavorites();
    } catch (error) {
      console.error('Error resetting favorites:', error);
    }
  };

  const renderItem = ({ item }: { item: ArtTool }) => {
    return (
      <View style={styles.cardContainer}>
        <ArtToolCard item={item} />
      </View>
    );
  };

  if (loading && favorites.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <MyScrollView style={styles.container}>
      {favorites.length > 0 && (
        <View style={styles.headerContainer}>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            <Text style={styles.resetBtnText}>Clear</Text>
          </Pressable>
        </View>
      )}

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
    </MyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resetBtnText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
