import ArtToolCard from '@/components/ArtToolCard';
import MyScrollView from '@/components/MyScrollView';
import { ThemedText } from '@/components/ThemedText';
import { getFavorites } from '@/config/helpers/asyncstorage';
import { ArtTool } from '@/types/artTool';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState<ArtTool[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const renderItem = ({ item }: { item: ArtTool }) => (
    <View style={styles.cardContainer} key={item.id}>
      <ArtToolCard item={item} />
    </View>
  );

  return (
    <MyScrollView>
      {loading ? (
        <ThemedText>Loading...</ThemedText>
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
            <View>
              <Text>No art tools found. Try adjusting your filters.</Text>
            </View>
          }
        />
      )}
    </MyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
